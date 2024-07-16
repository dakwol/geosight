import React, { FC, useEffect, useState } from "react";
import MapsApiRequest from "../../api/Maps/Maps";
import {
  formatDateIntlDate,
  formatDateIntlDateTime,
  formatDateIntlTimeDate,
} from "../UI/functions/functions";
import "./styles.scss";
import icons from "../../assets/icons/icons";
import { useDispatch, useSelector } from "react-redux";
import { DataPressActionCreators } from "../../store/reducers/dataPressItem/action-creator";
import Skeleton from "react-loading-skeleton";

interface MapItem {
  description: string;
  id: number;
  name: string;
  updated_at: string;
}

const MapModal: FC = () => {
  const mapsApi = new MapsApiRequest();
  const [mapsArray, setMapsArray] = useState<MapItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isUpdate = useSelector((state: any) => state.dataPressReducer.isUpdate);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    mapsApi.mapsAllowed().then((resp) => {
      if (resp.success && resp.data) {
        setMapsArray(resp.data);
        setIsLoading(false);
      }
    });
  }, []);

  const handleActiveMap = (id: number) => {
    localStorage.setItem("activeMap", `${id}`);
    dispatch(DataPressActionCreators.setUpdate(!isUpdate));
  };

  return (
    <div className="containerMapModal">
      <h1 className="titleModal">Карты</h1>
      <div className="containerMapsModal">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} count={1} height={200} borderRadius={12} />
            ))
          : mapsArray.length !== 0 &&
            mapsArray.map((item) => {
              return (
                <div
                  key={item.id}
                  className="containerItemMapsModal"
                  onClick={() => handleActiveMap(item.id)}
                >
                  <img src={icons.previ} className="mapsPrevi"></img>
                  <div className="mapsItemFooterContainer">
                    <h1 className="mapsItemTitle">{item.name}</h1>
                    <p className="mapsItemDescription">
                      {item.description || "Нет описания"}
                    </p>
                    <p className="mapsItemDate">{`${formatDateIntlDateTime(
                      item.updated_at
                    )}`}</p>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default MapModal;
