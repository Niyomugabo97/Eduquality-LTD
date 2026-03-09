import Image from "next/image";
import Link from "next/link";
import { User, Calendar, Heart, CheckCircle, XCircle } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description: string;
    image: string; // Changed from imageUrl to match database
    createdAt: string;
    available?: boolean; // Add availability field
    user: {
      name: string;
      email: string;
    };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-orange-200">
      {/* Availability Badge */}
      <div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-semibold opacity-90 ${
        product.available !== false 
          ? 'bg-green-500 text-white' 
          : 'bg-red-500 text-white'
      }`}>
        {product.available !== false ? (
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Available
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Not Available
          </div>
        )}
      </div>

      {/* Product Image */}
      <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <div className="text-gray-400 text-center p-4">
              <div className="text-4xl mb-2">📦</div>
              <div className="text-sm">No Image Available</div>
            </div>
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <button className="w-full bg-white/90 backdrop-blur-sm text-gray-900 py-2 px-4 rounded-lg font-semibold hover:bg-white transition-colors duration-200 flex items-center justify-center">
              <Heart className="w-4 h-4 mr-2" />
              Save Product
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
          {product.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {product.description}
        </p>

        {/* User Info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="bg-orange-100 p-2 rounded-full">
              <User className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{product.user.name}</p>
              <p className="text-xs text-gray-500 flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(product.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <Link href={`/product-details?id=${product.id}`} className="flex-1">
            <button className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200 text-sm">
              View Details
            </button>
          </Link>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
    </div>
  );
}
