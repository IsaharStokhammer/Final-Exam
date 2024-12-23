import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

interface Location {
  latitude: number;
  longitude: number;
  data: string;
}

interface MapComponentProps {
  locations: Location[];
}

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const FitBounds: React.FC<{ locations: Location[] }> = ({ locations }) => {
  const map = useMap();

  useEffect(() => {
    if (locations.length === 0) return;
    const bounds = L.latLngBounds(locations.map(loc => [loc.latitude, loc.longitude] as [number, number]));
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [locations, map]);

  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ locations }) => {
  const center: LatLngExpression = locations.length
    ? [locations[0].latitude, locations[0].longitude]
    : [0, 0];

  return (
    <MapContainer center={center} zoom={13} style={{ height: '82vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {locations.map((location, index) => (
        <Marker key={index} position={[location.latitude, location.longitude]}>
          <Popup>{location.data}</Popup>
        </Marker>
      ))}
      <FitBounds locations={locations} />
    </MapContainer>
  );
};

export default MapComponent;
