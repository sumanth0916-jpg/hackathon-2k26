import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from './firebase';
import { AppNotification, Claim, Match, Report, ReportStatus, ReportType } from '../types';
import { INITIAL_DEMO_REPORTS } from './demoData';
import { findMatchesForReport } from './matchingEngine';

const STORAGE_KEYS = {
  REPORTS: 'campusconnect_reports_v1',
  MATCHES: 'campusconnect_matches_v1',
  CLAIMS: 'campusconnect_claims_v1',
  NOTIFICATIONS: 'campusconnect_notifications_v1',
  DEMO_INITIALIZED: 'campusconnect_demo_inited_v1',
};

// Seed local storage with demo reports if empty
export function initializeStorageIfNeeded(): void {
  if (!localStorage.getItem(STORAGE_KEYS.DEMO_INITIALIZED)) {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_DEMO_REPORTS));
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.DEMO_INITIALIZED, 'true');
  }
}

/**
 * Uploads an image to Firebase Storage or returns the local compressed dataUrl in fallback mode
 */
export async function uploadItemImage(
  file: File,
  folder = 'reports'
): Promise<string> {
  if (isFirebaseConfigured && storage) {
    try {
      const filename = `${folder}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
      const storageRef = ref(storage, filename);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (err) {
      console.warn('Firebase storage upload failed, falling back to client dataURL:', err);
    }
  }

  // Fallback: Read file as base64 data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

/**
 * Retrieves all reports (with optional filtering)
 */
export async function getReports(options?: {
  type?: ReportType;
  category?: string;
  status?: ReportStatus;
  searchQuery?: string;
  userId?: string;
  limitCount?: number;
}): Promise<Report[]> {
  initializeStorageIfNeeded();

  let reports: Report[] = [];

  if (isFirebaseConfigured && db) {
    try {
      const reportsRef = collection(db, 'reports');
      const constraints: any[] = [orderBy('createdAt', 'desc')];
      if (options?.type) constraints.push(where('type', '==', options.type));
      if (options?.limitCount) constraints.push(limit(options.limitCount));

      const q = query(reportsRef, ...constraints);
      const snap = await getDocs(q);
      snap.forEach((docSnap) => {
        reports.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
    } catch (err) {
      console.warn('Firestore fetch failed, using local storage fallback:', err);
      reports = getLocalReports();
    }
  } else {
    reports = getLocalReports();
  }

  // Client-side filtering
  return reports.filter((r) => {
    if (options?.type && r.type !== options.type) return false;
    if (options?.category && options.category !== 'All' && r.category !== options.category) return false;
    if (options?.status && r.status !== options.status) return false;
    if (options?.userId && r.userId !== options.userId) return false;
    if (options?.searchQuery) {
      const q = options.searchQuery.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchDesc = r.description.toLowerCase().includes(q);
      const matchLoc = r.approximateLocation.toLowerCase().includes(q);
      const matchCat = r.category.toLowerCase().includes(q);
      const matchAttr = r.aiAttributes
        ? `${r.aiAttributes.primaryColor} ${r.aiAttributes.brand || ''} ${r.aiAttributes.objectType}`.toLowerCase().includes(q)
        : false;
      return matchTitle || matchDesc || matchLoc || matchCat || matchAttr;
    }
    return true;
  });
}

function getLocalReports(): Report[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return raw ? JSON.parse(raw) : INITIAL_DEMO_REPORTS;
  } catch {
    return INITIAL_DEMO_REPORTS;
  }
}

function saveLocalReports(reports: Report[]): void {
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
}

/**
 * Retrieves a single report by ID
 */
export async function getReportById(id: string): Promise<Report | null> {
  initializeStorageIfNeeded();

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'reports', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...(docSnap.data() as any) };
      }
    } catch (err) {
      console.warn('Firestore fetch item failed, trying local storage:', err);
    }
  }

  const local = getLocalReports();
  return local.find((r) => r.id === id) || null;
}

/**
 * Saves a new report and triggers automatic AI matching
 */
export async function createReport(
  reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ report: Report; matches: Match[] }> {
  initializeStorageIfNeeded();

  const id = `report-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const newReport: Report = {
    ...reportData,
    id,
    createdAt: now,
    updatedAt: now,
    status: reportData.status || 'active',
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'reports', id), newReport);
    } catch (err) {
      console.warn('Firestore report write failed, saved locally:', err);
    }
  }

  const reports = getLocalReports();
  reports.unshift(newReport);
  saveLocalReports(reports);

  // Trigger Automatic AI Matching against all existing reports
  const allReports = await getReports();
  const potentialMatches = await findMatchesForReport(newReport, allReports, 60);

  if (potentialMatches.length > 0) {
    // Save generated matches
    for (const match of potentialMatches) {
      await saveMatch(match);
    }

    // Update report status to potential_match if high confidence match found
    if (potentialMatches[0].score >= 75) {
      newReport.status = 'potential_match';
      await updateReport(newReport.id, { status: 'potential_match' });

      // Create in-app notification for the user
      await createNotification({
        userId: newReport.userId,
        title: `AI Match Found (${potentialMatches[0].score}%)`,
        message: `LostX.ai found a ${potentialMatches[0].confidenceTier} for your "${newReport.title}".`,
        type: 'match_found',
        linkUrl: `/matches`,
      });
    }
  }

  return { report: newReport, matches: potentialMatches };
}

/**
 * Updates a report
 */
export async function updateReport(id: string, data: Partial<Report>): Promise<void> {
  const updatedAt = new Date().toISOString();
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'reports', id);
      await updateDoc(docRef, { ...data, updatedAt });
    } catch (err) {
      console.warn('Firestore update failed, updating local state:', err);
    }
  }

  const reports = getLocalReports();
  const index = reports.findIndex((r) => r.id === id);
  if (index !== -1) {
    reports[index] = { ...reports[index], ...data, updatedAt };
    saveLocalReports(reports);
  }
}

/**
 * Deletes a report
 */
export async function deleteReport(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'reports', id));
    } catch (err) {
      console.warn('Firestore delete failed:', err);
    }
  }

  const reports = getLocalReports().filter((r) => r.id !== id);
  saveLocalReports(reports);
}

/**
 * Match Management
 */
export async function saveMatch(match: Match): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'matches', match.id), match);
    } catch (err) {
      console.warn('Firestore match save failed:', err);
    }
  }

  const localMatches = getLocalMatches();
  const existingIdx = localMatches.findIndex((m) => m.id === match.id);
  if (existingIdx >= 0) {
    localMatches[existingIdx] = match;
  } else {
    localMatches.unshift(match);
  }
  localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(localMatches));
}

export function getLocalMatches(): Match[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MATCHES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function getAllMatches(): Promise<Match[]> {
  initializeStorageIfNeeded();
  let matches: Match[] = [];

  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'matches'));
      snap.forEach((docSnap) => {
        matches.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
    } catch {
      matches = getLocalMatches();
    }
  } else {
    matches = getLocalMatches();
  }

  // Hydrate full reports if missing
  const allReports = await getReports();
  const reportMap = new Map(allReports.map((r) => [r.id, r]));

  return matches.map((m) => ({
    ...m,
    lostReport: m.lostReport || reportMap.get(m.lostReportId),
    foundReport: m.foundReport || reportMap.get(m.foundReportId),
  })).filter((m) => m.lostReport && m.foundReport);
}

/**
 * Claims Management
 */
export async function createClaim(
  claimData: Omit<Claim, 'id' | 'createdAt' | 'status'>
): Promise<Claim> {
  const id = `claim-${Date.now()}`;
  const now = new Date().toISOString();
  const newClaim: Claim = {
    ...claimData,
    id,
    status: 'pending',
    createdAt: now,
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'claims', id), newClaim);
    } catch (err) {
      console.warn('Firestore claim create failed:', err);
    }
  }

  const raw = localStorage.getItem(STORAGE_KEYS.CLAIMS);
  const claims: Claim[] = raw ? JSON.parse(raw) : [];
  claims.unshift(newClaim);
  localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims));

  // Notify the report owner
  await createNotification({
    userId: newClaim.ownerId,
    title: 'New Claim Request Received',
    message: `${newClaim.claimantName} submitted a verification claim for "${newClaim.reportTitle || 'your item'}".`,
    type: 'claim_received',
    linkUrl: '/dashboard',
  });

  return newClaim;
}

export async function getClaims(userId?: string): Promise<Claim[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLAIMS);
    const claims: Claim[] = raw ? JSON.parse(raw) : [];
    if (!userId) return claims;
    return claims.filter((c) => c.ownerId === userId || c.claimantId === userId);
  } catch {
    return [];
  }
}

export async function updateClaimStatus(
  id: string,
  status: 'pending' | 'accepted' | 'rejected' | 'resolved'
): Promise<void> {
  const raw = localStorage.getItem(STORAGE_KEYS.CLAIMS);
  const claims: Claim[] = raw ? JSON.parse(raw) : [];
  const idx = claims.findIndex((c) => c.id === id);
  if (idx !== -1) {
    claims[idx].status = status;
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims));

    // Notify claimant if accepted
    if (status === 'accepted') {
      await createNotification({
        userId: claims[idx].claimantId,
        title: 'Claim Request Accepted!',
        message: `Your claim for "${claims[idx].reportTitle || 'the item'}" was approved by the reporter. You can now coordinate handover.`,
        type: 'claim_accepted',
        linkUrl: '/dashboard',
      });
    }
  }
}

/**
 * Notifications Management
 */
export async function createNotification(
  notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>
): Promise<AppNotification> {
  const id = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
  const item: AppNotification = {
    ...notif,
    id,
    read: false,
    createdAt: new Date().toISOString(),
  };

  const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  const notifs: AppNotification[] = raw ? JSON.parse(raw) : [];
  notifs.unshift(item);
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  return item;
}

export function getUserNotifications(userId: string): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const notifs: AppNotification[] = raw ? JSON.parse(raw) : [];
    return notifs.filter((n) => n.userId === userId || n.userId === 'all');
  } catch {
    return [];
  }
}

export function markNotificationAsRead(id: string): void {
  const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  const notifs: AppNotification[] = raw ? JSON.parse(raw) : [];
  const idx = notifs.findIndex((n) => n.id === id);
  if (idx !== -1) {
    notifs[idx].read = true;
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  }
}

/**
 * Resets local demo data to initial pristine demo dataset
 */
export async function resetDemoDataset(): Promise<void> {
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_DEMO_REPORTS));
  localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.DEMO_INITIALIZED, 'true');

  // Pre-generate matches for all demo reports
  const allReports = INITIAL_DEMO_REPORTS;
  const generatedMatches: Match[] = [];

  for (const rep of allReports) {
    if (rep.type === 'lost') {
      const matches = await findMatchesForReport(rep, allReports, 60);
      generatedMatches.push(...matches);
    }
  }

  // Deduplicate and save matches
  const uniqueMatches = Array.from(
    new Map(generatedMatches.map((m) => [m.id, m])).values()
  );
  localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(uniqueMatches));
}
