import React, {
  useRef,
  useEffect,
  useState,
  FC,
  Fragment,
  useLayoutEffect,
} from "react";
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
  enterAddress: string;
  sidebarData: any;
  setFoundAddresses: (data: []) => void;
}

const MapComponent: FC<IMapProps> = ({
  styleMap,
  mapData,
  address,
  enterAddress,
  sidebarData,
  setFoundAddresses,
}) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [savedFilters, setSavedFilters] = useState<{ [key: string]: any[] }>(
    {}
  );

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
  const handelEnterAddress = async () => {
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
    if (enterAddress !== "") {
      handelEnterAddress();
    }
  }, [enterAddress]);

  const hideAllPolygons = (map: any) => {
    const layers = map.current?.getStyle().layers || [];
    layers.forEach((layer: any) => {
      const { id: layerId } = layer;
      if (
        layerId.startsWith("polygon-") ||
        layerId.startsWith("polygon-border-") ||
        layerId.startsWith("polygon-label-")
      ) {
        map.current?.setLayoutProperty(layerId, "visibility", "visible");
      }
    });
  };

  useEffect(() => {
    hideAllPolygons(map);
  }, []);

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;

        map.current = new maplibregl.Map({
          container: mapContainer.current ? mapContainer.current : "",

          style: styleMap?.url || "",
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
          updateMapLayers();
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

        const defaultLng = 37.6176;
        const defaultLat = 55.7558;

        map.current = new maplibregl.Map({
          //@ts-ignore
          container: mapContainer.current,
          style: `${styleMap?.url}?key=${API_KEY}`,
          center: [defaultLng, defaultLat],
          zoom: zoom,
        });

        map.current.on("load", () => {
          updateMapLayers();
          toast.current?.show({
            severity: "success",
            summary: "Данные успешно получены",
            detail: "",
          });
        });
      }
    );

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [styleMap?.url]); // Empty dependency array to ensure this effect runs only once

  const updateMapLayers = () => {
    if (!map.current) return;

    const localStorageVisibility = JSON.parse(
      localStorage.getItem("visibilityLayers") || "{}"
    );

    // Загружаем сохраненные фильтры из localStorage
    const savedFilters = loadFiltersFromLocalStorage();

    mapData?.layers?.forEach((layer: any) => {
      if (layer.is_active && !localStorageVisibility.includes(layer.id)) {
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
            const polygonLayerId = `polygon-${layer.id}`;
            const polygonBorderLayerId = `polygon-border-${layer.id}`;
            const existingPolygonLayer = map.current?.getLayer(polygonLayerId);
            const existingBorderLayer =
              map.current?.getLayer(polygonBorderLayerId);

            if (existingPolygonLayer) {
              map.current?.removeLayer(polygonLayerId);
            }
            if (existingBorderLayer) {
              map.current?.removeLayer(polygonBorderLayerId);
            }

            let fillColor = serialize_styles.polygon.polygon_solid_color;

            if (serialize_styles.polygon.polygon_color_palette) {
              fillColor =
                serialize_styles.polygon.polygon_color_palette[2] || fillColor;

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
                    [
                      "to-number",
                      [
                        "get",
                        serialize_styles.polygon.polygon_value_field_name,
                      ],
                    ],
                    serialize_styles.polygon.polygon_color_palette["empty-0"]
                      ?.size,
                    serialize_styles.polygon.polygon_color_palette["empty-0"]
                      ?.color || serialize_styles.polygon.polygon_solid_color,
                    serialize_styles.polygon.polygon_color_palette["empty-1"]
                      ?.size,
                    serialize_styles.polygon.polygon_color_palette["empty-1"]
                      ?.color || serialize_styles.polygon.polygon_solid_color,
                    serialize_styles.polygon.polygon_color_palette["empty-2"]
                      ?.size,
                    serialize_styles.polygon.polygon_color_palette["empty-2"]
                      ?.color || serialize_styles.polygon.polygon_solid_color,
                    serialize_styles.polygon.polygon_color_palette["empty-3"]
                      ?.size,
                    serialize_styles.polygon.polygon_color_palette["empty-3"]
                      ?.color || serialize_styles.polygon.polygon_solid_color,
                    serialize_styles.polygon.polygon_color_palette["empty-4"]
                      ?.size,
                    serialize_styles.polygon.polygon_color_palette["empty-4"]
                      ?.color || serialize_styles.polygon.polygon_solid_color,
                  ],
                  "fill-outline-color":
                    serialize_styles.polygon.polygon_border_color,
                },
              });
            } else {
              map.current?.addLayer({
                id: polygonLayerId,
                type: "fill",
                source: sourceId,
                filter: ["==", "$type", "Polygon"],
                "source-layer": "get_features",
                paint: {
                  "fill-opacity": serialize_styles.polygon.polygon_opacity,
                  "fill-color": fillColor,
                  "fill-outline-color":
                    serialize_styles.polygon.polygon_border_color,
                },
              });
            }

            const borderPaint = {
              "line-color": serialize_styles.polygon.polygon_border_color,
              "line-width": serialize_styles.polygon.polygon_border_size || 1,
              "line-opacity":
                serialize_styles.polygon.polygon_border_opacity || 1,
            };

            if (serialize_styles.polygon.polygon_border_style === "dash") {
              //@ts-ignore
              borderPaint["line-dasharray"] = [1, 2];
            }

            map.current?.addLayer({
              id: polygonBorderLayerId,
              type: "line",
              source: sourceId,
              filter: ["==", "$type", "Polygon"],
              "source-layer": "get_features",
              paint: borderPaint,
            });

            map.current?.on("click", polygonLayerId, (e) => {
              //@ts-ignore
              const coordinates = e.features[0].geometry.coordinates.slice();
              //@ts-ignore
              const title = e.features[0].properties.title || "Информация";
              //@ts-ignore
              const description =
                //@ts-ignore
                e?.features[0].properties || "Ничего не найдено";

              while (Math.abs(e.lngLat.lng - coordinates[0][0][0]) > 180) {
                coordinates[0][0][0] +=
                  e.lngLat.lng > coordinates[0][0][0] ? 360 : -360;
              }

              new maplibregl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(
                  `<h3>${title}</h3>${fieldToArray(description)
                    .map((item) => `<p>${item.key}: ${item.value}</p>`)
                    .join("")}`
                )
                //@ts-ignore
                .addTo(map.current);
            });

            map.current?.on("mouseenter", polygonLayerId, () => {
              map.current?.getCanvas();
            });

            map.current?.on("mouseleave", polygonLayerId, () => {
              //@ts-ignore
              map.current?.getCanvas();
            });

            // Применяем фильтры, если они сохранены
            if (savedFilters && savedFilters[polygonLayerId]) {
              map.current?.setFilter(
                polygonLayerId,
                //@ts-ignore
                savedFilters[polygonLayerId]
              );
            }
            if (savedFilters && savedFilters[polygonBorderLayerId]) {
              map.current?.setFilter(
                polygonBorderLayerId,
                //@ts-ignore
                savedFilters[polygonBorderLayerId]
              );
            }
          }

          if (serialize_styles.line) {
            const lineLayerId = `line-${layer.id}`;
            const existingLineLayer = map.current?.getLayer(lineLayerId);

            if (existingLineLayer) {
              map.current?.removeLayer(lineLayerId);
            }

            const linePaint = {
              "line-opacity": serialize_styles.line.line_opacity,
              "line-width": serialize_styles.line.line_size,
              "line-color": serialize_styles.line.line_solid_color,
            };

            if (serialize_styles.line.line_style === "dash") {
              //@ts-ignore
              linePaint["line-dasharray"] = [2, 2];
            }

            map.current?.addLayer({
              id: lineLayerId,
              type: "line",
              source: sourceId,
              filter: ["==", "$type", "LineString"],
              "source-layer": "get_features",
              paint: linePaint,
            });

            // Применяем фильтры, если они сохранены
            if (savedFilters && savedFilters[lineLayerId]) {
              //@ts-ignore
              map.current?.setFilter(lineLayerId, savedFilters[lineLayerId]);
            }
          }

          if (serialize_styles.polygon.polygon_label) {
            const labelLayerId = `${layer.id}-label`;
            const existingLabelLayer = map.current?.getLayer(labelLayerId);

            if (existingLabelLayer) {
              map.current?.removeLayer(labelLayerId);
            }

            map.current?.addLayer({
              id: labelLayerId,
              type: "symbol",
              source: sourceId,
              filter: ["==", "$type", "Polygon"],
              "source-layer": "get_features",
              layout: {
                "text-field": serialize_styles.polygon.polygon_label_field_value
                  ? [
                      "case",
                      [
                        "has",
                        serialize_styles.polygon.polygon_label_field_value,
                      ],
                      [
                        "get",
                        serialize_styles.polygon.polygon_label_field_value,
                      ],
                      serialize_styles.polygon.polygon_label || "",
                    ]
                  : serialize_styles.polygon.polygon_label,
                "text-font": [
                  `${serialize_styles.polygon.polygon_label_font} ${serialize_styles.polygon.polygon_label_font_style}`,
                ] || ["Open Sans Semibold"],
                "text-size":
                  serialize_styles.polygon.polygon_label_font_size || 12,
                "text-anchor": "center",
              },
              paint: {
                "text-color":
                  serialize_styles.polygon.polygon_label_font_color ||
                  "#000000",
                "text-opacity":
                  serialize_styles.polygon.polygon_label_font_opacity || 1,
              },
            });

            // Применяем фильтры, если они сохранены
            if (savedFilters && savedFilters[labelLayerId]) {
              //@ts-ignore
              map.current?.setFilter(labelLayerId, savedFilters[labelLayerId]);
            }
          }

          if (serialize_styles.point) {
            const pointLayerId = `circle-${layer.id}`;
            const existingPointLayer = map.current?.getLayer(pointLayerId);

            if (existingPointLayer) {
              map.current?.removeLayer(pointLayerId);
            }

            const pointPaint = {
              "circle-opacity": serialize_styles.point.point_opacity,
              "circle-color": serialize_styles.point.point_solid_color,
              "circle-radius": serialize_styles.point.point_radius,
            };

            map.current?.addLayer({
              id: pointLayerId,
              type: "circle",
              source: sourceId,
              filter: ["==", "$type", "Point"],
              "source-layer": "get_features",
              paint: pointPaint,
            });

            // Применяем фильтры, если они сохранены
            if (savedFilters && savedFilters[pointLayerId]) {
              //@ts-ignore
              map.current?.setFilter(pointLayerId, savedFilters[pointLayerId]);
            }
          }
        }
      }
    });
  };

  // Функция для загрузки фильтров из localStorage
  // const loadFiltersFromLocalStorage = () => {
  //   return JSON.parse(localStorage.getItem("mapFilters") || "{}");
  // };

  useEffect(() => {
    if (map.current) {
      updateMapLayers();
    }
  }, [mapData.layers]);

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
  const layers = map.current?.getStyle()?.layers || [];

  const filterPolygons = (data: any) => {
    if (!map.current) return;

    const layers = map.current.getStyle().layers || [];
    const filtersByLayer: { [key: string]: any[] } = {};

    data.forEach((item: any) => {
      const { property_name: propertyName, range, layer: layerId } = item;
      const [minThreshold, maxThreshold] = range.split(",").map(Number);

      const fillLayerId = `polygon-${layerId}`;
      const borderLayerId = `polygon-border-${layerId}`;

      if (!filtersByLayer[fillLayerId]) filtersByLayer[fillLayerId] = ["all"];
      filtersByLayer[fillLayerId].push(
        [">=", ["to-number", ["get", propertyName]], minThreshold],
        ["<=", ["to-number", ["get", propertyName]], maxThreshold]
      );

      if (!filtersByLayer[borderLayerId])
        filtersByLayer[borderLayerId] = ["all"];
      filtersByLayer[borderLayerId].push(
        [">=", ["to-number", ["get", propertyName]], minThreshold],
        ["<=", ["to-number", ["get", propertyName]], maxThreshold]
      );

      layers.forEach((layer) => {
        if (layer.id.endsWith("-label")) {
          if (!filtersByLayer[layer.id]) filtersByLayer[layer.id] = ["all"];
          filtersByLayer[layer.id].push(
            [">=", ["to-number", ["get", propertyName]], minThreshold],
            ["<=", ["to-number", ["get", propertyName]], maxThreshold]
          );
        }
      });
    });

    // Сохранение фильтров в localStorage и состоянии
    saveFiltersToLocalStorage(filtersByLayer);
    setSavedFilters(filtersByLayer);

    Object.keys(filtersByLayer).forEach((layerId) => {
      const filter = filtersByLayer[layerId];
      const layerExists = layers.some((layer) => layer.id === layerId);
      if (layerExists) {
        if (filter.length > 1) {
          //@ts-ignore
          map.current?.setFilter(layerId, filter);
        } else {
          map.current?.setFilter(layerId, null);
        }
      } else {
        console.warn(`Layer ${layerId} does not exist.`);
      }
    });

    layers.forEach((layer) => {
      const { id: layerId } = layer;
      if (
        !filtersByLayer[layerId] &&
        (layerId.startsWith("polygon-") ||
          layerId.startsWith("polygon-border-") ||
          layerId.endsWith("-label"))
      ) {
        map.current?.setFilter(layerId, null);
      }
    });
  };

  const saveFiltersToLocalStorage = (filters: { [key: string]: any[] }) => {
    localStorage.setItem("mapFilters", JSON.stringify(filters));
  };

  const loadFiltersFromLocalStorage = (): { [key: string]: any[] } | null => {
    const filters = localStorage.getItem("mapFilters");
    return filters ? JSON.parse(filters) : null;
  };

  // Использование загруженных фильтров при загрузке компонента
  useEffect(() => {
    if (map.current) {
      const savedFilters = loadFiltersFromLocalStorage();
      if (savedFilters) {
        Object.keys(savedFilters).forEach((layerId) => {
          const filter = savedFilters[layerId];
          //@ts-ignore
          const layerExists = map.current
            .getStyle()
            .layers.some((layer) => layer.id === layerId);
          if (layerExists) {
            //@ts-ignore
            map.current?.setFilter(layerId, filter);
          }
        });
        setSavedFilters(savedFilters);
      }
    }
  }, [map.current]);

  const toggleLayerVisibility = (layerId: string) => {
    const storageKey = "visibilityLayers";
    const localStorageVisibility = JSON.parse(
      localStorage.getItem(storageKey) || "{}"
    );

    const layerIds = [
      `${layerId}`,
      `polygon-border-${layerId.replace("polygon-", "")}`,
      `${layerId.replace("polygon-", "")}-label`,
      `circle-${layerId.replace("polygon-", "")}`,
      `line-${layerId.replace("polygon-", "")}`,
    ];

    layerIds.forEach((id) => {
      const layer = map.current?.getLayer(id);
      if (layer) {
        const visibility =
          map.current?.getLayoutProperty(id, "visibility") || "visible";

        // Toggle visibility
        const newVisibility = visibility === "visible" ? "none" : "visible";
        map.current?.setLayoutProperty(id, "visibility", newVisibility);

        // Update localStorage with the new visibility state
        if (newVisibility === "visible") {
          localStorageVisibility[id] = true;
        } else {
          delete localStorageVisibility[id]; // remove the key if the layer is hidden
        }
      } else {
        console.warn(`Layer ${id} not found`);
      }
    });

    // Update localStorage
    localStorage.setItem(storageKey, JSON.stringify(localStorageVisibility));
  };

  useEffect(() => {
    localStorage.setItem("visibilityLayers", "[]");
    localStorage.setItem("mapFilters", "{}");
  }, []);

  return (
    <Fragment>
      <Sidebar
        sbData={sidebarData}
        pageType={undefined}
        mapData={mapData}
        toggleLayerVisibility={(data: any) => toggleLayerVisibility(data)}
        toggleFilters={(data: any) => filterPolygons(data)}
      />
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
