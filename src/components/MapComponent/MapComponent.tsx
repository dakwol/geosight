import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./styles.scss";

const MapComponent = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);
  const [zoom] = useState(14);
  const [API_KEY] = useState("9qniwKQThKcoBngEU7mE");

  useEffect(() => {
    if (map.current) return;

    if (mapContainer.current) {
      // Получаем текущее местоположение пользователя
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setLng(longitude);
          setLat(latitude);

          map.current = new maplibregl.Map({
            container: mapContainer.current!,
            style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`,
            center: [longitude, latitude],
            zoom: zoom,
          });
        },
        (error) => {
          console.error("Error getting geolocation:", error);

          // Если доступ к геопозиции отклонен, устанавливаем центр карты в Москву
          setLng(37.6176);
          setLat(55.7558);

          map.current = new maplibregl.Map({
            container: mapContainer.current!,
            style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`,
            center: [37.6176, 55.7558],
            zoom: zoom,
          });
        }
      );
    }
  }, [API_KEY, zoom]);

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
};

export default MapComponent;
