import { Link } from 'react-router';
import { MapPin } from 'lucide-react';
import { Product } from '../data/products';
import { CountdownTimer } from './CountdownTimer';
import { DiscountBadge } from './DiscountBadge';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/product/${product.id}`}>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border group">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Discount Badge */}
            <div className="absolute top-3 right-3">
              <DiscountBadge discount={product.discount} />
            </div>

            {/* Quantity */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-medium text-gray-700">
              {product.quantity} left
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Name */}
            <h3 className="font-semibold text-gray-900 line-clamp-1">
              {product.name}
            </h3>

            {/* Store & Distance */}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{product.store}</span>
              <span className="text-gray-300">•</span>
              <span>{product.distance} km</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold text-gray-900">
                ${product.discountedPrice.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            </div>

            {/* Countdown */}
            <CountdownTimer expiresAt={product.expiresAt} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
