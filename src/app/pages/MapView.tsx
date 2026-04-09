import { useEffect, useState } from 'react';
import { products } from '../data/products';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { DiscountBadge } from '../components/DiscountBadge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

// Dynamically import leaflet to avoid SSR issues
let L: any;

export function MapView() {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Dynamic import of leaflet and react-leaflet
    const initMap = async () => {
      if (typeof window !== 'undefined') {
        // Import Leaflet
        const leaflet = await import('leaflet');
        L = leaflet.default;

        // Import CSS
        await import('leaflet/dist/leaflet.css');

        // Fix marker icon issue
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        setMapReady(true);
      }
    };

    initMap();
  }, []);

  useEffect(() => {
    if (!mapReady || !L) return;

    // Group products by store location
    const storeLocations = products.reduce((acc, product) => {
      const key = `${product.lat}-${product.lng}`;
      if (!acc[key]) {
        acc[key] = {
          lat: product.lat,
          lng: product.lng,
          store: product.store,
          products: []
        };
      }
      acc[key].products.push(product);
      return acc;
    }, {} as Record<string, { lat: number; lng: number; store: string; products: typeof products }>);

    const locations = Object.values(storeLocations);

    // Initialize map
    const map = L.map('map').setView([40.7580, -73.9855], 14);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add markers
    locations.forEach((location) => {
      const marker = L.marker([location.lat, location.lng]).addTo(map);

      // Create popup content
      const popupContent = document.createElement('div');
      popupContent.className = 'p-2';
      popupContent.style.width = '280px';

      // Header
      const header = document.createElement('div');
      header.className = 'flex items-center gap-2 mb-3';
      header.innerHTML = `
        <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
        <div>
          <h3 class="font-semibold text-gray-900">${location.store}</h3>
          <p class="text-xs text-gray-600">${location.products.length} deals available</p>
        </div>
      `;
      popupContent.appendChild(header);

      // Products
      const productsContainer = document.createElement('div');
      productsContainer.className = 'space-y-2 max-h-[300px] overflow-y-auto';

      location.products.forEach((product) => {
        const productEl = document.createElement('a');
        productEl.href = `/product/${product.id}`;
        productEl.className = 'block';
        productEl.innerHTML = `
          <div class="flex gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
            <div class="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
              <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover" />
              <div class="absolute top-1 right-1 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                -${product.discount}%
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-medium text-sm text-gray-900 line-clamp-1 mb-1">
                ${product.name}
              </h4>
              <div class="flex items-baseline gap-2 mb-1">
                <span class="text-sm font-semibold text-gray-900">
                  $${product.discountedPrice.toFixed(2)}
                </span>
                <span class="text-xs text-gray-500 line-through">
                  $${product.originalPrice.toFixed(2)}
                </span>
              </div>
              <p class="text-xs text-gray-600">${product.quantity} left</p>
            </div>
          </div>
        `;
        productsContainer.appendChild(productEl);
      });

      popupContent.appendChild(productsContainer);

      // Footer button
      const footer = document.createElement('div');
      footer.className = 'mt-3 pt-3 border-t border-gray-100';
      footer.innerHTML = `
        <a href="/marketplace" class="block">
          <button class="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            View all deals
          </button>
        </a>
      `;
      popupContent.appendChild(footer);

      marker.bindPopup(popupContent, { maxWidth: 300 });
    });

    // Cleanup
    return () => {
      map.remove();
    };
  }, [mapReady]);

  return (
    <div className="h-[calc(100vh-4rem)] relative">
      {/* Map Info Panel */}
      <div className="absolute top-4 left-4 z-[1000] bg-white rounded-2xl shadow-lg p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 mb-1">Find stores near you</h2>
            <p className="text-sm text-gray-600">
              Click on a marker to see available deals at that location
            </p>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div id="map" className="h-full w-full"></div>
      
      {!mapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
