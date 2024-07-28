import React, { FC, useState, useEffect, Fragment } from "react";
import Skeleton from "react-loading-skeleton";
import icons from "../../../assets/icons/icons";
import "./styles.scss";
import AddLayerComponent from "./AddLayerComponent/AddLayerComponent";
import RedactLayersComponent from "./RedactLayersComponent/RedactLayersComponent";
import { useDispatch } from "react-redux";
import { DataPressActionCreators } from "../../../store/reducers/dataPressItem/action-creator";
import { toggleLayerVisibility } from "../../../store/reducers/layerVisible/actions";

interface IMapDataLayer {
  description: string;
  id: string | number;
  is_active: boolean;
  name: string;
  serialize_styles: any;
}

interface IMapDataLayers {
  mapDataLayers: IMapDataLayer[];
  mapDataId: string;
  toggleLayerVisibility:any;
}

const SidebarLayers: FC<IMapDataLayers> = ({ mapDataId, mapDataLayers, toggleLayerVisibility }) => {
  const [activeLayer, setActiveLayer] = useState<string | number>();
  const [activeLayerRedact, setActiveLayerRedact] = useState<string | number>(
    ""
  );
  const [visibleLayers, setVisibleLayers] = useState<Array<string | number>>(
    []
  );

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedLayers = localStorage.getItem("visibilityLayers");
    if (storedLayers) {
      setVisibleLayers(JSON.parse(storedLayers));
    }

    // Simulating data loading
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust the timeout duration as needed
  }, []);

  const toggleLayerVisible = (layerId: string | number) => {
    const updatedLayers = visibleLayers.includes(layerId)
      ? visibleLayers.filter((id) => id !== layerId)
      : [...visibleLayers, layerId];

    setVisibleLayers(updatedLayers);
    toggleLayerVisibility(`polygon-${layerId}`);
    localStorage.setItem("visibilityLayers", JSON.stringify(updatedLayers));
  };

  const buttonArray = [
    {
      id: 1,
      ico: icons.Pencil,
      classNames: ``,
      onClick: (layerId: string | number) => {
        setActiveLayerRedact(layerId);
      },
    },
    {
      id: 2,
      ico: (layerId: string | number) =>
        visibleLayers.includes(layerId)
          ? icons.visibility
          : icons.dontvisibility,
      classNames: ``,
      onClick: (layerId: string | number) => {
        toggleLayerVisible(layerId);
      },
    },
    {
      id: 3,
      ico: icons.expand_more,
      classNames: ` ${activeLayer && "active"}`,
      onClick: (layerId: number | string) => {
        setActiveLayer(layerId === activeLayer ? undefined : layerId);
      },
    },
  ];

  return (
    <Fragment>
      {activeLayerRedact !== "" ? (
        <RedactLayersComponent
          layerData={mapDataLayers.find(
            (item) => item.id === activeLayerRedact
          )}
          onBack={() => setActiveLayerRedact("")}
        />
      ) : (
        <div className="containerSidebarRight">
          <div className="containerAddLayer">
            <h1 className="titleSidebarMenu">Слои</h1>
            <AddLayerComponent mapDataId={mapDataId} />
          </div>
          <div className="containerLayers">
            {isLoading ? (
              <Skeleton count={6} height={40} borderRadius={12} />
            ) : mapDataLayers && mapDataLayers.length !== 0 ? (
              mapDataLayers.map((item) => {
                const isActive = item.id === activeLayer;
                const isVisible = visibleLayers?.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`containerLayer ${isActive ? "active" : ""}`}
                  >
                    <div className="containerNameLayer">
                      <h5 className="layerName">{item.name}</h5>
                      <div className="containerLayerButton">
                        {buttonArray.map((button) => (
                          <div
                            key={button.id}
                            className="layerButton"
                            onClick={() => button.onClick(item.id)}
                          >
                            <img
                              src={
                                typeof button.ico === "function"
                                  ? button.ico(item.id)
                                  : button.ico
                              }
                              className={`layerButtonImg ${
                                button.id === 3 &&
                                `expandButton ${isActive && "active"}`
                              } ${
                                button.id === 2 && (isVisible ? "visible" : "")
                              }`}
                              alt={`Button ${button.id}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    {isActive && item.description && (
                      <div className="layerDescriptionContainer">
                        <label className="labelDescriptionLayer">
                          Описание слоя
                        </label>
                        <p className="descriptionLayer">{item.description}</p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="noDataMessage">Нет данных</div>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default SidebarLayers;
