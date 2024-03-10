import React, { FC } from "react";
import LoginForm from "../../components/LoginForm/LoginForm";
import "./styles.scss";
import icons from "../../assets/icons/icons";

const Login: FC = () => {
  return (
    <div className="containerFull">
      <div className="containerPageLogin">
        <div className="containerFlexLogin">
          <LoginForm />
        </div>
        <div className="logoGeoContainer">
          <img src={icons.LogoGeo}></img>
        </div>
      </div>
    </div>
  );
};

export default Login;
