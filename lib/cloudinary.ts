import { v2 as cloudinary } from 'cloudinary';

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'drmqxz9cc',
  api_key: '136946656611862',
  api_secret: 'z-zwivNF0QfXblaUc3N_OeN1s68',
  secure: true,
});

// Helper function to upload image to Cloudinary
export async function uploadImageToCloudinary(file: File | Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: 'product-images',
      resource_type: 'image' as const,
      quality: 'auto',
      fetch_format: 'auto',
    };

    if (file instanceof File) {
      // Convert File to buffer for Node.js environment
      file.arrayBuffer().then(arrayBuffer => {
        const buffer = Buffer.from(arrayBuffer);
        
        // Create data URI for Cloudinary
        const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;
        
        cloudinary.uploader.upload(
          dataUri,
          uploadOptions,
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result!.secure_url);
            }
          }
        );
      }).catch(reject);
    } else {
      // Upload from Buffer
      const dataUri = `data:image/jpeg;base64,${file.toString('base64')}`;
      
      cloudinary.uploader.upload(
        dataUri,
        uploadOptions,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result!.secure_url);
          }
        }
      );
    }
  });
}

// Helper function to delete image from Cloudinary
export async function deleteImageFromCloudinary(publicId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
