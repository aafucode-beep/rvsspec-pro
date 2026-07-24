'use client';

import { useRef, useState, useCallback } from 'react';

interface ImageUploaderProps {
  image: string | null;
  onChange: (dataUrl: string | null) => void;
  className?: string;
  placeholder?: string;
  hint?: string;
  grayscale?: boolean;
  maxMB?: number;
}

const MAX_SIZE = 5 * 1024 * 1024; // 5MB default

export function ImageUploader({
  image,
  onChange,
  className = '',
  placeholder = '点击上传图片',
  hint,
  grayscale = false,
  maxMB = 5,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件');
      return;
    }
    if (file.size > (maxMB * 1024 * 1024)) {
      alert(`图片大小不能超过 ${maxMB}MB`);
      return;
    }

    setIsProcessing(true);
    try {
      // Compress image
      const dataUrl = await compressImage(file, 1800, 0.85);
      onChange(dataUrl);
    } catch {
      alert('图片处理失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  }, [maxMB, onChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div
      className={`upload-zone relative flex items-center justify-center overflow-hidden border border-dashed ${
        isDragging ? 'border-green-500 bg-green-50' : 'border-neutral-300'
      } ${image ? 'border-solid border-neutral-400' : ''} ${className}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {isProcessing ? (
        <div className="flex flex-col items-center gap-2 text-neutral-400">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-green-500" />
          <span className="text-xs">处理中...</span>
        </div>
      ) : image ? (
        <>
          <img
            src={image}
            alt=""
            className={`max-h-full max-w-full object-contain p-1 ${grayscale ? 'curve-img' : ''}`}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
            className="no-print absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-80"
          >
            ×
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center gap-1 py-4 text-neutral-400">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-xs">{placeholder}</span>
          {hint && <span className="text-[10px] text-neutral-300">{hint}</span>}
        </div>
      )}
    </div>
  );
}

// Image compression utility
async function compressImage(file: File, maxWidth: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        let { width, height } = img;
        if (width > maxWidth) {
          height = (maxWidth * height) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // White background for transparency
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}
