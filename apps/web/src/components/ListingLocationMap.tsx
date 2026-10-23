import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, ShieldCheck, Layers, CheckCircle2 } from 'lucide-react';

interface ListingLocationMapProps {
  isPlot?: boolean;
  locationName: string;
  center?: [number, number]; // [lat, lng]
  polygonCoordinates?: [number, number][];
  radiusMeters?: number;
}

export function ListingLocationMap({
  isPlot = false,
  locationName,
  center = isPlot ? [13.2437, 77.7126] : [12.9784, 77.6408], // Devanahalli for plot, Indiranagar for camera
  polygonCoordinates = [
    [13.2445, 77.7118],
    [13.2445, 77.7135],
    [13.2431, 77.7135],
    [13.2431, 77.7118],
  ],
  radiusMeters = 2000,
}: ListingLocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [satelliteView, setSatelliteView] = useState(isPlot);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // @ts-expect-error leaflet icon override
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });

    const initialZoom = isPlot ? 17 : 13;
    const map = L.map(mapContainerRef.current, {
      center,
      zoom: initialZoom,
      zoomControl: false,
      scrollWheelZoom: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const initialTiles = L.tileLayer(
      isPlot
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution: isPlot ? 'Esri, Maxar' : '&copy; CARTO &copy; OpenStreetMap',
        maxZoom: 19,
      }
    );
    initialTiles.addTo(map);
    tileLayerRef.current = initialTiles;

    if (isPlot && polygonCoordinates.length >= 3) {
      // Draw actual plot boundary polygon
      const polygon = L.polygon(polygonCoordinates, {
        color: '#2563eb',
        weight: 3,
        fillColor: '#3b82f6',
        fillOpacity: 0.35,
      }).addTo(map);

      // Add corner markers
      polygonCoordinates.forEach((pt) => {
        const icon = L.divIcon({
          className: 'plot-vertex-pin',
          html: `<div style="
            width: 12px; 
            height: 12px; 
            border-radius: 50%; 
            background: #2563eb; 
            border: 2px solid #ffffff; 
            box-shadow: 0 2px 5px rgba(0,0,0,0.4);
          "></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });
        L.marker(pt, { icon }).addTo(map);
      });

      map.fitBounds(polygon.getBounds(), { padding: [50, 50] });
    } else {
      // Draw approximate privacy radius circle
      L.circle(center, {
        radius: radiusMeters,
        color: '#3b82f6',
        weight: 2,
        fillColor: '#60a5fa',
        fillOpacity: 0.18,
        dashArray: '6, 8',
      }).addTo(map);

      L.marker(center).addTo(map);
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [center, isPlot, polygonCoordinates, radiusMeters]);

  // Toggle satellite layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const newTiles = satelliteView
      ? L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          {
            attribution: 'Esri, Maxar',
            maxZoom: 19,
          }
        )
      : L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
          {
            attribution: '&copy; CARTO &copy; OpenStreetMap',
            maxZoom: 19,
          }
        );

    newTiles.addTo(map);
    tileLayerRef.current = newTiles;
  }, [satelliteView]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <MapPin size={20} className="text-primary" />
          {isPlot ? 'Exact Plot Boundaries & Topography' : 'Location & Approximate Privacy Radius'}
        </h2>
        {isPlot && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSatelliteView(!satelliteView)}
            className="rounded-pill gap-1.5 text-xs h-8"
          >
            <Layers size={13} />
            {satelliteView ? 'Street Map' : 'Satellite View'}
          </Button>
        )}
      </div>

      <div className="relative w-full h-[320px] rounded-2xl overflow-hidden border border-border shadow-inner">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Top Floating Badge */}
        <div className="absolute top-3 left-3 z-[400] flex items-center gap-2">
          {isPlot ? (
            <Badge className="bg-background/95 backdrop-blur-md text-foreground border border-border shadow-md gap-1.5 py-1 px-3 text-xs font-semibold">
              <CheckCircle2 size={14} className="text-emerald-500" />
              Verified Plot Polygon Boundary (2,400 sq.ft Mapped)
            </Badge>
          ) : (
            <Badge className="bg-background/95 backdrop-blur-md text-foreground border border-border shadow-md gap-1.5 py-1 px-3 text-xs font-semibold">
              <ShieldCheck size={14} className="text-blue-500" />
              Approximate 2km Area ({locationName})
            </Badge>
          )}
        </div>

        {/* Bottom Hint */}
        <div className="absolute bottom-3 left-3 right-3 z-[400] flex justify-between items-center px-3 py-1.5 rounded-xl bg-background/90 backdrop-blur-md border border-border text-[11px] text-muted-foreground shadow-sm">
          <span>
            {isPlot
              ? 'Satellite boundary captured via Khajiit plot drawer'
              : 'Exact house/flat address is shared securely after buyer-seller chat'}
          </span>
          <span className="font-semibold text-foreground/80">Bengaluru, KA</span>
        </div>
      </div>
    </div>
  );
}
