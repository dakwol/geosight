import React from "react";
import "./styles.scss";
import icons from "../../assets/icons/icons";
import FormInput from "../FormInput/FormInput";
import { RouteNames, navDate } from "../../routes";
import { Link, useNavigate } from "react-router-dom";
import Buttons from "../Buttons/Buttons";
const HeaderAdmin = () => {
  const navigation = useNavigate();
  return (
    <div className="headerAdmin__container">
      <div className="searchLogoContainer">
        <img
          className="logoAdmin"
          src={icons.logoAdmin}
          onClick={() => navigation(RouteNames.MAP)}
        ></img>
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
          icoRight={icons.search}
        />
      </div>
      <div className="nav">
        {navDate.map((item) => (
          <Link
            key={item.id}
            className={`navItem ${
              item.link === window.location.pathname && "active"
            }`}
            to={item?.link || ""}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <Buttons
        text={"Создать пользователя"}
        onClick={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    </div>
  );
};

export default HeaderAdmin;
