import React, { FC } from "react";
import "./styles.scss";
import icons from "../../assets/icons/icons";
import FormInput from "../FormInput/FormInput";
import { RouteNames, navDate } from "../../routes";
import { Link, useNavigate } from "react-router-dom";
import Buttons from "../Buttons/Buttons";

interface IProps {
  title: string;
  onClick: () => void;
}

const HeaderAdmin: FC<IProps> = ({ title, onClick }) => {
  const navigation = useNavigate();
  console.log("HeaderAdmin onClick", onClick); // Отладочное сообщение
  return (
    <div className="headerAdmin__container">
      <div className="searchLogoContainer">
        <div onClick={() => navigation(RouteNames.MAP)}>
          <img className="logoAdmin" src={icons.logoAdmin}></img>
        </div>
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
      <Buttons text={title} onClick={() => onClick()} />
    </div>
  );
};

export default HeaderAdmin;
