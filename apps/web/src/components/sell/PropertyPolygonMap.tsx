import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Pencil,
  RotateCcw,
  Check,
  Undo2,
  Layers,
  Sparkles,
} from 'lucide-react';

interface PropertyPolygonMapProps {
  initialCenter?: [number, number]; // [lat, lng]
  initialCoordinates?: [number, number][];
  onCoordinatesChange: (coords: [number, number][], areaSqFt: number) => void;
  locationName: string;
}

// Spherical polygon area calculation in square meters -> sq ft
function calculateGeodesicArea(coords: [number, number][]): number {
  if (coords.length < 3) return 0;
  const RADIUS = 6378137; // Earth radius in meters
  let total = 0;
  const n = coords.length;

  for (let i = 0; i < n; i++) {
    const p1 = coords[i];
    const p2 = coords[(i + 1) % n];

    const lat1 = (p1[0] * Math.PI) / 180;
    const lat2 = (p2[0] * Math.PI) / 180;
    const lng1 = (p1[1] * Math.PI) / 180;
    const lng2 = (p2[1] * Math.PI) / 180;

    total += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2));
  }

  const areaM2 = Math.abs((total * RADIUS * RADIUS) / 2);
  const areaSqFt = areaM2 * 10.7639104; // m2 to sq.ft
  return Math.round(areaSqFt);
}

export function PropertyPolygonMap({
  initialCenter = [12.9716, 77.5946], // Bangalore default
  initialCoordinates = [],
  onCoordinatesChange,
  locationName,
}: PropertyPolygonMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonLayerRef = useRef<L.Polygon | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [points, setPoints] = useState<[number, number][]>(initialCoordinates);
  const [isDrawing, setIsDrawing] = useState(false);
  const [satelliteView, setSatelliteView] = useState(false);
  const [areaSqFt, setAreaSqFt] = useState<number>(() =>
    calculateGeodesicArea(initialCoordinates)
  );

  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Fix leaflet default icon paths
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
      center: initialCenter,
      zoom: 17,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // High quality satellite or street tiles
    const streetTiles = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 20,
      }
    );

    streetTiles.addTo(map);
    tileLayerRef.current = streetTiles;

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [initialCenter]);

  // Toggle Satellite vs Street Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    if (satelliteView) {
      const sat = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Esri, Maxar, Earthstar Geographics',
          maxZoom: 19,
        }
      );
      sat.addTo(map);
      tileLayerRef.current = sat;
    } else {
      const street = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
          maxZoom: 20,
        }
      );
      street.addTo(map);
      tileLayerRef.current = street;
    }
  }, [satelliteView]);

  // Update visual polygon and markers whenever points change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    if (polygonLayerRef.current) {
      map.removeLayer(polygonLayerRef.current);
      polygonLayerRef.current = null;
    }

    if (points.length > 0) {
      // Add dot markers for each vertex
      points.forEach((pt, idx) => {
        const isStart = idx === 0;
        const icon = L.divIcon({
          className: 'custom-polygon-pin',
          html: `<div style="
            width: 14px; 
            height: 14px; 
            border-radius: 50%; 
            background: ${isStart ? '#10b981' : '#3b82f6'}; 
            border: 2px solid #ffffff; 
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
          "></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });

        L.marker(pt, { icon }).addTo(markersGroup);
      });

      // Render polygon or polyline
      if (points.length >= 3) {
        const poly = L.polygon(points, {
          color: '#2563eb',
          weight: 3,
          fillColor: '#3b82f6',
          fillOpacity: 0.25,
          dashArray: isDrawing ? '6, 6' : undefined,
        }).addTo(map);
        polygonLayerRef.current = poly;
      } else if (points.length === 2) {
        const line = L.polyline(points, {
          color: '#2563eb',
          weight: 3,
          dashArray: '6, 6',
        }).addTo(map);
        polygonLayerRef.current = line as unknown as L.Polygon;
      }
    }

    const calculated = calculateGeodesicArea(points);
    setAreaSqFt(calculated);
    onCoordinatesChange(points, calculated);
  }, [points, isDrawing, onCoordinatesChange]);

  // Click on map to add vertex when drawing mode is ON
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    function handleMapClick(e: L.LeafletMouseEvent) {
      if (!isDrawing) return;
      const newPt: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPoints((prev) => [...prev, newPt]);
    }

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [isDrawing]);

  const handleUndo = useCallback(() => {
    setPoints((prev) => prev.slice(0, -1));
  }, []);

  const handleReset = useCallback(() => {
    setPoints([]);
    setIsDrawing(false);
  }, []);

  const handleFitBounds = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map || points.length === 0) return;
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [points]);

  const centConversion = areaSqFt > 0 ? (areaSqFt / 435.6).toFixed(2) : '0';
  const acreConversion =
    areaSqFt > 43560 ? (areaSqFt / 43560).toFixed(2) : null;

  return (
    <div className="space-y-4">
      {/* Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-card border border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground">
              Plot Boundary Polygon Drawer
            </span>
            <Badge
              variant="outline"
              className="text-[10px] bg-primary/5 text-primary uppercase font-bold"
            >
              Exact Boundary Required
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {isDrawing
              ? 'Click points around the plot boundary on the map to define the perimeter.'
              : points.length >= 3
              ? 'Boundary defined! You can adjust or finish.'
              : 'Click "Start Drawing" and tap corners on the map to trace your land/property.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSatelliteView(!satelliteView)}
            className="rounded-pill gap-1.5 text-xs"
          >
            <Layers size={14} />
            {satelliteView ? 'Street View' : 'Satellite View'}
          </Button>

          {!isDrawing ? (
            <Button
              type="button"
              size="sm"
              onClick={() => setIsDrawing(true)}
              className="rounded-pill bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-white gap-1.5 text-xs font-semibold"
            >
              <Pencil size={14} />
              {points.length === 0 ? 'Start Drawing' : 'Continue Drawing'}
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={() => setIsDrawing(false)}
              className="rounded-pill bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-semibold"
            >
              <Check size={14} /> Finish Polygon
            </Button>
          )}

          {points.length > 0 && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleUndo}
                className="rounded-pill gap-1 text-xs h-8 px-2"
                title="Undo last point"
              >
                <Undo2 size={14} /> Undo
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="rounded-pill text-destructive hover:bg-destructive/10 text-xs h-8 px-2"
              >
                <RotateCcw size={14} /> Reset
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-border shadow-inner">
        <div
          ref={mapContainerRef}
          className="w-full h-[400px] z-0"
          style={{ cursor: isDrawing ? 'crosshair' : 'grab' }}
        />

        {/* Live Area HUD Badge */}
        {points.length >= 3 && (
          <div className="absolute top-4 left-4 z-[400] p-3 rounded-2xl bg-background/90 backdrop-blur-md border border-border shadow-lg flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
              <Sparkles size={18} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Calculated Plot Boundary Area
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold text-foreground">
                  {areaSqFt.toLocaleString('en-IN')} Sq. Ft.
                </span>
                <span className="text-xs text-muted-foreground">
                  ({centConversion} Cents
                  {acreConversion ? ` • ${acreConversion} Acres` : ''})
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Drawing Prompt Banner */}
        {isDrawing && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[400] px-4 py-2 rounded-full bg-black/85 text-white text-xs font-medium shadow-lg backdrop-blur-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Click on the map corners to add vertices. Tap "Finish Polygon" when
            done.
          </div>
        )}

        {/* Center / Focus Button */}
        {points.length >= 3 && (
          <button
            type="button"
            onClick={handleFitBounds}
            className="absolute bottom-4 right-4 z-[400] px-3 py-1.5 rounded-full bg-card/90 text-foreground border border-border text-xs font-semibold shadow-md hover:bg-card transition-colors"
          >
            Fit Boundary
          </button>
        )}
      </div>

      {/* Coordinates / Details Summary */}
      <div className="p-4 rounded-2xl bg-muted/30 border border-border text-xs text-muted-foreground flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-muted-foreground" />
          <span>
            Target Location: <strong>{locationName || 'Bangalore, KA'}</strong>
          </span>
        </div>
        <span>
          Polygon Vertices:{' '}
          <strong className="text-foreground">{points.length} points</strong>
        </span>
      </div>
    </div>
  );
}
