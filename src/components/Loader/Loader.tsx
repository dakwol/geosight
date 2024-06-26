import React from "react";
import icons from "../../assets/icons/icons";
import "./styles.scss";

const Loader = () => {
  return (
    <div className="loaderContainer">
      <object type="image/svg+xml" data={icons.Logo}></object>
    </div>
  );
};

export default Loader;
