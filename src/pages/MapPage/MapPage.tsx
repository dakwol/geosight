import React, { FC, Fragment, useEffect, useState } from "react";
import "./styles.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import MapComponent from "../../components/MapComponent/MapComponent";
import { InputText } from "primereact/inputtext";
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

  const [styleMap, setStyleMap] = useState<iStyleMap | null>(null);
  const [mapData, setMapData] = useState<any>({});
  const isUpdate = useSelector((state: any) => state.dataPressReducer.isUpdate);
  const [address, setAddress] = useState<string>("");

  const sidebarData = [
    {
      id: 1,
      exact: false,
      element: <></>,
      navigate: () => navigate(RouteNames.MAPLIST),
      ico: icons.adminPanelSettings,
      name: "Админ",
    },
    { id: 2, exact: false, element: <></>, ico: icons.map2, name: "Карта" },
    {
      id: 3,
      exact: false,
      element: <></>,
      ico: icons.iosShare,
      name: "Шеринг",
    },
  ];

  useEffect(() => {
    mapApi.getShow("1/").then((resp) => {
      if (resp.success && resp.data) {
        setStyleMap(resp.data.style);
        setMapData(resp.data);
      }
    });
  }, [isUpdate]);

  return (
    <Fragment>
      <Sidebar sbData={sidebarData} pageType={undefined} mapData={mapData} />
      <div className="MapPageContainer">
        <div className="searchContainer">
          <FormInput
            style={"inputSearch"}
            value={undefined}
            onChange={(value) => setAddress(value)}
            subInput={undefined}
            required={false}
            error={""}
            keyData={""}
            placeholder="Поиск адреса"
            friedlyInput
          />
        </div>
        <MapComponent styleMap={styleMap} mapData={mapData} address={address} />
      </div>
    </Fragment>
  );
};

export default MapPage;
