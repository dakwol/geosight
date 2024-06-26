import React, { useRef, useEffect, useState, FC } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./styles.scss";
import MapsApiRequest from "../../api/Maps/Maps";
import { iStyleMap } from "../../models/IMaps";
import useLocalStorage from "../../hooks/useLocalStorage";
import icons from "../../assets/icons/icons";

interface ISource {
  [key: string]: { id: string | number; name: string; description: string };
}

interface IMapProps {
  styleMap: iStyleMap | null;
  mapData: any;
}

const MapComponent: FC<IMapProps> = ({ styleMap, mapData }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const visibilityLayers = useLocalStorage("visibilityLayers");
  const mapApi = new MapsApiRequest();

  const [zoom] = useState(14);
  const API_KEY = "9qniwKQThKcoBngEU7mE";

  useEffect(() => {
    if (!styleMap || map.current) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;

        console.log("position.coords", position.coords);

        map.current = new maplibregl.Map({
          container: mapContainer.current ? mapContainer.current : "",
          style: styleMap.url,
          center: sessionStorage.getItem("positionMap")
            ? JSON.parse(sessionStorage.getItem("positionMap") || "")
            : [longitude, latitude],
          zoom: sessionStorage.getItem("zoom")
            ? JSON.parse(sessionStorage.getItem("zoom") || "")
            : zoom,
        });

        map.current.on("moveend", () => {
          const center = map?.current?.getCenter();
          const zoomSession = map?.current?.getZoom();
          sessionStorage.setItem(
            "positionMap",
            JSON.stringify([center?.lng, center?.lat])
          );
          sessionStorage.setItem("zoom", JSON.stringify(zoomSession));
        });

        map.current.on("load", () => {
          mapData.layers.forEach((layer: any) => {
            if (
              layer.is_active &&
              !localStorage.getItem("visibilityLayers")?.includes(layer.id)
            ) {
              const sourceId = `layer-${layer.id}`;

              if (!map.current?.getSource(sourceId)) {
                map.current?.addSource(sourceId, {
                  type: "vector",
                  tiles: [
                    `http://5.35.92.166:8001/martin/get_features/{z}/{x}/{y}?map_layer=${layer.id}`,
                  ],
                });
              }

              const { serialize_styles } = layer;

              if (serialize_styles) {
                if (serialize_styles.polygon) {
                  const polygonLayerId = `polygon-${layer.id}`;
                  const polygonPaint: any = {}; // новый объект paint для полигонов

                  polygonPaint["fill-opacity"] =
                    serialize_styles.polygon.polygon_opacity;
                  polygonPaint["fill-color"] =
                    serialize_styles.polygon.polygon_solid_color;
                  polygonPaint["fill-outline-color"] =
                    serialize_styles.polygon.polygon_border_color;

                  map.current?.addLayer({
                    id: polygonLayerId,
                    type: "fill",
                    source: sourceId,
                    filter: ["==", "$type", "Polygon"],
                    "source-layer": "get_features",
                    paint: polygonPaint, // используем polygonPaint для полигонов
                  });
                }
                if (serialize_styles.line) {
                  const lineLayerId = `line-${layer.id}`;
                  const linePaint: any = {}; // новый объект paint для линий

                  linePaint["line-opacity"] =
                    serialize_styles.line.line_opacity;

                  linePaint["line-width"] = serialize_styles.line.line_size;
                  linePaint["line-color"] =
                    serialize_styles.line.line_solid_color;
                  if (serialize_styles.line.line_style === "dash") {
                    linePaint["line-dasharray"] = [2, 2]; //пунктирная линия
                  }

                  map.current?.addLayer({
                    id: lineLayerId,
                    type: "line",
                    source: sourceId,
                    filter: ["==", "$type", "LineString"],
                    "source-layer": "get_features",
                    paint: linePaint, // используем linePaint для линий
                  });
                }
                if (serialize_styles.point) {
                  const pointLayerId = `circle-${layer.id}`;
                  const pointPaint: any = {}; // новый объект paint для точек

                  pointPaint["circle-opacity"] =
                    serialize_styles.point.point_opacity;
                  pointPaint["circle-color"] =
                    serialize_styles.point.point_solid_color;
                  pointPaint["circle-radius"] =
                    serialize_styles.point.point_radius;

                  map.current?.addLayer({
                    id: pointLayerId,
                    type: "circle",
                    source: sourceId,
                    filter: ["==", "$type", "Point"],
                    "source-layer": "get_features",
                    paint: pointPaint, // используем pointPaint для точек
                  });
                }
              }
            }
          });
        });
      },
      (error) => {
        console.error("Error getting geolocation:", error);

        // Fallback coordinates if geolocation fails
        const defaultLng = 37.6176;
        const defaultLat = 55.7558;

        map.current = new maplibregl.Map({
          //@ts-ignore
          container: mapContainer.current,
          style: `${styleMap.url}?key=${API_KEY}`,
          center: [defaultLng, defaultLat],
          zoom: zoom,
        });
      }
    );

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [styleMap, zoom, API_KEY, mapData.layers, visibilityLayers]);

  return (
    <div className="map-wrap">
      {mapData.layers ? (
        <div ref={mapContainer} className="map" />
      ) : (
        <img src={icons.mapLoading} className="loadingMap"></img>
      )}
    </div>
  );
};

export default MapComponent;
