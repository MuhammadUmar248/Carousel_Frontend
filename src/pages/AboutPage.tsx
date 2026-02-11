import React from 'react';
import { Wand2, Sparkles, Zap, Shield, Globe, Heart } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-2xl">
              <Wand2 className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              CarouselAI
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're revolutionizing social media content creation with artificial intelligence, 
            making it easier than ever to create professional Instagram carousel posts.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-20">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-8">
              At CarouselAI, we believe that everyone should be able to create stunning social media content 
              without needing design skills or spending hours on content creation. Our AI-powered platform 
              transforms your ideas into professional carousel posts in seconds.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-600">Pushing the boundaries of AI to create better content</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Speed</h3>
                <p className="text-gray-600">Delivering results in seconds, not hours</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Quality</h3>
                <p className="text-gray-600">Ensuring every carousel meets professional standards</p>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powered by Advanced AI</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform uses cutting-edge technology to deliver exceptional results
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Google Gemini Integration</h3>
              <p className="text-gray-600">
                Leveraging Google's powerful Gemini AI through LangChain to generate 
                engaging, context-aware content that resonates with your audience.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Templates</h3>
              <p className="text-gray-600">
                Pre-designed templates optimized for Instagram's carousel format, 
                ensuring your content always looks professional and engaging.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">10K+</div>
                <div className="text-purple-100">Carousels Generated</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50K+</div>
                <div className="text-purple-100">Happy Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">99.9%</div>
                <div className="text-purple-100">Uptime</div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Built by Creators, for Creators</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            We understand the challenges of content creation because we've been there. 
            Our team is dedicated to making social media content creation accessible to everyone.
          </p>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <p className="text-gray-600 italic">
              "CarouselAI transformed my social media strategy. I can now create weeks worth of content in just a few minutes!"
            </p>
            <div className="mt-4">
              <div className="font-semibold text-gray-900">- Sarah Johnson</div>
              <div className="text-sm text-gray-500">Social Media Manager</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
