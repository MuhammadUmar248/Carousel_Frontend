export interface UploadPost {
  title: string;
  description: string;
  imageUrl: string;
  noOfPages: number;
  accName: string;
  accUsername: string;
}

export interface CarouselResponse {
  html?: string;
  images?: string[];
  success?: boolean;
  error?: string;
  message?: string;
}

export interface SavedCarousel {
  id: string;
  title: string;
  description: string;
  accName: string;
  accUsername: string;
  imageUrl: string;
  noOfPages: number;
  images: string[];
  html?: string;
  createdAt: string;
  imagesValid?: boolean;
}
