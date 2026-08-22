import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Sparkles, Check, AlertCircle } from 'lucide-react';
import { compressImage } from '../../utils/imageCompress';

interface ImageUploaderProps {
  onImageSelected: (file: File, base64: string, previewUrl: string) => void;
  onImageRemoved: () => void;
  previewUrl?: string;
  isAnalyzing?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  onImageRemoved,
  previewUrl,
  isAnalyzing = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setError('Image file is too large (maximum 12MB).');
      return;
    }

    try {
      setIsProcessing(true);
      const compressed = await compressImage(file, 1200, 1200, 0.85);
      onImageSelected(compressed.file, compressed.base64Data, compressed.dataUrl);
    } catch (err) {
      console.error(err);
      setError('Failed to process image. Please try another photo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {previewUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group shadow-sm">
          <img
            src={previewUrl}
            alt="Uploaded item preview"
            className="w-full h-64 object-cover object-center opacity-95 transition group-hover:scale-105 duration-300"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

          {/* Remove button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onImageRemoved();
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white backdrop-blur transition shadow-md"
            title="Remove photo"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Analysis indicator badge */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur border border-white/20">
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                  <span className="font-medium text-purple-200">Gemini analyzing visual features...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-medium">Photo ready for AI matching</span>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur font-medium text-xs transition"
            >
              Change
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
              : 'border-slate-300 hover:border-indigo-400 bg-slate-50/60 hover:bg-indigo-50/20'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100/80 flex items-center justify-center text-indigo-600 shadow-inner">
              {isProcessing ? (
                <Sparkles className="w-7 h-7 animate-spin text-indigo-600" />
              ) : (
                <UploadCloud className="w-7 h-7" />
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                {isProcessing ? 'Optimizing photo...' : 'Upload or snap an item photo'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Drag and drop here, or click to browse (JPG, PNG, WebP up to 12MB)
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-medium">
              <Sparkles className="w-3 h-3 text-purple-600" />
              AI analyzes colors, brand, and damage
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 mt-2 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
