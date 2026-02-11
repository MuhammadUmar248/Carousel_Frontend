import axios from 'axios';
import { UploadPost, CarouselResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // Increased to 60 seconds
});

export const generateCarousel = async (data: UploadPost): Promise<CarouselResponse> => {
  try {
    console.log('🚀 Sending data to backend:', data);
    console.log('🌐 API URL:', API_BASE_URL);
    
    // Try both possible endpoints
    let response;
    try {
      response = await api.post('/createpost/response', data);
    } catch (endpointError) {
      console.log('⚠️ First endpoint failed, trying alternative...');
      response = await api.post('/createpost/respone', data);
    }
    
    console.log('✅ Backend response status:', response.status);
    console.log('✅ Backend response data type:', typeof response.data);
    console.log('✅ Backend response length:', response.data?.length || 'N/A');
    
    // Handle different response formats
    const responseData = response.data;
    
    // If response is a string (HTML), wrap it
    if (typeof responseData === 'string') {
      console.log('📄 Response is HTML string, wrapping in object');
      return { html: responseData };
    }
    
    // If response has html field
    if (responseData.html) {
      console.log('📄 Response has html field');
      return responseData;
    }
    
    // If response has other structure, try to find HTML content
    if (responseData.content || responseData.data) {
      console.log('📄 Response has content/data field');
      return { html: responseData.content || responseData.data };
    }
    
    // Return as-is if no HTML found
    console.log('📄 Returning response as-is');
    return responseData;
  } catch (error) {
    console.error('❌ API Error Details:', error);
    if (axios.isAxiosError(error)) {
      console.error('❌ Axios Error:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      // Handle timeout specifically
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error('Request timed out. The live backend is taking longer than expected. Please try again or use fewer pages.');
      }
      
      // Handle network errors
      if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND') {
        throw new Error('Unable to connect to the live backend. Please check your internet connection.');
      }
      
      const errorMessage = error.response?.data?.detail || error.response?.data?.error || error.message || 'Failed to generate carousel';
      throw new Error(errorMessage);
    }
    console.error('❌ Non-Axios Error:', error);
    throw new Error('An unexpected error occurred');
  }
};

export const convertHtmlToImages = async (htmlContent: string): Promise<{ images: string[] }> => {
  try {
    console.log('🖼️ Converting HTML to images...');
    console.log('📄 HTML content length:', htmlContent.length);
    
    // Create a separate axios instance with longer timeout for image conversion
    const imageApi = axios.create({
      baseURL: API_BASE_URL,
      timeout: 90000, // 90 seconds for image conversion
    });
    
    let response;
    try {
      response = await imageApi.post('/createpost/htmlconverter', htmlContent, {
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    } catch (endpointError) {
      console.log('⚠️ Image converter endpoint failed, trying alternative...');
      response = await imageApi.post('/createpost/html-converter', htmlContent, {
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }
    
    console.log('✅ Image conversion response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Image conversion error:', error);
    if (axios.isAxiosError(error)) {
      console.error('❌ Image conversion details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      // Handle timeout specifically
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error('Image conversion is taking too long. Please try again with fewer pages or simpler content.');
      }
      
      // Handle network errors
      if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND') {
        throw new Error('Unable to connect to the live backend for image conversion. Please check your internet connection.');
      }
      
      const errorMessage = error.response?.data?.detail || error.response?.data?.error || error.message || 'Failed to convert HTML to images';
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred during image conversion');
  }
};
