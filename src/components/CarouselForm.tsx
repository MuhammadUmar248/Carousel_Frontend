import React, { useState } from 'react';
import { UploadPost } from '../types';
import { Wand2, Image as ImageIcon, Type, User, FileText } from 'lucide-react';

interface CarouselFormProps {
  onSubmit: (data: UploadPost) => void;
  loading: boolean;
}

const CarouselForm: React.FC<CarouselFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<UploadPost>({
    title: '',
    description: '',
    imageUrl: '',
    noOfPages: 3,
    accName: '',
    accUsername: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof UploadPost, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
          <Wand2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Instagram Carousel Generator</h1>
          <p className="text-gray-600 mt-1">Create stunning carousel posts with AI</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Type className="w-4 h-4" />
            Post Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Enter your carousel title..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            required
            minLength={3}
            maxLength={60}
          />
        </div>

        {/* Account Details */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <User className="w-4 h-4" />
            Account Details
          </label>
          
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={formData.accName}
              onChange={(e) => handleInputChange('accName', e.target.value)}
              placeholder="Account Name"
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
              maxLength={20}
            />
            
            <input
              type="text"
              value={formData.accUsername}
              onChange={(e) => handleInputChange('accUsername', e.target.value)}
              placeholder="@username"
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        {/* Profile Image URL */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <ImageIcon className="w-4 h-4" />
            Profile Image URL
          </label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => handleInputChange('imageUrl', e.target.value)}
            placeholder="https://example.com/profile-image.jpg"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <FileText className="w-4 h-4" />
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe what your carousel should be about..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
            required
            maxLength={150}
          />
        </div>

        {/* Number of Pages */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <ImageIcon className="w-4 h-4" />
            Number of Pages
          </label>
          <select
            value={formData.noOfPages}
            onChange={(e) => handleInputChange('noOfPages', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            {[3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>{num} page{num !== 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating Carousel...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Generate Carousel
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CarouselForm;
