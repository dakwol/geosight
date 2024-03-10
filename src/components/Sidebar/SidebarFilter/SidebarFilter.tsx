import React, { FC } from "react";
import Skeleton from "react-loading-skeleton";

const SidebarFilter: FC = () => {
  return (
    <div className="containerSidebarRight">
      <h1 className="titleSidebarMenu">Фильтры</h1>
      <Skeleton count={4} height={50} borderRadius={12} />
    </div>
  );
};

export default SidebarFilter;
