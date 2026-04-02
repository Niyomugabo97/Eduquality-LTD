"use client";

import { useState, useRef, useEffect } from "react";
import { createProduct } from "@/app/actions/product";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Upload, X, Image as ImageIcon, ShoppingBag } from "lucide-react";

interface SimpleEnhancedProductUploadFormProps {
  onSuccess?: () => void;
}

export default function SimpleEnhancedProductUploadForm({ onSuccess }: SimpleEnhancedProductUploadFormProps) {
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [contactNumber, setContactNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [category, setCategory] = useState("BEAUTY_PERSONAL_CARE");
  const [userId, setUserId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user ID on component mount
  useEffect(() => {
    const getUserId = async () => {
      try {
        const response = await fetch('/api/auth/user');
        if (response.ok) {
          const userData = await response.json();
          return userData.id;
        }
      } catch (error) {
        console.error('Error getting user ID:', error);
        return null;
      }
    };

    getUserId().then(id => {
      if (id) {
        setUserId(id);
      }
    });
  }, []);

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
      } else {
        alert(`Invalid image file or size too large. Please use JPEG, PNG, GIF, or WebP under 5MB.`);
      }
    });

    // Limit to 1 image only
    if (newImages.length > 1) {
      setPreviewImages([newImages[0]]);
    }
  };

  const removeImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    if (mainImageIndex === index) {
      setMainImageIndex(0);
    }
  };

  const setAsMainImage = (index: number) => {
    setMainImageIndex(index);
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

  const dataUrlToFile = async (dataUrl: string, filename: string, mimeType: string): Promise<File> => {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    
    // Add single image to FormData
    if (previewImages.length > 0) {
      const file = await dataUrlToFile(previewImages[0], `image.jpg`, 'image/jpeg');
      formData.append('image', file);
    }
    
    // Add userId to FormData
    formData.append('userId', userId || 'test-user-id-12345'); // Use actual user ID from auth
    
    // Use the new upload API instead of server action
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        onSuccess?.();
        // Reset form
        setPreviewImages([]);
        setMainImageIndex(0);
        alert("Product uploaded successfully!");
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError("Failed to upload product. Please try again.");
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      {/* Category */}
      <div>
        <Label htmlFor="category">Product Category</Label>
        <Select value={category} onValueChange={setCategory} name="category">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BEAUTY_PERSONAL_CARE">
              <div className="flex items-center">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Beauty and Personal Care Services
              </div>
            </SelectItem>
            <SelectItem value="WHOLESALE_SCHOOL_MATERIALS">
              <div className="flex items-center">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Wholesale School Materials
              </div>
            </SelectItem>
            <SelectItem value="SNACK_PRODUCTION">
              <div className="flex items-center">
                <div className="mr-2">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>Snack Production</span>
              </div>
            </SelectItem>
            <SelectItem value="MANUFACTURING_TOOLS">
              <div className="flex items-center">
                <div className="mr-2">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>Manufacturing Tools</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
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

      {/* Images Upload - Single Image Only */}
      <div>
        <Label>Product Image (Required)</Label>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="text-center">
              {previewImages.length > 0 ? (
                <div className="relative inline-block">
                  <img
                    src={previewImages[0]}
                    alt="Product preview"
                    className="w-32 h-32 object-cover rounded-lg shadow-md border-2 border-blue-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(0)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                    disabled={isSubmitting}
                  >
                    Choose Image
                  </button>
                  <p className="text-sm text-gray-500 mt-2">JPEG, PNG, GIF, WebP (Max 5MB)</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <Label>Product Location (Optional), 📍Click On "Use My Location" Button below to locate your product on Google Maps.</Label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude">🗺️</Label>
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
            <Label htmlFor="longitude">🗺️</Label>
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
          disabled={isSubmitting}
        >
          <div className="flex items-center">
            <div className="mr-2">
              <MapPin className="h-4 w-4" />
            </div>
            <span>Use My Location</span>
          </div>
        </Button>
      </div>

      {/* Location Details Section */}
      <div>
        <Label>Product Location Details (Optional)</Label>
        <p className="text-sm text-gray-600 mb-4">Enter the location details where your product is located</p>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="province">Province</Label>
            <Input
              id="province"
              name="province"
              type="text"
              placeholder="e.g., Kigali City"
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="district">District</Label>
            <Input
              id="district"
              name="district"
              type="text"
              placeholder="e.g., Nyarugenge"
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="sector">Sector</Label>
            <Input
              id="sector"
              name="sector"
              type="text"
              placeholder="e.g., Kimihurura"
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="village">Village</Label>
            <Input
              id="village"
              name="village"
              type="text"
              placeholder="e.g., Kacyiru"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Availability Section */}
      <div>
        <Label>Product Availability</Label>
        <div className="space-y-3 mt-2">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="available"
              checked={isAvailable}
              onCheckedChange={(checked: boolean) => setIsAvailable(checked)}
              disabled={isSubmitting}
            />
            <Label htmlFor="available" className="text-sm font-normal">
              Available for viewing/purchase
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox
              id="unavailable"
              checked={!isAvailable}
              onCheckedChange={(checked: boolean) => setIsAvailable(!checked)}
              disabled={isSubmitting}
            />
            <Label htmlFor="unavailable" className="text-sm font-normal">
              Unavailable/Booked
            </Label>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Select whether this product should be available for visitors to view and purchase, or marked as unavailable/booked.
        </p>
        {/* Hidden input for availability */}
        <input
          type="hidden"
          name="available"
          value={isAvailable ? "true" : "false"}
        />
      </div>

      {/* Contact Information Section */}
      <div>
        <Label>Contact Number or WhatsApp Number</Label>
        <div className="space-y-3 mt-2">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="contactMethod"
              checked={!!contactNumber || !!whatsappNumber}
              onCheckedChange={(checked) => {
                if (!checked) {
                  setContactNumber("");
                  setWhatsappNumber("");
                }
              }}
              disabled={isSubmitting}
            />
            <Label htmlFor="contactMethod" className="text-sm font-normal">
              Provide contact number for customers to reach you
            </Label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                placeholder="Enter phone number (e.g., +250788123456)"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
              <Input
                id="whatsappNumber"
                name="whatsappNumber"
                type="tel"
                placeholder="Enter WhatsApp number (e.g., +250788123456)"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Provide either a contact number or WhatsApp number (or both) so customers can reach you about this product.
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Uploading..." : "Upload Product"}
      </Button>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-700">
          {error}
        </div>
      )}
    </form>
  );
}
