import React, { useState } from 'react';
import CarouselForm from '../components/CarouselForm';
import CarouselPreview from '../components/CarouselPreview';
import { generateCarousel, convertHtmlToImages } from '../services/api';
import { storageService } from '../services/storage';
import { UploadPost, CarouselResponse } from '../types';

const GeneratorPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [carouselData, setCarouselData] = useState<CarouselResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFreshGeneration, setIsFreshGeneration] = useState(false);

  const handleGenerate = async (data: UploadPost) => {
    console.log('🎯 Starting carousel generation with data:', data);
    setLoading(true);
    setError(null);
    setCarouselData(null);
    setIsFreshGeneration(true);

    try {
      // First, generate the HTML carousel
      console.log('📝 Step 1: Generating HTML carousel...');
      const htmlResponse = await generateCarousel(data);
      console.log('✅ HTML generation successful:', htmlResponse);
      
      if (!htmlResponse.html) {
        console.error('❌ No HTML content received from backend');
        throw new Error('No HTML content received from backend');
      }

      // Try to convert HTML to images, but don't fail if it doesn't work
      let images: string[] = [];
      try {
        console.log('🖼️ Step 2: Converting HTML to images...');
        const imageResponse = await convertHtmlToImages(htmlResponse.html);
        images = imageResponse.images || [];
        console.log('✅ Image conversion successful:', images.length, 'slides');
      } catch (imageError) {
        console.warn('⚠️ Image conversion failed, proceeding with HTML only:', imageError);
        // Don't throw the error, just continue without images
        images = [];
      }
      
      // Combine both responses
      const combinedResponse: CarouselResponse = {
        html: htmlResponse.html,
        images: images,
        success: true
      };
      console.log('🎉 Final combined response:', combinedResponse);
      
      // Save to localStorage
      try {
        console.log('💾 Saving to localStorage...');
        storageService.saveCarousel(data, combinedResponse);
        console.log('✅ Saved to localStorage successfully');
      } catch (error) {
        console.error('❌ Error saving carousel:', error);
      }
      
      setCarouselData(combinedResponse);
      console.log('🎯 Carousel generation completed successfully!');
    } catch (err) {
      console.error('❌ Generation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('❌ Error message to display:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Create Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Instagram Carousel
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Fill in the details below and let AI create stunning carousel content for you
          </p>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 flex flex-col items-center gap-4 max-w-md mx-4">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-700 font-medium text-center">
                {carouselData ? 'Converting HTML to images...' : 'Generating carousel content...'}
              </p>
              <p className="text-sm text-gray-500 text-center">
                {carouselData 
                  ? 'This may take up to 90 seconds for complex carousels' 
                  : 'Creating your AI-powered carousel content'
                }
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 text-red-800">
              <span className="font-medium">Error:</span>
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!carouselData ? (
          <CarouselForm onSubmit={handleGenerate} loading={loading} />
        ) : (
          <div className="space-y-8">
            <CarouselPreview data={carouselData} showSuccess={isFreshGeneration} />
            
            {/* Create Another Button */}
            <div className="text-center">
              <button
                onClick={() => {
                  setCarouselData(null);
                  setError(null);
                  setIsFreshGeneration(false); // Reset fresh generation flag
                }}
                className="px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
              >
                Create Another Carousel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratorPage;
