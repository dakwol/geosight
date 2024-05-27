import React, { FC, useEffect, useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import MapsApiRequest from "../../../api/Maps/Maps";

const SidebarLayers: FC = () => {
  const mapsApi = new MapsApiRequest();

  useMemo(() => {
    mapsApi.options().then((resp) => {
      if (resp.success) {
        console.log("====================================");
        console.log("re", resp.data);
        console.log("====================================");
      }
    });
  }, []);

  return (
    <div className="containerSidebarRight">
      <h1 className="titleSidebarMenu">Слои</h1>

      <Skeleton count={6} height={40} borderRadius={12} />
    </div>
  );
};

export default SidebarLayers;
