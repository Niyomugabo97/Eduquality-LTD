"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Star, MapPin, Phone, MessageCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price?: number;
  latitude?: number;
  longitude?: number;
  province?: string;
  district?: string;
  sector?: string;
  village?: string;
  available: boolean;
  contactNumber?: string;
  whatsappNumber?: string;
  media?: {
    images: string[]; // Array of image URLs (Cloudinary)
    mainImage?: string; // Primary image URL
  };
  user: {
    name: string;
    email: string;
  };
  createdAt: string;
  // Legacy fields for backward compatibility
  image?: string;
  mainImage?: string;
  images?: string[];
}

const categoryLabels = {
  BEAUTY_PERSONAL_CARE: "Beauty and Personal Care Services",
  WHOLESALE_SCHOOL_MATERIALS: "Wholesale School Materials",
  SNACK_PRODUCTION: "Snack Production",
  MANUFACTURING_TOOLS: "Manufacturing Tools"
};

const categoryIcons = {
  BEAUTY_PERSONAL_CARE: "💄",
  WHOLESALE_SCHOOL_MATERIALS: "📚",
  SNACK_PRODUCTION: "🍪",
  MANUFACTURING_TOOLS: "🔧"
};

const categoryDescriptions = {
  BEAUTY_PERSONAL_CARE: "Professional beauty and personal care products",
  WHOLESALE_SCHOOL_MATERIALS: "Quality educational materials and school supplies",
  SNACK_PRODUCTION: "Fresh and packaged snack products",
  MANUFACTURING_TOOLS: "Professional manufacturing tools and equipment"
};

export default function CategorizedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data || []);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const getProductsByCategory = (category: string, limit: number = 3) => {
    return products
      .filter(product => product.category === category)
      .slice(0, limit);
  };

  const getFeaturedProducts = () => {
    return products
      .filter(product => product.available)
      .slice(0, 6);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-0">
              <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Featured Products */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Featured Products</h2>
          <Link
            href="/products"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            View All Products
            <ShoppingBag className="w-4 h-4 ml-2" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFeaturedProducts().map((product) => (
            <ProductCard key={product.id} product={product} featured />
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.keys(categoryLabels).map((category) => {
          const categoryProducts = getProductsByCategory(category, 2);
          
          return (
            <Card key={category} className="group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{categoryIcons[category as keyof typeof categoryIcons]}</div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {categoryDescriptions[category as keyof typeof categoryDescriptions]}
                  </p>
                  <Link
                    href={`/products?category=${category}`}
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:scale-105 transition-all duration-300"
                  >
                    View Products
                    <ShoppingBag className="w-4 h-4 ml-2" />
                  </Link>
                </div>
                
                {categoryProducts.length > 0 && (
                  <div className="space-y-3">
                    {categoryProducts.map((product) => (
                      <div key={product.id} className="border-t pt-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={(() => {
                              // Handle Cloudinary URLs (new schema)
                              if (product.media?.mainImage) {
                                return product.media.mainImage;
                              }
                              // Handle Cloudinary images array
                              if (product.media && product.media.images && product.media.images.length > 0) {
                                return product.media.images[0];
                              }
                              // Handle legacy fields
                              if (product.image) {
                                return product.image;
                              }
                              if (product.mainImage) {
                                return product.mainImage;
                              }
                              if (product.images && product.images.length) {
                                return product.images[0];
                              }
                              // Fallback to placeholder
                              return '/images/profile.jpg';
                            })()}
                            alt={product.title}
                            className="w-24 h-24 object-cover rounded-lg shadow-md hover:scale-110 transition-all duration-300 cursor-pointer"
                            onError={(e) => {
                              console.log('Image load error:', e.currentTarget.src);
                              e.currentTarget.src = '/images/profile.jpg';
                            }}
                            onClick={() => {
                              // Open full image in new tab or modal
                              const imageSrc = (() => {
                                if (product.media?.mainImage) {
                                  return product.media.mainImage;
                                }
                                if (product.media && product.media.images && product.media.images.length > 0) {
                                  return product.media.images[0];
                                }
                                if (product.image) {
                                  return product.image;
                                }
                                if (product.mainImage) {
                                  return product.mainImage;
                                }
                                if (product.images && product.images.length) {
                                  return product.images[0];
                                }
                                return '/images/profile.jpg';
                              })();
                              window.open(imageSrc, '_blank');
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-gray-800 truncate">{product.title}</h4>
                            {product.price && (
                              <p className="text-blue-600 font-bold">FRW {product.price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function ProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  const { addToCart } = useCart();
  
  // Handle both old Cloudinary URLs and new MongoDB URLs with improved logic
  const mainImage = (() => {
    // Handle Cloudinary URLs (new schema)
    if (product.media?.mainImage) {
      return product.media.mainImage;
    }
    // Handle Cloudinary images array
    if (product.media && product.media.images && product.media.images.length > 0) {
      return product.media.images[0];
    }
    // Handle legacy fields
    if (product.image) {
      return product.image;
    }
    if (product.mainImage) {
      return product.mainImage;
    }
    if (product.images && product.images.length) {
      return product.images[0];
    }
    // Fallback to placeholder
    return '/images/profile.jpg';
  })();
  
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(mainImage);

  // Debug logging for image sources
  useEffect(() => {
    console.log('CategorizedProducts Debug - Image sources:', {
      productId: product.id,
      mediaMainImage: product.media?.mainImage,
      mediaImages: product.media?.images,
      legacyImage: product.image,
      legacyMainImage: product.mainImage,
      legacyImages: product.images,
      finalImageSrc: imageSrc
    });
  }, [product, imageSrc]);

  const handleAddToCart = () => {
    if (product.price) {
      addToCart(product);
    }
  };

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageSrc('/images/profile.jpg');
    }
  };

  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 overflow-hidden ${featured ? 'ring-2 ring-blue-500' : ''}`}>
      <div className="relative">
        <img
          src={imageSrc}
          alt={product.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
          onError={handleImageError}
          onLoad={() => setImageError(false)}
          onClick={() => {
            // Open full image in new tab
            window.open(imageSrc, '_blank');
          }}
        />
        {product.available && (
          <Badge className="absolute top-2 right-2 bg-green-500 text-white">
            Available
          </Badge>
        )}
        {featured && (
          <Badge className="absolute top-2 left-2 bg-orange-500 text-white">
            Featured
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-1">
          {product.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          {product.price && (
            <span className="text-xl font-bold text-blue-600">
              FRW {product.price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
          )}
          <Badge variant="outline" className="text-xs">
            {product.category.replace('_', ' ')}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">By {product.user.name}</span>
          <div className="flex space-x-6">
            <Link 
              href={`/product-details?id=${product.id}`}
              className="inline-flex items-center bg-white/90 hover:bg-white text-blue-600 border border-blue-200 hover:border-blue-300 px-3 py-2 rounded-lg font-medium hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              View Details
            </Link>
            {product.price && (
              <Button 
                onClick={handleAddToCart}
                size="sm" 
                className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ShoppingBag className="w-3 h-3 mr-1" />
                Add
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
