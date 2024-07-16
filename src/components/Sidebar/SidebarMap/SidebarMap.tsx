import React, { FC, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import MapsApiRequest from "../../../api/Maps/Maps";
import { IOptionInput } from "../../../models/IOptionInput";
import FormInput from "../../FormInput/FormInput";
import { useDispatch, useSelector } from "react-redux";
import { DataPressActionCreators } from "../../../store/reducers/dataPressItem/action-creator";

interface IMapDataMapStyle {
  mapDataId: string;
  mapDataStyle: any;
}

const SidebarMap: FC<IMapDataMapStyle> = ({ mapDataId, mapDataStyle }) => {
  const mapApi = new MapsApiRequest();
  const dispatch = useDispatch();
  const isUpdate = useSelector((state: any) => state.dataPressReducer.isUpdate);
  const [optionsMaps, setOptionsMap] = useState<IOptionInput>();
  const [isLoading, setIsLoading] = useState(false);
  const [styleMap, setStyleMap] = useState(mapDataStyle.id);

  useEffect(() => {
    setIsLoading(true);
    mapApi.mapStyleOptions(`${mapDataId}/`).then((resp) => {
      if (resp.success && resp.data) {
        setOptionsMap(resp.data.actions.map_style);
        setIsLoading(false);
      }
    });
  }, []);

  const handleMapStyle = (value: string) => {
    const data = {
      id: mapDataId,
      style: value,
    };
    mapApi.mapStyle(`${mapDataId}/`, data).then((resp) => {
      if (resp.success && resp.data) {
        setStyleMap(value);
        dispatch(DataPressActionCreators.setUpdate(!isUpdate));
      }
    });
  };

  return (
    <div className="containerSidebarRight">
      <h1 className="titleSidebarMenu">Базовая карта</h1>
      {isLoading ? (
        <Skeleton count={3} height={40} borderRadius={12} />
      ) : (
        <FormInput
          style={""}
          value={styleMap}
          onChange={(value) => handleMapStyle(value)}
          subInput={undefined}
          required={false}
          error={""}
          keyData={""}
          //@ts-ignore
          options={optionsMaps?.style.choices}
        />
      )}
    </div>
  );
};

export default SidebarMap;
