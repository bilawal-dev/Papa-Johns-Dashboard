'use client';

import dynamic from 'next/dynamic';

// Dynamically import Leaflet only on client side to avoid SSR issues
const MapComponent = dynamic(() => import('./map-client'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-slate-50/50 flex items-center justify-center">
      <div className="flex items-center space-x-3 text-slate-500">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span>Loading interactive map...</span>
      </div>
    </div>
  )
});

export default MapComponent; 