import React, { useState } from 'react';
import { Report } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { createClaim } from '../../services/storageService';
import { Modal } from '../common/Modal';
import { ShieldCheck, Send, AlertCircle, HelpCircle } from 'lucide-react';

interface ClaimModalProps {
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
  onClaimSubmitted?: () => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  report,
  isOpen,
  onClose,
  onClaimSubmitted,
}) => {
  const { currentUser } = useAuth();
  const { showToast } = useNotifications();
  const [message, setMessage] = useState('');
  const [verificationProof, setVerificationProof] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!report) return null;

  const isLostItem = report.type === 'lost';
  const modalTitle = isLostItem ? 'I Found This Item' : 'I Think This Is Mine';
  const modalSubtitle = `Connect safely with the reporter of "${report.title}"`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be signed in to submit a claim or contact the reporter.');
      return;
    }
    if (!message.trim()) {
      setError('Please provide a message or details.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await createClaim({
        reportId: report.id,
        reportTitle: report.title,
        reportType: report.type,
        ownerId: report.userId,
        claimantId: currentUser.uid,
        claimantName: currentUser.displayName || 'Campus Student',
        claimantEmail: currentUser.email || undefined,
        message: message.trim(),
        verificationProof: verificationProof.trim() || undefined,
      });

      showToast(
        'Claim Submitted Successfully',
        'The report owner has been notified. You will be updated once approved.',
        'success'
      );

      setMessage('');
      setVerificationProof('');
      onClose();
      if (onClaimSubmitted) onClaimSubmitted();
    } catch (err) {
      console.error(err);
      setError('Failed to submit claim request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      subtitle={modalSubtitle}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Item Summary Preview */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <img
            src={report.imageUrl}
            alt={report.title}
            className="w-14 h-14 rounded-xl object-cover ring-1 ring-slate-200"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate">{report.title}</h4>
            <p className="text-[11px] text-slate-500 truncate">{report.approximateLocation}</p>
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700">
              {report.category}
            </span>
          </div>
        </div>

        {/* Verification Proof Guidance */}
        <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 flex items-start gap-2.5 text-xs text-purple-900">
          <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Privacy & Safety Tip: </span>
            To prevent false claims, provide a distinctive mark, serial number clue, wallpaper description, or specific item contents.
          </div>
        </div>

        {/* Message Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Message to Reporter <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              isLostItem
                ? 'e.g. Hello, I found your backpack on the 2nd floor library steps and turned it in to desk staff.'
                : 'e.g. Hi! This looks like my backpack. I can confirm it has my initials on the inner pocket tag.'
            }
            className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        {/* Verification Clue */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Ownership Clue / Distinguishing Detail (Private)
          </label>
          <input
            type="text"
            value={verificationProof}
            onChange={(e) => setVerificationProof(e.target.value)}
            placeholder="e.g. Lock screen picture is a golden retriever / Student ID number ends in 492"
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white ai-gradient shadow-md shadow-indigo-500/25 hover:opacity-95 transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Submitting...' : 'Send Claim Request'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
