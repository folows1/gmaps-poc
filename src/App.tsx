import { APIProvider, AdvancedMarker, Map, useMap } from "@vis.gl/react-google-maps";
import Icon from "./assets/mapitens.png";
import Casa from './assets/Plantas-de-casas-terreas-pequenas-.jpg';
import { useEffect, useRef, useState } from "react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";

function App() {


  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div style={{ height: "80vh", width: "80%" }}>
        <Map zoom={15} center={{ lat: -22.2341, lng: -45.9332 }} mapId={import.meta.env.VITE_MAP_ID}>
          <Markers />
          <EnvironmentOverlays />
        </Map>
      </div>
    </APIProvider>
  )
}

const EnvironmentOverlays = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const bounds = {
      north: -22.2341,
      south: -22.2345,
      east: -45.9332,
      west: -45.9336,
    };

    const bounds2 = {
      north: -22.2391,
      south: -22.2395,
      east: -45.9392,
      west: -45.9396,
    }

    const envOverlay = new google.maps.GroundOverlay(Casa, bounds);
    const envOverlay2 = new google.maps.GroundOverlay(Casa, bounds2);

    envOverlay.setMap(map);
    envOverlay2.setMap(map);
  }, [map]);

  return null;
}

type Point = google.maps.LatLngLiteral;

const Markers = () => {
  const points: Point[] = [
    { lat: -22.2341, lng: -45.9332 },
    { lat: -22.2342, lng: -45.9333 },
    { lat: -22.2343, lng: -45.9334 },
    { lat: -22.2344, lng: -45.9335 },
    { lat: -22.2345, lng: -45.9336 },
    { lat: -22.2391, lng: -45.9396 },
  ];

  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    if (!map) return;

    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, point: Point) => {
    if (marker && markers[`${point.lat} ${point.lng}`]) return;

    if (!marker && !markers[`${point.lat} ${point.lng}`]) return;

    setMarkers(prev => {
      if (marker) {
        return { ...prev, [`${point.lat} ${point.lng}`]: marker };
      }

      const newMarkers = { ...prev };
      delete newMarkers[`${point.lat} ${point.lng}`];
      return newMarkers;
    })
  }

  return <>
    {points.map(point => <AdvancedMarker position={point} key={`${point.lat} ${point.lng}`} ref={(marker) => setMarkerRef(marker, point)}>
      <img src={Icon} alt="Icon" />
    </AdvancedMarker>)}
  </>
}

export default App
