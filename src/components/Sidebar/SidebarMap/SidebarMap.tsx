import React, { FC } from "react";
import Skeleton from "react-loading-skeleton";

const SidebarMap: FC = () => {
  return (
    <div className="containerSidebarRight">
      <h1 className="titleSidebarMenu">Базовая карта</h1>
      <Skeleton count={3} height={50} borderRadius={12} />
    </div>
  );
};

export default SidebarMap;
