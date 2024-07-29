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
import { fieldToArray } from "../UI/functions/functions";
import { RootState } from "../../store";
import Sidebar from "../Sidebar/Sidebar";

interface ISource {
  [key: string]: { id: string | number; name: string; description: string };
}

interface IMapProps {
  styleMap: iStyleMap | null;
  mapData: any;
  address: string;
  sidebarData: any;
  setFoundAddresses:(data:[])=> void;
}

const MapComponent: FC<IMapProps> = ({ styleMap, mapData, address, sidebarData, setFoundAddresses }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const visibilityLayers = useLocalStorage("visibilityLayers");
  const visibleLayers = useSelector((state: RootState) => state.visibilityReducer.visibleLayers);
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
        setFoundAddresses(data); // Store the found addresses
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

  function divideIntervals(
    min_val: number,
    max_val: number,
    n: number
  ): [number, number][] {
    const step = (max_val - min_val) / n;
    const intervals: [number, number][] = [];

    for (let i = 0; i < n; i++) {
      const start = min_val + i * step;
      const end = min_val + (i + 1) * step;
      intervals.push([start, end]);
    }
    console.log("intervals", intervals);

    return intervals;
  }

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
          sessionStorage.setItem(
            "zoom",
            zoomSession ? JSON.stringify(zoomSession) : ""
          );
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
                  const polygonLayerId = `polygon-${layer.id}`; // use template strings for id

                  let fillColor = serialize_styles.polygon.polygon_solid_color;

                  if (serialize_styles.polygon.polygon_color_palette) {
                    if (serialize_styles.polygon.polygon_value_field_name) {
                      mapApi
                        .layersPropertis(layer.id, "?types=integer&types=float")
                        .then((resp) => {
                          if (resp.success && resp.data) {
                            const newLayers = resp.data.map((item: any) => ({
                              id: item.name,
                              value: item.name,
                              display_name: item.name,
                              type: item.type,
                            }));
                            newLayers.map((item: any) => {
                              if (
                                item.name ===
                                serialize_styles.polygon_value_field_name
                              ) {
                                mapApi
                                  .layersPropertyValues(
                                    layer.id,
                                    `${item.type}/`,
                                    `?property_name=${serialize_styles.polygon.polygon_value_field_name}`
                                  )
                                  .then((resp) => {
                                    console.log("aaaaaaaaaaaasss", resp.data);
                                    divideIntervals(
                                      resp.data.min_value,
                                      resp.data.max_value,
                                      5
                                    );
                                  });
                              }
                            });
                          }
                        });
                    }
                    // Ensure the third color in the palette is defined, otherwise fallback to a default color
                    fillColor =
                      serialize_styles.polygon.polygon_color_palette[2] ||
                      fillColor;

                    console.log("Selected fill color from palette:", fillColor);

                    console.log("serialize_styles", serialize_styles);
                    //@ts-ignore
                    const features = map.current?.getSource(sourceId);

                    console.log("features", features);

                    map.current?.addLayer({
                      id: polygonLayerId,
                      type: "fill",
                      source: sourceId,
                      filter: ["==", "$type", "Polygon"],
                      "source-layer": "get_features",
                      paint: {
                        "fill-opacity": serialize_styles.polygon.polygon_opacity,
                        "fill-color": [
                          "interpolate",
                          ["linear"],
                          ["to-number", ["get", "score"]],
                          0, serialize_styles.polygon.polygon_color_palette["empty-0"] || serialize_styles.polygon.polygon_solid_color, // color for score 0-20
                          20, serialize_styles.polygon.polygon_color_palette["empty-1"] || serialize_styles.polygon.polygon_solid_color, // color for score 20-40
                          40, serialize_styles.polygon.polygon_color_palette["empty-2"] || serialize_styles.polygon.polygon_solid_color, // color for score 40-60
                          60, serialize_styles.polygon.polygon_color_palette["empty-3"] || serialize_styles.polygon.polygon_solid_color, // color for score 60-80
                          80, serialize_styles.polygon.polygon_color_palette["empty-4"] || serialize_styles.polygon.polygon_solid_color, // color for score 80-100
                        ],
                        "fill-outline-color": serialize_styles.polygon.polygon_border_color,
                      },
                    });
                    
                    
                  } else {
                    console.log(
                      "No color palette found, using solid color:",
                      fillColor
                    );

                    // Add layer with solid color
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

                  // Adding a layer for the polygon border
                  const polygonBorderLayerId = `polygon-border-${layer.id}`;

                  const borderPaint = {
                    "line-color": serialize_styles.polygon.polygon_border_color, // Border color
                    "line-width":
                      serialize_styles.polygon.polygon_border_size || 1, // Border width
                    "line-opacity":
                      serialize_styles.polygon.polygon_border_opacity || 1, // Border opacity
                  };

                  // Conditionally add the line-dasharray property
                  if (
                    serialize_styles.polygon.polygon_border_style === "dash"
                  ) {
                    //@ts-ignore
                    borderPaint["line-dasharray"] = [1, 2]; // Dash style for the border
                  }

                  map.current?.addLayer({
                    id: polygonBorderLayerId,
                    type: "line",
                    source: sourceId,
                    filter: ["==", "$type", "Polygon"],
                    "source-layer": "get_features",
                    paint: borderPaint,
                  });

                  //@ts-ignore
                  map.current.on("click", polygonLayerId, (e) => {
                    console.log("polygon", e);

                    //@ts-ignore
                    const coordinates =
                      //@ts-ignore
                      e.features[0].geometry.coordinates.slice();
                      console.log("eeeeeeee", e.features);

                    //@ts-ignore
                    const title =
                      //@ts-ignore
                      e.features[0].properties.title || "Информация";
                    const description =
                      //@ts-ignore
                      e.features[0].properties ||
                      "Ничего не найдено";

                    // Ensure the description is displayed at the correct coordinates
                    while (
                      Math.abs(e.lngLat.lng - coordinates[0][0][0]) > 180
                    ) {
                      coordinates[0][0][0] +=
                        e.lngLat.lng > coordinates[0][0][0] ? 360 : -360;
                    }

                    new maplibregl.Popup()
                      .setLngLat(e.lngLat)
                      .setHTML(
                        `<h3>${title}</h3>${fieldToArray(description)
                          .map(
                            (item: any) => `<p>${item.key}: ${item.value}</p>`
                          )
                          .join("")}`
                      )
                      //@ts-ignore
                      .addTo(map.current);
                  });

                  // Change the cursor to a pointer when the mouse is over the polygon layer.
                  //@ts-ignore
                  map.current.on("mouseenter", polygonLayerId, () => {
                    //@ts-ignore
                    map.current.getCanvas().style.cursor = "pointer";
                  });

                  // Change the cursor back to default when it leaves the polygon layer.
                  //@ts-ignore
                  map.current.on("mouseleave", polygonLayerId, () => {
                    //@ts-ignore
                    map.current.getCanvas().style.cursor = "";
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
          toast.current?.show({
            severity: "success",
            summary: "Данные успешно получены",
            detail: "",
          });
        });
      },
      (error) => {
        console.error("Error getting geolocation:", error);
        toast.current?.show({
          severity: "error",
          summary: "Ошибка",
          detail: `${error}`,
        });

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
  }, [styleMap, zoom, API_KEY, mapData.layers]);

  const toggleLayerVisibility = (layerId: string) => {
    console.log('layerId',layerId);
    
    const visibility = map.current?.getLayoutProperty(`${layerId}`, "visibility");
    if (visibility === "visible") {
      map.current?.setLayoutProperty(layerId, "visibility", "none");

      const borderLayerId = layerId.replace("polygon-", "polygon-border-");
      map.current?.setLayoutProperty(borderLayerId, "visibility", "none");

      const labelLayerId = layerId.replace("polygon-", "polygon-label-");
      map.current?.setLayoutProperty(labelLayerId, "visibility", "none");
    } else {
      map.current?.setLayoutProperty(layerId, "visibility", "visible");

      const borderLayerId = layerId.replace("polygon-", "polygon-border-");
      map.current?.setLayoutProperty(borderLayerId, "visibility", "visible");

      const labelLayerId = layerId.replace("polygon-", "polygon-label-");
      map.current?.setLayoutProperty(labelLayerId, "visibility", "visible");
    }
  };

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


  const [filtered, setFiltered] = useState(false);
  const filterPolygons = (data: any) => {
    if (!map.current) return;
  
    const layers = map.current.getStyle().layers || [];
  
    // Обрабатываем каждый элемент в данных фильтрации
    data.forEach((item: any) => {
      const { property_name: propertyName, range, layer: layerId } = item;
      const [minThreshold, maxThreshold] = range.split(",").map(Number);
  
      // Полные идентификаторы слоев
      const fillLayerId = `polygon-${layerId}`;
      const borderLayerId = `polygon-border-${layerId}`;
  
      // Фильтрация слоя заливки
      const fillLayerExists = layers.some(layer => layer.id === fillLayerId);
      if (fillLayerExists) {
        map.current?.setFilter(
          fillLayerId,
          ["all",[">=", propertyName, minThreshold], ['<=', propertyName, maxThreshold]]
          // [
          //   'all',
          //   ['>=', ['get', propertyName], minThreshold],
          //   // ['<=', ['get', propertyName], maxThreshold]
          // ]
        );
        console.log(`Filter applied to fill layer ${fillLayerId} with range [${minThreshold}, ${maxThreshold}]`);
      } else {
        console.warn(`Fill layer ${fillLayerId} does not exist.`);
      }
  
      // Фильтрация слоя обводки
      const borderLayerExists = layers.some(layer => layer.id === borderLayerId);
      if (borderLayerExists) {
        map.current?.setFilter(
          borderLayerId,
          [
            'all',
            ['>=', ['get', propertyName], minThreshold],
            ['<=', ['get', propertyName], maxThreshold]
          ]
        );
        console.log(`Filter applied to border layer ${borderLayerId} with range [${minThreshold}, ${maxThreshold}]`);
      } else {
        console.warn(`Border layer ${borderLayerId} does not exist.`);
      }
    });
  
    setFiltered(true);
  };
  
  
  return (
    <Fragment>
      <Sidebar sbData={sidebarData} pageType={undefined} mapData={mapData} toggleLayerVisibility={(data:any)=>toggleLayerVisibility(data)} toggleFilters={(data:any)=>filterPolygons(data)}/>
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
