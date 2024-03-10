import React, { FC } from "react";
import Skeleton from "react-loading-skeleton";

const SidebarLayers: FC = () => {
  return (
    <div className="containerSidebarRight">
      <h1 className="titleSidebarMenu">Слои</h1>

      <Skeleton count={6} height={50} borderRadius={12} />
    </div>
  );
};

export default SidebarLayers;
