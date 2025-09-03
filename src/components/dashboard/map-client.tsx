'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useSmartsheetData } from '@/hooks/useSmartsheetData';
import { SmartsheetRow } from '@/types/smartsheet';

// Import leaflet CSS
import 'leaflet/dist/leaflet.css';

// Default coordinates for Colorado center (used when lat/lon is missing)
const DEFAULT_COORDINATES = { lat: 39.5501, lon: -105.7821 };

// Map project status to marker style
function getProjectStatus(project: SmartsheetRow): 'planning' | 'permitting' | 'production' | 'shipping' | 'installation' | 'complete' {
  const status = project.project_status?.toLowerCase() || '';
  
  if (project.project_status.toLowerCase().includes('complete')) {
    return 'complete';
  } else if (project.project_status.toLowerCase().includes('installation')) {
    return 'installation';
  } else if (project.project_status.toLowerCase().includes('shipping')) {
    return 'shipping';
  } else if (project.project_status.toLowerCase().includes('production')) {
    return 'production';
  } else if (project.project_status.toLowerCase().includes('permitting')) {
    return 'permitting';
  } else {
    return 'planning';
  }
}

// Get coordinates with fallback to default (with small random offset to avoid overlap)
function getProjectCoordinates(project: SmartsheetRow): { lat: number; lon: number; isDefault: boolean } {
  if (project.lat && project.lon && project.lat !== null && project.lon !== null) {
    return { lat: project.lat, lon: project.lon, isDefault: false };
  }
  console.log("MISSING COORDINATES");
  
  // Add small random offset (±0.1 degrees) to avoid overlapping markers
  const randomOffsetLat = (Math.random() - 0.5) * 0.2; // ±0.1 degrees
  const randomOffsetLon = (Math.random() - 0.5) * 0.2; // ±0.1 degrees
  
  return { 
    lat: DEFAULT_COORDINATES.lat + randomOffsetLat, 
    lon: DEFAULT_COORDINATES.lon + randomOffsetLon, 
    isDefault: true 
  };
}

export default function MapClient() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { data: smartsheetData, loading, error } = useSmartsheetData();

  useEffect(() => {
    // Don't initialize map until we have data
    if (loading || !smartsheetData?.rows) return;
    
    // Add delay to ensure DOM is fully ready
    const timer = setTimeout(() => {
      if (!mapContainerRef.current || mapRef.current) return;

      try {
        // Double-check the container has dimensions and is in the DOM
        const container = mapContainerRef.current;
        if (!container || 
            container.offsetWidth === 0 || 
            container.offsetHeight === 0 ||
            !document.contains(container)) {
          console.warn('Map container not ready, retrying...');
          return;
        }

        // Initialize map with zoom enabled for Colorado
        const map = L.map(container, {
          zoomControl: true,
          attributionControl: false,
          scrollWheelZoom: true,
          dragging: true,
          touchZoom: true,
          doubleClickZoom: true,
          boxZoom: true,
          keyboard: true
        });

        mapRef.current = map;

    // Create custom panes for layering
    map.createPane('markerPane');
    if (map.getPane('markerPane')) {
      map.getPane('markerPane')!.style.zIndex = '650';
    }
    
    map.createPane('patternPane');
    if (map.getPane('patternPane')) {
      map.getPane('patternPane')!.style.zIndex = '600';
    }

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Set initial view to Colorado
    map.setView([39.5501, -105.7821], 8); // Colorado center coordinates with zoom level 8

    // Load Colorado GeoJSON for state boundary
    const coloradoGeoJsonUrl = 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson';
    
    // For now, we'll skip the state boundary and focus on markers
    // You can add Colorado boundary later if needed
    
    // Set map as loaded
    setTimeout(() => setIsMapLoaded(true), 500);

    // Add project markers from Smartsheet data
    smartsheetData.rows.forEach(project => {
      const coordinates = getProjectCoordinates(project);
      const status = getProjectStatus(project);
      let markerStyle: any;
      
      // Style based on project status
      switch (status) {
        case 'complete':
          markerStyle = {
            radius: 8,
            fillColor: "#22c55e", // Green
            color: "#ffffff",
            weight: 2,
            opacity: 1,
            fillOpacity: 1,
            pane: 'markerPane'
          };
          break;
        case 'installation':
          markerStyle = {
            radius: 7,
            fillColor: "#3b82f6", // Blue
            color: "#ffffff",
            weight: 2,
            opacity: 1,
            fillOpacity: 1,
            pane: 'markerPane'
          };
          break;
        case 'shipping':
          markerStyle = {
            radius: 6,
            fillColor: "#f59e0b", // Orange
            color: "#ffffff",
            weight: 2,
            opacity: 1,
            fillOpacity: 1,
            pane: 'markerPane'
          };
          break;
        case 'production':
          markerStyle = {
            radius: 6,
            fillColor: "#8b5cf6", // Purple
            color: "#ffffff",
            weight: 2,
            opacity: 1,
            fillOpacity: 1,
            pane: 'markerPane'
          };
          break;
        case 'permitting':
          markerStyle = {
            radius: 5,
            fillColor: "#ef4444", // Red
            color: "#ffffff",
            weight: 2,
            opacity: 1,
            fillOpacity: 1,
            pane: 'markerPane'
          };
          break;
        case 'planning':
        default:
          markerStyle = {
            radius: 5,
            fillColor: "#6b7280", // Gray
            color: "#ffffff",
            weight: 2,
            opacity: 1,
            fillOpacity: 1,
            pane: 'markerPane'
          };
      }
      
      const hoverStyle = {
        ...markerStyle,
        radius: markerStyle.radius + 2,
        fillColor: "#e15759"
      };

      const marker = L.circleMarker([coordinates.lat, coordinates.lon], markerStyle);
      
      // Create popup content with project details
      const locationInfo = coordinates.isDefault ? 
        '<br/><span style="color: #ef4444; font-size: 12px;">⚠️ Location not found - showing default position</span>' : 
        `<br/><strong>Address:</strong> ${project.address}, ${project.city}, ${project.st}`;
      
      const popupContent = `
        <div style="min-width: 200px;">
          <strong>${project.project_name}</strong>
          ${locationInfo}
          <br/><strong>Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}
          <br/><strong>Order:</strong> ${project.order || 'N/A'}
          ${project.status_comments ? `<br/><strong>Comments:</strong> ${project.status_comments}` : ''}
        </div>
      `;
      
      marker.bindPopup(popupContent);
      
      marker.on('mouseover', () => { 
        marker.setStyle(hoverStyle); 
        marker.openPopup(); 
      });
      marker.on('mouseout', () => { 
        marker.setStyle(markerStyle); 
        marker.closePopup(); 
      });
      marker.addTo(map);
    });

      } catch (error) {
        console.error('Error initializing map:', error);
      }
    }, 100); // Small delay to ensure DOM is ready

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [loading, smartsheetData]);

  return (
    <div className="h-96 bg-white rounded-xl shadow-sm border border-primary transition-all duration-300 tile-hover relative overflow-hidden">
      <div 
        ref={mapContainerRef} 
        className="w-full h-full rounded-xl" 
        style={{ minHeight: '384px', minWidth: '100%' }}
      />
      
      {/* Loading overlay */}
      {(loading || !isMapLoaded) && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-[1001]">
          <div className="text-gray-500 text-sm">
            {loading ? 'Loading project data...' : 'Loading interactive map...'}
          </div>
        </div>
      )}
      
      {/* Error state */}
      {error && !loading && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-[1001]">
          <div className="text-red-500 text-sm">
            Error loading project data: {error}
          </div>
        </div>
      )}
      
      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200 text-xs leading-relaxed min-w-48 z-[1000]">
        <div className="font-semibold text-brand-primary mb-3 text-sm">
          Project Status Legend
        </div>
        
        <div>
          <div className="font-semibold text-gray-700 mb-1.5 text-xs uppercase tracking-wide">
            Project Phases
          </div>
          <div className="flex items-center mb-1 gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 border border-white"></div>
            <span className="text-secondary">Complete</span>
          </div>
          <div className="flex items-center mb-1 gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 border border-white"></div>
            <span className="text-secondary">Installation</span>
          </div>
          <div className="flex items-center mb-1 gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500 border border-white"></div>
            <span className="text-secondary">Shipping</span>
          </div>
          <div className="flex items-center mb-1 gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500 border border-white"></div>
            <span className="text-secondary">Production</span>
          </div>
          <div className="flex items-center mb-1 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 border border-white"></div>
            <span className="text-secondary">Permitting</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500 border border-white"></div>
            <span className="text-secondary">Planning</span>
          </div>
        </div>
      </div>
    </div>
  );
} 