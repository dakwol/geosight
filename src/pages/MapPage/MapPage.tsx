import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import "./styles.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import MapComponent from "../../components/MapComponent/MapComponent";
import FormInput from "../../components/FormInput/FormInput";
import icons from "../../assets/icons/icons";
import { RouteNames } from "../../routes";
import { useNavigate } from "react-router-dom";
import MapsApiRequest from "../../api/Maps/Maps";
import { iStyleMap } from "../../models/IMaps";
import { useSelector } from "react-redux";

const MapPage: FC = () => {
  const mapApi = new MapsApiRequest();
  const navigate = useNavigate();
  const [foundAddresses, setFoundAddresses] = useState([]);
  const [styleMap, setStyleMap] = useState<iStyleMap | null>(null);
  const [mapData, setMapData] = useState<any>({});
  const isUpdate = useSelector((state: any) => state.dataPressReducer.isUpdate);
  const [address, setAddress] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const sydgestAddressRef = useRef<HTMLDivElement>(null);

  const sidebarData = [
    {
      id: 1,
      exact: false,
      element: <></>,
      navigate: () => navigate(RouteNames.MAPLIST),
      ico: icons.adminPanelSettings,
      name: "Админ",
    },
    {
      id: 2,
      exact: false,
      element: <></>,
      ico: icons.map2,
      name: "Карта",
    },
    {
      id: 3,
      exact: false,
      element: <></>,
      ico: icons.iosShare,
      name: "Шеринг",
    },
  ];

  useEffect(() => {
    mapApi
      .getShow(`${localStorage.getItem("activeMap") || 1}/` || "1/")
      .then((resp) => {
        if (resp.success && resp.data) {
          setStyleMap(resp.data.style);
          setMapData(resp.data);
        }
      });
  }, [isUpdate, localStorage.getItem("activeMap")]);

  const handleAddressArray = (data:any) => {
    const newAddress = data.map((item: any) => ({
      id: item.place_id,
      value: item.display_name,
      display_name: item.display_name,
    }));
    setFoundAddresses(newAddress);
    setShowSuggestions(true);
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      sydgestAddressRef.current &&
      !sydgestAddressRef.current.contains(event.target as Node)
    ) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Fragment>
    
      <div className="MapPageContainer">
        <div className="searchContainer">
          <FormInput
            style={"inputSearch"}
            value={address}
            onChange={(value) => setAddress(value)}
            subInput={undefined}
            required={false}
            error={""}
            keyData={""}
            placeholder="Поиск адреса"
            friedlyInput
          />
          {showSuggestions && (
            <div className="sydgestAddress" ref={sydgestAddressRef}>
              {foundAddresses.map((item:any) => (
                <div
                  key={item.id}
                  className="sidgestItem"
                  onClick={() => {
                    setAddress(item.value);
                    setShowSuggestions(false);
                  }}
                >
                  {item.display_name}
                </div>
              ))}
            </div>
          )}
        </div>
        <MapComponent
          styleMap={styleMap}
          mapData={mapData}
          address={address}
          sidebarData={sidebarData}
          setFoundAddresses={(data) => handleAddressArray(data)}
        />
      </div>
    </Fragment>
  );
};

export default MapPage;
