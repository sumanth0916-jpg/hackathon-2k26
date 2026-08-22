import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { AiAttributes, Match, ReportCategory, ReportType } from '../types';
import { analyzeReportWithAi } from '../services/gemini';
import { createReport, uploadItemImage } from '../services/storageService';
import { ImageUploader } from '../components/common/ImageUploader';
import { LocationPicker } from '../components/common/LocationPicker';
import { Modal } from '../components/common/Modal';
import { CAMPUS_PRESETS } from '../utils/distance';
import {
  Sparkles,
  Send,
  Calendar,
  Clock,
  Tag,
  FileText,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Eye,
} from 'lucide-react';

const CATEGORIES: ReportCategory[] = [
  'Electronics',
  'Bags',
  'ID/Cards',
  'Keys',
  'Accessories',
  'Clothing',
  'Books',
  'Documents',
  'Sports',
  'Other',
];

export const ReportPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { currentUser, signInWithDemoUser } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [type, setType] = useState<ReportType>(
    (searchParams.get('type') as ReportType) || 'lost'
  );
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ReportCategory>('Electronics');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [eventTime, setEventTime] = useState(
    new Date().toTimeString().substring(0, 5)
  );
  const [locationName, setLocationName] = useState('Central Library');
  const [campusBuilding, setCampusBuilding] = useState('Central Library');
  const [latitude, setLatitude] = useState(CAMPUS_PRESETS[0].latitude);
  const [longitude, setLongitude] = useState(CAMPUS_PRESETS[0].longitude);
  const [contactPreference, setContactPreference] = useState<'in_app' | 'email' | 'phone_request'>('in_app');

  // Image & AI state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [aiPreview, setAiPreview] = useState<AiAttributes | null>(null);

  // Submission & match alert state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matchedResults, setMatchedResults] = useState<Match[] | null>(null);
  const [createdReportId, setCreatedReportId] = useState<string | null>(null);

  const handleImageSelected = async (file: File, base64: string, previewUrl: string) => {
    setSelectedFile(file);
    setImageBase64(base64);
    setImagePreviewUrl(previewUrl);

    // Run quick AI attribute extraction preview
    setIsAnalyzingImage(true);
    try {
      const res = await analyzeReportWithAi(
        title || 'Campus Item',
        description || 'Campus item photo',
        category,
        base64
      );
      setAiPreview(res.attributes);
      if (res.warning) {
        console.info(res.warning);
      }
    } catch {
      // Graceful
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const handleImageRemoved = () => {
    setSelectedFile(null);
    setImageBase64(null);
    setImagePreviewUrl('');
    setAiPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      // Auto-authenticate with demo user for smooth hackathon evaluation
      signInWithDemoUser('sarah');
    }

    if (!title.trim() || !description.trim()) {
      setError('Please fill in both item title and description.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Upload image to Cloud Storage or fallback dataUrl
      let finalImageUrl = imagePreviewUrl;
      if (selectedFile) {
        finalImageUrl = await uploadItemImage(selectedFile);
      } else if (!finalImageUrl) {
        // Fallback default category image
        finalImageUrl =
          category === 'Bags'
            ? 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800'
            : category === 'Electronics'
            ? 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800'
            : category === 'ID/Cards'
            ? 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800'
            : 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800';
      }

      // Run full Gemini analysis for report attributes
      const aiResult = await analyzeReportWithAi(
        title,
        description,
        category,
        imageBase64 || undefined
      );

      // Build search keywords for optimized discovery
      const searchKeywords = Array.from(
        new Set(
          `${title} ${description} ${category} ${locationName} ${aiResult.attributes.primaryColor} ${aiResult.attributes.brand || ''}`
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter((w) => w.length > 2)
        )
      );

      const activeUser = currentUser || {
        uid: 'user-sarah',
        displayName: 'Sarah Chen',
        email: 'sarah.chen@campus.edu',
      };

      const { report, matches } = await createReport({
        userId: activeUser.uid,
        userDisplayName: activeUser.displayName || 'Campus User',
        userEmail: activeUser.email || undefined,
        type,
        title: title.trim(),
        description: description.trim(),
        category,
        imageUrl: finalImageUrl,
        aiAttributes: aiResult.attributes,
        latitude,
        longitude,
        approximateLocation: locationName,
        campusBuilding,
        eventDate,
        eventTime,
        contactPreference,
        status: 'active',
        searchKeywords,
      });

      setCreatedReportId(report.id);

      showToast(
        `${type === 'lost' ? 'Lost' : 'Found'} Report Published!`,
        'AI matching pipeline analyzed existing reports across campus.',
        'success'
      );

      if (matches.length > 0 && matches[0].score >= 70) {
        // High confidence match found immediately!
        setMatchedResults(matches);
      } else {
        navigate(`/item/${report.id}`);
      }
    } catch (err: any) {
      console.error('Submission failed:', err);
      setError(err.message || 'Failed to submit report. Please check required fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center p-6 sm:p-8 rounded-3xl subtle-mesh-bg border border-slate-200/80 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-3 ai-badge-glow">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Multimodal AI Report Analyzer</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Submit a Campus Item Report
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mt-1">
          Upload details and photo. Our Gemini vision model and 5-factor scoring will search for matching reports automatically.
        </p>

        {/* Type Toggle Tabs */}
        <div className="mt-6 inline-flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setType('lost')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
              type === 'lost'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-500/25'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>I Lost Something</span>
          </button>
          <button
            type="button"
            onClick={() => setType('found')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
              type === 'found'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>I Found Something</span>
          </button>
        </div>
      </div>

      {/* Main Report Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6"
      >
        {/* Photo Upload Section */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Item Photo <span className="text-slate-400 font-normal">(Highly Recommended for AI Vision)</span>
          </label>
          <ImageUploader
            onImageSelected={handleImageSelected}
            onImageRemoved={handleImageRemoved}
            previewUrl={imagePreviewUrl}
            isAnalyzing={isAnalyzingImage}
          />

          {/* AI Extracted Attributes Live Preview */}
          {aiPreview && (
            <div className="mt-3 p-4 rounded-2xl bg-purple-50/80 border border-purple-100 text-xs animate-in fade-in duration-300">
              <div className="flex items-center gap-1.5 font-bold text-purple-900 mb-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>AI Vision Attribute Insights:</span>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="px-2.5 py-1 rounded-lg bg-white font-medium text-slate-700 shadow-xs">
                  Type: <strong>{aiPreview.objectType}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white font-medium text-slate-700 shadow-xs">
                  Color: <strong>{aiPreview.primaryColor}</strong>
                </span>
                {aiPreview.brand && (
                  <span className="px-2.5 py-1 rounded-lg bg-white font-medium text-slate-700 shadow-xs">
                    Brand: <strong>{aiPreview.brand}</strong>
                  </span>
                )}
                {aiPreview.distinctiveFeatures?.map((feat, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-white text-purple-800 font-medium shadow-xs">
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Title & Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Item Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Black Lenovo ThinkPad Laptop Backpack"
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ReportCategory)}
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium text-slate-700"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Detailed Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe distinctive marks, stickers, color shades, brand models, scratches, or contents inside..."
            className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        {/* Date & Time Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Event Date</span>
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Approximate Time</span>
            </label>
            <input
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-700"
            />
          </div>
        </div>

        {/* Campus Location Picker */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Campus Location
          </label>
          <LocationPicker
            locationName={locationName}
            latitude={latitude}
            longitude={longitude}
            onLocationChange={(loc) => {
              setLocationName(loc.locationName);
              setLatitude(loc.latitude);
              setLongitude(loc.longitude);
              if (loc.campusBuilding) setCampusBuilding(loc.campusBuilding);
            }}
          />
        </div>

        {/* Contact Preferences */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Safe Contact Preference
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setContactPreference('in_app')}
              className={`p-3 rounded-xl border text-left text-xs transition ${
                contactPreference === 'in_app'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              <div className="font-bold mb-0.5">In-App Notification</div>
              <span className="text-[10px] text-slate-500">Fastest & most private</span>
            </button>

            <button
              type="button"
              onClick={() => setContactPreference('email')}
              className={`p-3 rounded-xl border text-left text-xs transition ${
                contactPreference === 'email'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              <div className="font-bold mb-0.5">Campus Email Relay</div>
              <span className="text-[10px] text-slate-500">Masked student email</span>
            </button>

            <button
              type="button"
              onClick={() => setContactPreference('phone_request')}
              className={`p-3 rounded-xl border text-left text-xs transition ${
                contactPreference === 'phone_request'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              <div className="font-bold mb-0.5">Verified Claim Only</div>
              <span className="text-[10px] text-slate-500">Require admin approval</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit CTA */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted transmission • No sensitive data exposed</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-white shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 ${
              type === 'lost'
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/25'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'
            }`}
          >
            {isSubmitting ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Analyzing & Cross-Matching...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit {type === 'lost' ? 'Lost' : 'Found'} Report</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Immediate Match Alert Modal */}
      {matchedResults && matchedResults.length > 0 && (
        <Modal
          isOpen={true}
          onClose={() => {
            setMatchedResults(null);
            if (createdReportId) navigate(`/item/${createdReportId}`);
          }}
          title="🎉 Potential AI Match Detected Immediately!"
          subtitle={`LostX.ai reconciled your report against active campus inventory.`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-center">
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
              <div className="text-3xl font-black text-purple-700 mb-1">
                {matchedResults[0].score}% Match
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-200 text-purple-800">
                {matchedResults[0].confidenceTier}
              </span>
              <p className="text-xs text-slate-600 mt-3 italic">
                "{matchedResults[0].explanation}"
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 text-left space-y-1.5">
              {matchedResults[0].reasoning.map((r, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{r}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                onClick={() => navigate('/matches')}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/25 transition flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4" />
                <span>View Full Match in Dashboard</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
