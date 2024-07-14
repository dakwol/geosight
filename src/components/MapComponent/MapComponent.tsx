import React, { useRef, useEffect, useState, FC, Fragment } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./styles.scss";
import MapsApiRequest from "../../api/Maps/Maps";
import { iStyleMap } from "../../models/IMaps";
import useLocalStorage from "../../hooks/useLocalStorage";
import icons from "../../assets/icons/icons";
import { Toast } from "primereact/toast";
import { useSelector } from "react-redux";
import apiConfig from "../../api/apiConfig";

interface ISource {
  [key: string]: { id: string | number; name: string; description: string };
}

interface IMapProps {
  styleMap: iStyleMap | null;
  mapData: any;
  address: string;
}

const MapComponent: FC<IMapProps> = ({ styleMap, mapData, address }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const visibilityLayers = useLocalStorage("visibilityLayers");
  const mapApi = new MapsApiRequest();

  const [zoom] = useState(14);
  const API_KEY = "9qniwKQThKcoBngEU7mE";

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const toast = useRef<Toast | null>(null);

  const handleAddressSearch = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${address}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lon, lat } = data[0];
        map.current?.setCenter([parseFloat(lon), parseFloat(lat)]);
        map.current?.setZoom(14);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Завершено",
          detail: "Адрес не найден",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching address coordinates:", error);
    }
  };

  useEffect(() => {
    if (address !== "") {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        handleAddressSearch();
      }, 1000); // 1 second delay
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [address]);

  useEffect(() => {
    if (!styleMap || map.current) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;

        console.log("position.coords", position.coords);

        map.current = new maplibregl.Map({
          container: mapContainer.current ? mapContainer.current : "",
          style: styleMap.url,
          center: sessionStorage?.getItem("positionMap")
            ? JSON.parse(sessionStorage?.getItem("positionMap") || "{}")
            : [longitude, latitude],
          zoom: sessionStorage?.getItem("zoom")
            ? JSON.parse(sessionStorage?.getItem("zoom") || "{}")
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
            console.log(
              'localStorage.getItem("visibilityLayers")',
              localStorage.getItem("visibilityLayers")
            );

            if (
              layer.is_active &&
              JSON.parse(
                localStorage.getItem("visibilityLayers") || ""
              )?.includes(layer.id)
            ) {
              console.log("activeLayer", layer);

              const sourceId = `layer-${layer.id}`;

              if (!map.current?.getSource(sourceId)) {
                map.current?.addSource(sourceId, {
                  type: "vector",
                  tiles: [
                    `${apiConfig.baseUrlMartin}martin/get_features/{z}/{x}/{y}?map_layer=${layer.id}`,
                  ],
                });
              }

              const { serialize_styles } = layer;

              if (serialize_styles) {
                if (serialize_styles.polygon) {
                  const polygonLayerId = `polygon-${layer.id}`; // используем шаблонные строки для id

                  let fillColor = serialize_styles.polygon.polygon_solid_color;

                  if (serialize_styles.polygon.polygon_color_palette) {
                    console.log(
                      "aaaaaaaa",
                      serialize_styles.polygon.polygon_color_palette
                    );

                    map.current?.addLayer({
                      id: polygonLayerId,
                      type: "fill",
                      source: sourceId,
                      filter: ["==", "$type", "Polygon"],
                      "source-layer": "get_features",
                      paint: {
                        "fill-opacity":
                          serialize_styles.polygon.polygon_opacity,
                        "fill-color":
                          serialize_styles.polygon.polygon_color_palette[2],
                        "fill-outline-color":
                          serialize_styles.polygon.polygon_border_color,
                      },
                    });
                  } else {
                    // добавляем слой для заливки полигона
                    map.current?.addLayer({
                      id: polygonLayerId,
                      type: "fill",
                      source: sourceId,
                      filter: ["==", "$type", "Polygon"],
                      "source-layer": "get_features",
                      paint: {
                        "fill-opacity":
                          serialize_styles.polygon.polygon_opacity,
                        "fill-color": fillColor,
                        "fill-outline-color":
                          serialize_styles.polygon.polygon_border_color,
                      },
                    });
                  }

                  const polygonBorderLayerId = `polygon-border-${layer.id}`; // используем шаблонные строки для id границы

                  // добавляем слой для границы полигона
                  map.current?.addLayer({
                    id: polygonBorderLayerId,
                    type: "line",
                    source: sourceId,
                    filter: ["==", "$type", "Polygon"],
                    "source-layer": "get_features",
                    paint: {
                      "line-color":
                        serialize_styles.polygon.polygon_border_color, // Цвет границы
                      "line-width":
                        serialize_styles.polygon.polygon_border_size || 1, // Ширина границы
                      "line-opacity":
                        serialize_styles.polygon.polygon_border_opacity || 1, // Прозрачность границы
                      "line-dasharray":
                        serialize_styles.polygon.polygon_border_style === "dash"
                          ? [1, 2]
                          : undefined, // Стиль границы, например пунктирная линия
                    },
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
                if (serialize_styles.polygon.polygon_label) {
                  map.current?.addLayer({
                    id: `${1}-label`,
                    type: "symbol",
                    source: sourceId,
                    filter: ["==", "$type", "Polygon"],
                    "source-layer": "get_features",
                    layout: {
                      "text-field": serialize_styles.polygon.polygon_label,
                      "text-font": [
                        `${serialize_styles.polygon.polygon_label_font} ${serialize_styles.polygon.polygon_label_font_style}`,
                      ] || ["Open Sans Semibold", "Arial Unicode MS Bold"],
                      "text-size":
                        serialize_styles.polygon.polygon_label_font_size || 12,
                      "text-anchor": "center",
                    },
                    paint: {
                      "text-color":
                        serialize_styles.polygon.polygon_label_font_color ||
                        "#000000",
                      "text-opacity":
                        serialize_styles.polygon.polygon_label_font_opacity ||
                        1,
                    },
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

  const zoomIn = () => {
    if (map.current) {
      map.current.zoomIn();
    }
  };

  const zoomOut = () => {
    if (map.current) {
      map.current.zoomOut();
    }
  };

  const centerMap = () => {
    if (map.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          map.current?.setCenter([longitude, latitude]);
          map.current?.setZoom(14);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    }
  };

  return (
    <Fragment>
      <Toast className="toastContainer" ref={toast}></Toast>
      <div className="map-wrap">
        {mapData.layers ? (
          <Fragment>
            <div ref={mapContainer} className="map" />
            <div className="mapControls">
              <button onClick={centerMap} className="mapCenter">
                <img src={icons.my_location}></img>
              </button>
              <div className="mapZoomContainer">
                <button className="buttonZoom" onClick={zoomIn}>
                  +
                </button>
                <div className="line"></div>
                <button className="buttonZoom" onClick={zoomOut}>
                  -
                </button>
              </div>
            </div>
          </Fragment>
        ) : (
          <img src={icons.mapLoading} className="loadingMap"></img>
        )}
      </div>
    </Fragment>
  );
};

export default MapComponent;
