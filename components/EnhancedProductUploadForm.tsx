"use client";

import { useState, useRef } from "react";
import { useFormState } from "react-dom";
import { createProduct } from "@/app/actions/product";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin, Upload, X, Image as ImageIcon, Video } from "lucide-react";

interface EnhancedProductUploadFormProps {
  onSuccess?: () => void;
}

export default function EnhancedProductUploadForm({ onSuccess }: EnhancedProductUploadFormProps) {
  const [state, formAction] = useFormState(createProduct, { success: false, message: "" });
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [mainVideoIndex, setMainVideoIndex] = useState<number | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewVideos, setPreviewVideos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    Array.from(files).forEach(file => {
      if (allowedTypes.includes(file.type) && file.size <= 5 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          newImages.push(result);
          setPreviewImages(prev => [...prev, ...newImages]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newVideos: string[] = [];
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    
    Array.from(files).forEach(file => {
      if (allowedTypes.includes(file.type) && file.size <= 50 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          newVideos.push(result);
          setPreviewVideos(prev => [...prev, ...newVideos]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    if (mainImageIndex === index) {
      setMainImageIndex(0);
    }
  };

  const removeVideo = (index: number) => {
    setPreviewVideos(prev => prev.filter((_, i) => i !== index));
    if (mainVideoIndex === index) {
      setMainVideoIndex(null);
    }
  };

  const setAsMainImage = (index: number) => {
    setMainImageIndex(index);
    setMainVideoIndex(null);
  };

  const setAsMainVideo = (index: number) => {
    setMainVideoIndex(index);
    setMainImageIndex(-1);
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latInput = document.getElementById('latitude') as HTMLInputElement;
          const lngInput = document.getElementById('longitude') as HTMLInputElement;
          if (latInput) latInput.value = position.coords.latitude.toString();
          if (lngInput) lngInput.value = position.coords.longitude.toString();
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get your location. Please enter coordinates manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const isPending = state && typeof state === 'object' && 'pending' in state ? state.pending : false;

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-6">
        {/* Title */}
        <div>
          <Label htmlFor="title">Product Title</Label>
          <Input
            id="title"
            name="title"
            type="text"
            placeholder="Enter product title"
            required
            className="w-full"
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe your product..."
            required
            rows={4}
            className="w-full resize-none"
          />
        </div>

        {/* Price */}
        <div>
          <Label htmlFor="price">Price (Optional)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="Enter product price"
            className="w-full"
          />
        </div>

        {/* Images Upload */}
        <div>
          <Label>Product Images (up to 2)</Label>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 text-[#F17105] hover:text-[#F17105]/90 font-semibold"
              >
                <Upload className="h-4 w-4" />
                Click to upload images
              </button>
              <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 5MB each</p>
            </div>

            {/* Image Previews */}
            {previewImages.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {previewImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {mainImageIndex === index && (
                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Main
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between mt-2">
                      <Button
                        type="button"
                        variant={mainImageIndex === index ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAsMainImage(index)}
                      >
                        {mainImageIndex === index ? "Main Image" : "Set as Main"}
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Videos Upload */}
        <div>
          <Label>Product Videos (up to 1)</Label>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                multiple
                onChange={handleVideoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                className="flex items-center space-x-2 text-[#F17105] hover:text-[#F17105]/90 font-semibold"
              >
                <Upload className="h-4 w-4" />
                Click to upload video
              </button>
              <p className="text-sm text-gray-500 mt-2">MP4, WebM up to 50MB</p>
            </div>

            {/* Video Previews */}
            {previewVideos.length > 0 && (
              <div className="space-y-4">
                {previewVideos.map((video, index) => (
                  <div key={index} className="relative group">
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                      <video
                        src={video}
                        className="w-full h-full object-cover"
                        controls={false}
                        muted
                      />
                      {mainVideoIndex === index && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          Main Video
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between mt-2">
                      <Button
                        type="button"
                        variant={mainVideoIndex === index ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAsMainVideo(index)}
                      >
                        {mainVideoIndex === index ? "Main Video" : "Set as Main"}
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeVideo(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        <div>
          <Label>Product Location (Optional)</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                placeholder="e.g., 40.7128"
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                placeholder="e.g., -74.0060"
                className="w-full"
              />
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleLocationClick}
            className="w-full mt-2"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Use My Location
          </Button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? "Uploading..." : "Upload Product"}
        </Button>

        {/* Error Message */}
        {state && typeof state === 'object' && state.message && (
          <div className={`p-4 rounded-lg ${state.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {state.message}
          </div>
        )}
      </form>
    </div>
  );
}
