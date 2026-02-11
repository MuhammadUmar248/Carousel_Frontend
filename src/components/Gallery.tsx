import React, { useState, useEffect } from 'react';
import { SavedCarousel } from '../types';
import { storageService } from '../services/storage';
import { Eye, Download, Trash2, Calendar, User, Image as ImageIcon, Grid3X3 } from 'lucide-react';
import CarouselPreview from './CarouselPreview';

const Gallery: React.FC = () => {
  const [savedCarousels, setSavedCarousels] = useState<SavedCarousel[]>([]);
  const [selectedCarousel, setSelectedCarousel] = useState<SavedCarousel | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [validatingImages, setValidatingImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCarousels();
  }, []);

  const loadCarousels = async () => {
    setLoading(true);
    try {
      const carousels = storageService.getCarousels();
      
      // Validate images for each carousel
      const validatedCarousels = await Promise.all(
        carousels.map(async (carousel) => {
          // Skip validation if already validated recently
          if (validatingImages.has(carousel.id)) {
            return carousel;
          }
          
          setValidatingImages(prev => new Set(prev).add(carousel.id));
          
          try {
            const isValid = await storageService.validateImages(carousel.id);
            setValidatingImages(prev => {
              const newSet = new Set(prev);
              newSet.delete(carousel.id);
              return newSet;
            });
            
            return {
              ...carousel,
              imagesValid: isValid
            };
          } catch (error) {
            console.error('Error validating carousel:', carousel.id, error);
            setValidatingImages(prev => {
              const newSet = new Set(prev);
              newSet.delete(carousel.id);
              return newSet;
            });
            
            return {
              ...carousel,
              imagesValid: false
            };
          }
        })
      );
      
      setSavedCarousels(validatedCarousels);
    } catch (error) {
      console.error('Error loading carousels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this carousel?')) {
      const success = storageService.deleteCarousel(id);
      if (success) {
        setSavedCarousels(prev => prev.filter(carousel => carousel.id !== id));
        if (selectedCarousel?.id === id) {
          setSelectedCarousel(null);
        }
      }
    }
  };

  const handlePreview = (carousel: SavedCarousel) => {
    setSelectedCarousel(carousel);
  };

  const handleDownload = async (carousel: SavedCarousel, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Download HTML if available
    if (carousel.html) {
      try {
        // Try direct window.location approach
        const a = document.createElement('a');
        a.href = `data:text/html;charset=utf-8,${encodeURIComponent(carousel.html)}`;
        a.download = `${carousel.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (error) {
        console.error('Error downloading HTML:', error);
        // Fallback: open in new tab
        window.open(carousel.html, '_blank');
      }
    }
    
    // Download images if available
    if (carousel.images && carousel.images.length > 0) {
      try {
        // Use: same robust approach as CarouselPreview
        for (let index = 0; index < carousel.images.length; index++) {
          const image = carousel.images[index];
          
          try {
            // Try direct download approach
            const a = document.createElement('a');
            a.href = image;
            a.download = `${carousel.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_slide_${index + 1}.png`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // Small delay between downloads
            if (index < carousel.images.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 300));
            }
          } catch (imgError) {
            console.error(`Error downloading image ${index + 1}:`, imgError);
          }
        }
      } catch (error) {
        console.error('Error downloading images:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = storageService.getStorageStats();

  if (selectedCarousel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
        <div className="container mx-auto px-4">
          <button
            onClick={() => setSelectedCarousel(null)}
            className="btn-animated mb-6 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium flex items-center gap-2"
          >
            ← Back to Gallery
          </button>
          
          <CarouselPreview 
            data={{
              html: selectedCarousel.html,
              images: selectedCarousel.images,
              success: true
            }} 
            showSuccess={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Carousel Gallery
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            View and manage your previously generated Instagram carousels
          </p>
          
          {/* Storage Stats */}
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <span>{stats.totalCarousels} carousels</span>
            <span>•</span>
            <span>{stats.storageSizeKB} KB used</span>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 flex gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${
                viewMode === 'grid' 
                  ? 'bg-purple-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${
                viewMode === 'list' 
                  ? 'bg-purple-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              List
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your carousels...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && savedCarousels.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No carousels yet</h3>
            <p className="text-gray-600 mb-6">Start creating your first Instagram carousel!</p>
            <a
              href="/generator"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Create Your First Carousel
            </a>
          </div>
        )}

        {/* Gallery Grid/List */}
        {!loading && savedCarousels.length > 0 && (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {savedCarousels.map((carousel) => (
              <div
                key={carousel.id}
                className="card-hover bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
                onClick={() => handlePreview(carousel)}
              >
                {/* Preview Image */}
                <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                  {carousel.images && carousel.images.length > 0 ? (
                    <>
                      <img
                        src={carousel.images[0]}
                        alt={carousel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMyMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNjAgMTgwQzE3Ny42NzMgMTgwIDE5MiAxOTQuMzI3IDE5MiAyMTJDMTkyIDIyOS42NzMgMTc3LjY3MyAyNDQgMTYwIDI0NEMxNDIuMzI3IDI0NCAxMjggMjI5LjY3MyAxMjggMjEyQzEyOCAxOTQuMzI3IDE0Mi4zMjcgMTgwIDE2MCAxODBaIiBmaWxsPSIjRDRE0RDE4Ii8+CjxwYXRoIGQ9Ik0xMjggMjQwSDE5MlYyNTZIMTI4VjI0MFoiIGZpbGw9IiNERERERDEiLz4KPHN2Zz4K';
                        }}
                      />
                      
                      {/* Image validation status overlay */}
                      {carousel.imagesValid === false && (
                        <div className="absolute inset-0 bg-red-900/80 flex items-center justify-center">
                          <div className="text-white text-center p-4">
                            <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-sm font-medium">Images Expired</p>
                            <p className="text-xs opacity-75">Regenerate required</p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <p className="text-sm font-medium">Click to preview</p>
                    </div>
                  </div>
                  
                  {/* Slide count badge */}
                  {carousel.images && carousel.images.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-lg text-xs font-medium">
                      {carousel.images.length} slides
                    </div>
                  )}
                  
                  {/* Validation status indicator */}
                  {carousel.imagesValid === false && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-medium">
                      Expired
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 truncate">{carousel.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{carousel.description}</p>
                  
                  {/* Account info */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-gray-200 rounded-full overflow-hidden">
                      {carousel.imageUrl ? (
                        <img src={carousel.imageUrl} alt={carousel.accName} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-full h-full text-gray-400 p-1" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{carousel.accName}</p>
                      <p className="text-xs text-gray-500 truncate">@{carousel.accUsername}</p>
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {formatDate(carousel.createdAt)}
                    </div>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={handleDelete.bind(null, carousel.id)}
                        className="btn-animated p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
