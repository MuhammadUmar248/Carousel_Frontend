import { UploadPost, CarouselResponse, SavedCarousel } from '../types';

const STORAGE_KEY = 'saved_carousels';

export const storageService = {
  // Save a new carousel
  saveCarousel: (postData: UploadPost, carouselData: CarouselResponse): SavedCarousel => {
    const savedCarousel: SavedCarousel = {
      id: Date.now().toString(),
      title: postData.title,
      description: postData.description,
      accName: postData.accName,
      accUsername: postData.accUsername,
      imageUrl: postData.imageUrl,
      noOfPages: postData.noOfPages,
      images: carouselData.images || [],
      html: carouselData.html,
      createdAt: new Date().toISOString()
    };

    // Get existing carousels
    const existingCarousels = storageService.getCarousels();
    
    // Add new carousel to the beginning
    existingCarousels.unshift(savedCarousel);
    
    // Keep only the last 50 carousels to avoid storage issues
    const limitedCarousels = existingCarousels.slice(0, 50);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedCarousels));
    
    return savedCarousel;
  },

  // Get all saved carousels
  getCarousels: (): SavedCarousel[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading carousels from storage:', error);
      return [];
    }
  },

  // Get a specific carousel by ID
  getCarouselById: (id: string): SavedCarousel | null => {
    const carousels = storageService.getCarousels();
    return carousels.find(carousel => carousel.id === id) || null;
  },

  // Delete a carousel
  deleteCarousel: (id: string): boolean => {
    try {
      const carousels = storageService.getCarousels();
      const filteredCarousels = carousels.filter(carousel => carousel.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCarousels));
      return true;
    } catch (error) {
      console.error('Error deleting carousel:', error);
      return false;
    }
  },

  // Clear all carousels
  clearAllCarousels: (): boolean => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing carousels:', error);
      return false;
    }
  },

  // Get storage statistics
  getStorageStats: () => {
    const carousels = storageService.getCarousels();
    const storageSize = JSON.stringify(carousels).length;
    
    return {
      totalCarousels: carousels.length,
      storageSizeBytes: storageSize,
      storageSizeKB: Math.round(storageSize / 1024 * 100) / 100,
      oldestCarousel: carousels.length > 0 ? carousels[carousels.length - 1].createdAt : null,
      newestCarousel: carousels.length > 0 ? carousels[0].createdAt : null
    };
  },

  // Validate and refresh image URLs
  validateImages: async (carouselId: string): Promise<boolean> => {
    try {
      const carousel = storageService.getCarouselById(carouselId);
      if (!carousel || !carousel.images || carousel.images.length === 0) {
        return false;
      }

      // Check if images are still accessible
      const imageCheckPromises = carousel.images.map(async (imageUrl) => {
        try {
          const response = await fetch(imageUrl, { method: 'HEAD' });
          return response.ok;
        } catch {
          return false;
        }
      });

      const results = await Promise.all(imageCheckPromises);
      const validImages = results.filter(Boolean).length;

      // If less than 50% of images are valid, consider the carousel corrupted
      return validImages >= carousel.images.length * 0.5;
    } catch (error) {
      console.error('Error validating images:', error);
      return false;
    }
  },

  // Refresh carousel with fresh data
  refreshCarousel: (carouselId: string, freshData: Partial<SavedCarousel>): boolean => {
    try {
      const carousels = storageService.getCarousels();
      const index = carousels.findIndex(c => c.id === carouselId);
      
      if (index === -1) return false;

      // Update the carousel with fresh data
      carousels[index] = { ...carousels[index], ...freshData };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(carousels));
      return true;
    } catch (error) {
      console.error('Error refreshing carousel:', error);
      return false;
    }
  }
};
