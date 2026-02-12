import React, { useState, useEffect } from 'react';
import { CarouselResponse } from '../types';
import { Download, Eye, Share2, CheckCircle, ChevronLeft, ChevronRight, Square, CheckSquare, Trash2, AlertCircle } from 'lucide-react';
import './CarouselPreview.css';

interface CarouselPreviewProps {
  data: CarouselResponse;
  showSuccess?: boolean;
}

const CarouselPreview: React.FC<CarouselPreviewProps> = ({ data, showSuccess = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set());
  const [showSelection, setShowSelection] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(showSuccess);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(new Set());
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Hide success message after 4 seconds
  React.useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 4000); // 4 seconds

      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // Debug logging for image issues
  useEffect(() => {
    if (data.images && data.images.length > 0) {
      console.log('🖼️ Carousel Images:', data.images);
      data.images.forEach((img, idx) => {
        console.log(`  Slide ${idx + 1}:`, img?.substring(0, 100) + '...');
      });
    } else {
      console.log('⚠️ No images in carousel data');
    }
    setDebugInfo(`Images: ${data.images?.length || 0}, Current: ${currentSlide + 1}`);
  }, [data.images, currentSlide]);

  const handleDownloadAllImages = async () => {
    if (!data.images || data.images.length === 0) return;
    
    try {
      // Create a zip-like approach by downloading images sequentially
      for (let index = 0; index < data.images.length; index++) {
        const image = data.images[index];
        
        // Fetch the image as blob
        const response = await fetch(image);
        const blob = await response.blob();
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `carousel-slide-${index + 1}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Clean up the blob URL
        setTimeout(() => URL.revokeObjectURL(url), 100);
        
        // Small delay between downloads
        if (index < data.images.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    } catch (error) {
      console.error('Error downloading images:', error);
      // Fallback to simple approach
      data.images.forEach((image, index) => {
        setTimeout(() => {
          const a = document.createElement('a');
          a.href = image;
          a.download = `carousel-slide-${index + 1}.png`;
          a.target = '_blank'; // Try to open in new tab as fallback
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }, index * 300);
      });
    }
  };

  const handleDownloadSelectedImages = async () => {
    if (selectedImages.size === 0) return;
    
    try {
      const selectedArray = Array.from(selectedImages).sort((a, b) => a - b);
      
      for (let i = 0; i < selectedArray.length; i++) {
        const imageIndex = selectedArray[i];
        const image = data.images![imageIndex];
        
        // Fetch image as blob
        const response = await fetch(image);
        const blob = await response.blob();
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `carousel-slide-${imageIndex + 1}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Clean up blob URL
        setTimeout(() => URL.revokeObjectURL(url), 100);
        
        // Small delay between downloads
        if (i < selectedArray.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    } catch (error) {
      console.error('Error downloading selected images:', error);
      // Fallback to simple approach
      const selectedArray = Array.from(selectedImages).sort((a, b) => a - b);
      selectedArray.forEach((imageIndex, index) => {
        setTimeout(() => {
          const a = document.createElement('a');
          a.href = data.images![imageIndex];
          a.download = `carousel-slide-${imageIndex + 1}.png`;
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }, index * 300);
      });
    }
  };

  const handleImageSelection = (index: number) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }
    setSelectedImages(newSelection);
  };

  const handleSelectAll = () => {
    if (data.images && data.images.length > 0) {
      if (selectedImages.size === data.images.length) {
        setSelectedImages(new Set());
      } else {
        setSelectedImages(new Set(data.images.map((_, index) => index)));
      }
    }
  };

  const handleDownload = () => {
    if (!data.html) return;
    
    const blob = new Blob([data.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'carousel.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Instagram Carousel',
          text: 'Check out my AI-generated carousel!',
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const goToPreviousSlide = () => {
    const totalSlides = (data.images && data.images.length > 0) ? data.images.length : 1;
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    const totalSlides = (data.images && data.images.length > 0) ? data.images.length : 1;
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  if (!data.success) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 text-red-800">
          <div className="p-2 bg-red-100 rounded-lg">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">Error</h3>
            <p className="text-sm text-red-600 mt-1">{data.error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Warning for HTML-only carousels */}
      {(!data.images || data.images.length === 0) && data.html && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 text-orange-800">
            <AlertCircle className="w-5 h-5" />
            <div>
              <p className="font-medium">No Images Available</p>
              <p className="text-sm text-orange-600">
                This carousel was saved without images. The preview shows HTML only. 
                Try regenerating the carousel to get images.
              </p>
            </div>
          </div>
        </div>
      )}
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 max-w-2xl mx-auto animate-fade-in">
          <div className="flex items-center gap-3 text-green-800">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Carousel generated successfully!</span>
          </div>
        </div>
      )}

      {/* Main Preview Container */}
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Eye className="w-6 h-6" />
            Preview
          </h2>
          
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            
            <button
              onClick={handleDownload}
              disabled={!data.html}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Download HTML
            </button>
          </div>
        </div>

        {/* Carousel Preview - Full Size */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-600 font-mono">carousel.html</span>
            {data.images && data.images.length > 1 && (
              <span className="text-sm text-gray-500">
                {currentSlide + 1} / {data.images.length}
              </span>
            )}
          </div>
          <div className="bg-gray-900 p-4 overflow-visible">
            {data.images && data.images.length > 0 ? (
              <div className="relative" style={{ minHeight: '600px' }}>
                {/* Full Size Image Display */}
                <div className="flex justify-center items-center" style={{ minHeight: '600px' }}>
                  <img
                    src={data.images[currentSlide]}
                    alt={`Slide ${currentSlide + 1}`}
                    className="max-w-full max-h-[600px] object-contain rounded-lg shadow-2xl"
                    style={{ width: 'auto', height: 'auto' }}
                    crossOrigin="anonymous"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      console.error(`❌ Failed to load main slide ${currentSlide + 1}:`, data.images?.[currentSlide]);
                      setImageLoadErrors(prev => new Set(Array.from(prev).concat([currentSlide])));
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMyMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNjAgMTgwQzE3Ny42NzMgMTgwIDE5MiAxOTQuMzI3IDE5MiAyMTJDMTkyIDIyOS42NzMgMTc3LjY3MyAyNDQgMTYwIDI0NEMxNDIuMzI3IDI0NCAxMjggMjI5LjY3MyAxMjggMjEyQzEyOCAxOTQuMzI3IDE0Mi4zMjcgMTgwIDE2MCAxODBaIiBmaWxsPSIjRDRE0RDE4Ii8+CjxwYXRoIGQ9Ik0xMjggMjQwSDE5MlYyNTZIMTI4VjI0MFoiIGZpbGw9IiNERERERDEiLz4KPHN2Zz4K';
                    }}
                  />
                </div>
                
                {/* Navigation Arrows */}
                {data.images.length > 1 && (
                  <>
                    <button
                      onClick={goToPreviousSlide}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    
                    <button
                      onClick={goToNextSlide}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
                
                {/* Slide Counter */}
                {data.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {currentSlide + 1} / {data.images.length}
                  </div>
                )}
                
                {/* Error Overlay */}
                {imageLoadErrors.has(currentSlide) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg z-10">
                    <div className="text-center p-4">
                      <p className="text-red-600 font-medium mb-2">Image failed to load</p>
                      <p className="text-sm text-red-500 mb-2">{debugInfo}</p>
                      <p className="text-xs text-gray-500">Check browser console for details</p>
                    </div>
                  </div>
                )}
              </div>
            ) : data.html ? (
              <div className="flex justify-center">
                <div className="relative carousel-preview" style={{ width: '324px', height: '405px' }}>
                  <iframe
                    srcDoc={data.html}
                    className="w-full h-full bg-white rounded-lg shadow-2xl border-0"
                    title="Carousel Preview"
                    sandbox="allow-same-origin"
                    style={{ 
                      transform: 'scale(0.8)', 
                      transformOrigin: 'top center',
                      overflow: 'hidden'
                    }}
                  />
                  <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-gray-400">
                    Instagram Post Dimensions (1080×1350)
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-96 bg-white rounded flex items-center justify-center text-gray-500">
                No content available
              </div>
            )}
          </div>
        </div>

        {/* Individual Slides Grid */}
        {data.images && data.images.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                All Slides ({data.images.length})
              </h3>
              
              {showSelection && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
                  >
                    {selectedImages.size === data.images.length ? (
                      <>
                        <CheckSquare className="w-4 h-4" />
                        Deselect All
                      </>
                    ) : (
                      <>
                        <Square className="w-4 h-4" />
                        Select All
                      </>
                    )}
                  </button>
                  
                  {selectedImages.size > 0 && (
                    <button
                      onClick={() => setSelectedImages(new Set())}
                      className="flex items-center gap-2 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear Selection
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.images.map((image, index) => (
                <div key={index} className="relative group cursor-pointer" onClick={() => !showSelection && setCurrentSlide(index)}>
                  <div className="relative bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 group-hover:border-purple-400 transition-all duration-300">
                    {/* Selection Checkbox */}
                    {showSelection && (
                      <div className="absolute top-2 left-2 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageSelection(index);
                          }}
                          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                            selectedImages.has(index)
                              ? 'bg-purple-600 border-purple-600 text-white'
                              : 'bg-white border-gray-300 hover:border-purple-400'
                          }`}
                        >
                          {selectedImages.has(index) && <CheckSquare className="w-3 h-3" />}
                        </button>
                      </div>
                    )}
                    
                    <div className="aspect-[4/5] relative">
                      <img
                        src={image}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          console.error(`❌ Failed to load slide ${currentSlide + 1}:`, data.images?.[currentSlide]);
                          setImageLoadErrors(prev => new Set(Array.from(prev).concat([currentSlide])));
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMyMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNjAgMTgwQzE3Ny42NzMgMTgwIDE5MiAxOTQuMzI3IDE5MiAyMTJDMTkyIDIyOS42NzMgMTc3LjY3MyAyNDQgMTYwIDI0NEMxNDIuMzI3IDI0NCAxMjggMjI5LjY3MyAxMjggMjEyQzEyOCAxOTQuMzI3IDE0Mi4zMjcgMTgwIDE2MCAxODBaIiBmaWxsPSIjRDRE0RDE4Ii8+CjxwYXRoIGQ9Ik0xMjggMjQwSDE5MlYyNTZIMTI4VjI0MFoiIGZpbGw9IiNERERERDEiLz4KPHN2Zz4K';
                        }}
                      />
                      
                      {/* Current Slide Indicator */}
                      {currentSlide === index && !showSelection && (
                        <div className="absolute inset-0 bg-purple-600/20 border-2 border-purple-600 rounded-xl"></div>
                      )}
                      
                      {/* Selected Indicator */}
                      {selectedImages.has(index) && showSelection && (
                        <div className="absolute inset-0 bg-purple-600/10 border-2 border-purple-400 rounded-xl"></div>
                      )}
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                          <p className="text-sm font-medium">Slide {index + 1}</p>
                          <p className="text-xs opacity-75">{showSelection ? 'Click to select' : 'Click to view'}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Slide number badge */}
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-1 rounded-lg text-xs font-bold shadow-md">
                      {index + 1}
                    </div>
                    
                    {/* Current slide indicator dot */}
                    {currentSlide === index && !showSelection && (
                      <div className="absolute top-2 left-2 w-3 h-3 bg-purple-600 rounded-full"></div>
                    )}
                  
                  </div>
                </div>
              ))}
            </div>
            
            {/* Download All Button */}
            <div className="mt-6 text-center">
              {data.images && data.images.length > 0 && (
                <div className="flex flex-wrap justify-center items-center gap-3">
                  <button
                    onClick={() => setShowSelection(!showSelection)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors min-w-[160px] h-[44px]"
                  >
                    {showSelection ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                    {showSelection ? 'Done Selecting' : 'Select Images'}
                  </button>
                  
                  {showSelection && selectedImages.size > 0 && (
                    <button
                      onClick={handleDownloadSelectedImages}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors min-w-[160px] h-[44px]"
                    >
                      <Download className="w-4 h-4" />
                      Download Selected ({selectedImages.size})
                    </button>
                  )}
                  
                  <button
                    onClick={handleDownloadAllImages}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all min-w-[160px] h-[44px]"
                  >
                    <Download className="w-4 h-4" />
                    Download All Slides
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarouselPreview;
