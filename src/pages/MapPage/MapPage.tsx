import React, { FC } from "react";
import "./styles.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import MapComponent from "../../components/MapComponent/MapComponent";
import { InputText } from "primereact/inputtext";
import FormInput from "../../components/FormInput/FormInput";
import icons from "../../assets/icons/icons";

const MapPage: FC = () => {
  return (
    <div className="MapPageContainer">
      <div className="searchContainer">
        <FormInput
          style={"inputSearch"}
          value={undefined}
          onChange={function (
            value: string,
            isChecked?: boolean | undefined
          ): void {
            throw new Error("Function not implemented.");
          }}
          subInput={undefined}
          required={false}
          error={""}
          keyData={""}
          placeholder="Поиск"
          friedlyInput
        />
      </div>
      <MapComponent />
    </div>
  );
};

export default MapPage;
