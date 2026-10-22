import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ShieldCheck, MapPin } from 'lucide-react';

interface ApproximateLocationMapProps {
  center?: [number, number];
  onCenterChange?: (coords: [number, number]) => void;
  locationName: string;
}

export function ApproximateLocationMap({
  center = [12.9716, 77.5946],
  onCenterChange,
  locationName,
}: ApproximateLocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Fix leaflet marker icon
    // @ts-expect-error leaflet icon prototype override
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });

    const map = L.map(mapContainerRef.current, {
      center,
      zoom: 14,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
      }
    ).addTo(map);

    // Approximate privacy circle (1 km radius)
    const circle = L.circle(center, {
      radius: 1000,
      color: '#3b82f6',
      weight: 2,
      fillColor: '#60a5fa',
      fillOpacity: 0.15,
      dashArray: '4, 6',
    }).addTo(map);
    circleRef.current = circle;

    // Marker in center
    const marker = L.marker(center, { draggable: true }).addTo(map);
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      circle.setLatLng(pos);
      onCenterChange?.([pos.lat, pos.lng]);
    });
    markerRef.current = marker;

    map.on('click', (e) => {
      marker.setLatLng(e.latlng);
      circle.setLatLng(e.latlng);
      onCenterChange?.([e.latlng.lat, e.latlng.lng]);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [center, onCenterChange]);

  return (
    <div className="space-y-4">
      <div className="relative rounded-3xl overflow-hidden border-2 border-border shadow-inner">
        <div ref={mapContainerRef} className="w-full h-72 z-0" />

        <div className="absolute top-3 left-3 z-[400] px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-md border border-border shadow-sm flex items-center gap-2 text-xs font-medium text-foreground">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>Approximate 1km Privacy Radius</span>
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-muted/30 border border-border flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-muted-foreground" />
          <span>
            Selected Area: <strong>{locationName || 'Bangalore, KA'}</strong>
          </span>
        </div>
        <span>Click or drag pin to adjust privacy radius center</span>
      </div>
    </div>
  );
}
