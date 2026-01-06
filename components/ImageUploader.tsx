import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, isLoading }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      onImageSelected(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClick = () => {
    if (!isLoading) {
        inputRef.current?.click();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center w-full h-64 sm:h-80
          border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 overflow-hidden
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:border-cinema-accent hover:bg-cinema-800/50'}
          ${preview ? 'border-cinema-accent' : 'border-cinema-700 bg-cinema-800/20'}
        `}
      >
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isLoading}
        />

        {preview ? (
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-contain p-2"
          />
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
            <div className="p-4 rounded-full bg-cinema-800 mb-4">
                <Upload className="w-8 h-8 text-cinema-accent" />
            </div>
            <p className="mb-2 text-lg font-semibold text-gray-200">
              Clique ou arraste uma foto aqui
            </p>
            <p className="text-sm text-gray-500">
              PNG, JPG ou WEBP (Max 10MB)
            </p>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <Loader2 className="w-10 h-10 text-cinema-accent animate-spin mb-4" />
            <p className="text-cinema-accent font-medium animate-pulse">Analisando cena...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;