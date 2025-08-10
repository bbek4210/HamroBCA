'use client';

import { useState } from 'react';
import { X, FileText, ZoomIn, ZoomOut, RotateCw, Maximize } from 'lucide-react';

interface ContentViewerProps {
  content: {
    _id: string;
    title: string;
    fileName: string;
    fileType: string;
    filePath: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function ContentViewer({ content, isOpen, onClose }: ContentViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen) return null;

  const isPDF = content.fileType === 'application/pdf';
  const isImage = content.fileType.startsWith('image/');
  const isText = content.fileType === 'text/plain';

  // Use Cloudinary URL if available, otherwise fallback to local uploads
  const fileUrl = content.filePath.startsWith('http') 
    ? content.filePath 
    : `https://hamrobca.onrender.com/uploads/${content.fileName}`;

  const handleZoomIn = () => setZoom(prev => Math.min(200, prev + 25));
  const handleZoomOut = () => setZoom(prev => Math.max(50, prev - 25));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleFullscreen = () => setIsFullscreen(!isFullscreen);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg w-full flex flex-col ${
        isFullscreen 
          ? 'h-screen max-w-none mx-0 rounded-none' 
          : 'max-w-7xl max-h-[95vh] mx-4'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {content.title}
            </h3>
            <p className="text-sm text-gray-500">{content.fileName}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Controls for images */}
            {isImage && (
              <>
                <button
                  onClick={handleZoomOut}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-600 min-w-[60px] text-center">
                  {zoom}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={handleRotate}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                  title="Rotate"
                >
                  <RotateCw className="h-4 w-4" />
                </button>
              </>
            )}

            {/* Controls for PDFs */}
            {isPDF && (
              <button
                onClick={handleFullscreen}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                <Maximize className="h-4 w-4" />
              </button>
            )}
            
            {/* Remove download button for user interface */}
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {isPDF && (
            <div className="w-full flex-1" style={{ 
              minHeight: isFullscreen ? 'calc(100vh - 140px)' : 'calc(95vh - 140px)' 
            }}>
              <iframe
                src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1&zoom=page-width`}
                className="w-full h-full border-0"
                title={content.title}
                style={{ 
                  height: isFullscreen ? 'calc(100vh - 140px)' : 'calc(95vh - 140px)' 
                }}
              />
            </div>
          )}

          {isImage && (
            <div className="flex items-center justify-center p-8 min-h-[400px]">
              <img
                src={fileUrl}
                alt={content.title}
                className="max-w-full max-h-full object-contain transition-transform duration-200"
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  transformOrigin: 'center'
                }}
              />
            </div>
          )}

          {isText && (
            <div className="p-8">
              <iframe
                src={fileUrl}
                className="w-full h-96 border border-gray-300 rounded-lg"
                title={content.title}
              />
            </div>
          )}

          {!isPDF && !isImage && !isText && (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="bg-gray-200 rounded-lg p-8 mb-4">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Preview Not Available
                </h4>
                <p className="text-gray-600 mb-4">
                  This file type cannot be previewed in the browser.
                </p>
                <p className="text-sm text-gray-500">
                  Please contact admin for access to this content.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-center">
          <p className="text-sm text-gray-600">
            {isPDF && "Use browser controls for additional PDF features"}
            {isImage && "Use zoom and rotate controls above"}
            {isText && "Text content displayed above"}
            {!isPDF && !isImage && !isText && "Content preview not available for this file type"}
          </p>
        </div>
      </div>
    </div>
  );
}
