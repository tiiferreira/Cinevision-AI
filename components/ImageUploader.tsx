import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, isLoading }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    e.target.value = '';
  };

  const processFile = (file: File) => {
    setError(null);
    
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Arquivo muito grande. Tamanho máximo: 20MB');
      return;
    }

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      setError('Formato não suportado. Use imagens (JPG, PNG, WEBP) ou vídeos (MP4, WEBM)');
      return;
    }

    setFileType(isImage ? 'image' : 'video');

    const reader = new FileReader();
    reader.onerror = () => {
      setError('Erro ao ler o arquivo. Tente novamente.');
    };
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (base64) {
        setPreview(base64);
        onImageSelected(base64);
      } else {
        setError('Erro ao processar o arquivo.');
      }
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

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setError(null);
    setFileType(null);
    if (inputRef.current) {
      inputRef.current.value = '';
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
          accept="image/*,video/*"
          onChange={handleFileChange}
          disabled={isLoading}
        />

        {preview ? (
          <div className="relative w-full h-full">
            {fileType === 'image' ? (
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <video 
                src={preview} 
                className="w-full h-full object-contain p-2"
                controls
                muted
              />
            )}
            {!isLoading && (
              <button
                onClick={handleClear}
                className="absolute top-2 right-2 p-2 bg-cinema-900/80 hover:bg-cinema-900 rounded-full transition-colors"
                title="Remover arquivo"
              >
                <span className="text-white text-xl">×</span>
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
            <div className="p-4 rounded-full bg-cinema-800 mb-4">
                <Upload className="w-8 h-8 text-cinema-accent" />
            </div>
            <p className="mb-2 text-lg font-semibold text-gray-200">
              Clique ou arraste uma imagem ou vídeo aqui
            </p>
            <p className="text-sm text-gray-500">
              Imagens: PNG, JPG, WEBP | Vídeos: MP4, WEBM (Max 20MB)
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded-lg flex items-center gap-2 text-red-200 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>{error}</p>
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