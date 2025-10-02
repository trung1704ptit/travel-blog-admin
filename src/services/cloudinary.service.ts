import axios from 'axios';

// Cloudinary upload response interface
export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  url: string;
  thumbnail_url?: string;
}

// Upload configuration
export interface UploadConfig {
  folder?: string;
  transformation?: string;
  generateThumbnail?: boolean;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
}
class CloudinaryService {
  private cloudName: string;
  private uploadPreset: string;
  private apiKey: string;

  constructor() {
    // Get Cloudinary config from environment variables
    this.cloudName = import.meta.env.VITE_CLOUDINARY_NAME || '';
    this.uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';
    this.apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY || '';

    if (!this.cloudName) {
      console.warn('VITE_CLOUDINARY_NAME is not set in environment variables');
    }
    if (!this.uploadPreset) {
      console.warn(
        'VITE_CLOUDINARY_UPLOAD_PRESET is not set in environment variables'
      );
    }
  }

  /**
   * Upload image to Cloudinary
   * @param file - File to upload
   * @param config - Upload configuration
   * @returns Promise with upload response
   */
  async uploadImage(
    file: File,
    config: UploadConfig = {}
  ): Promise<CloudinaryUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.uploadPreset);

      // Add folder if specified
      if (config.folder) {
        formData.append('folder', config.folder);
      }

      // Add transformation if specified
      if (config.transformation) {
        formData.append('transformation', config.transformation);
      }

      // Upload to Cloudinary
      const uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

      const response = await axios.post<CloudinaryUploadResponse>(
        uploadUrl,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const uploadResult = response.data;

      // Generate thumbnail URL if requested
      if (config.generateThumbnail) {
        const thumbnailWidth = config.thumbnailWidth || 300;
        const thumbnailHeight = config.thumbnailHeight || 200;
        uploadResult.thumbnail_url = this.generateThumbnailUrl(
          uploadResult.public_id,
          thumbnailWidth,
          thumbnailHeight
        );
      }

      return uploadResult;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  }

  /**
   * Upload image and generate thumbnail
   * @param file - File to upload
   * @param config - Upload configuration
   * @returns Promise with feature image URL and thumbnail URL
   */
  async uploadImageWithThumbnail(
    file: File,
    config: UploadConfig = {}
  ): Promise<{ imageUrl: string; thumbnailUrl: string }> {
    try {
      const uploadConfig: UploadConfig = {
        ...config,
        generateThumbnail: true,
        thumbnailWidth: config.thumbnailWidth || 300,
        thumbnailHeight: config.thumbnailHeight || 200,
      };

      const result = await this.uploadImage(file, uploadConfig);

      return {
        imageUrl: result.secure_url,
        thumbnailUrl: result.thumbnail_url || result.secure_url,
      };
    } catch (error) {
      console.error('Error uploading image with thumbnail:', error);
      throw error;
    }
  }

  /**
   * Generate thumbnail URL from public_id
   * @param publicId - Cloudinary public_id
   * @param width - Thumbnail width
   * @param height - Thumbnail height
   * @returns Thumbnail URL
   */
  generateThumbnailUrl(
    publicId: string,
    width: number = 300,
    height: number = 200
  ): string {
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/c_fill,w_${width},h_${height},g_auto,q_auto,f_auto/${publicId}`;
  }

  /**
   * Generate optimized image URL
   * @param publicId - Cloudinary public_id
   * @param options - Transformation options
   * @returns Optimized image URL
   */
  generateOptimizedUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string;
      format?: string;
    } = {}
  ): string {
    const {
      width,
      height,
      crop = 'fill',
      quality = 'auto',
      format = 'auto',
    } = options;

    let transformations = `c_${crop},q_${quality},f_${format}`;

    if (width) {
      transformations += `,w_${width}`;
    }
    if (height) {
      transformations += `,h_${height}`;
    }

    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transformations}/${publicId}`;
  }

  /**
   * Delete image from Cloudinary
   * @param publicId - Public ID of the image to delete
   * @returns Promise with deletion result
   */
  async deleteImage(publicId: string): Promise<void> {
    try {
      // Note: Deletion requires server-side API call with API secret
      // This is a placeholder - implement server-side deletion endpoint
      console.warn(
        'Image deletion should be handled server-side for security. Public ID:',
        publicId
      );

      // You should create a backend endpoint that handles deletion
      // Example:
      // await http.delete(`/api/cloudinary/delete/${publicId}`);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }
}

export const cloudinaryService = new CloudinaryService();
export default cloudinaryService;
