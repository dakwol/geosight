import React, { FC } from "react";
import HeaderAdmin from "../../components/HeaderAdmin/HeaderAdmin";
import "./styles.scss";
import Tables from "../../components/Tables/Tables";

const MapListPage: FC = () => {
  return (
    <div className="grayPageContainer">
      <HeaderAdmin />
      <Tables data={[]} headers={[]} totals={[]} />
    </div>
  );
};

export default MapListPage;
