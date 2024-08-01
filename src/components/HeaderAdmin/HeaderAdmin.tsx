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
  onSearch?: (e: string) => void;
}

const HeaderAdmin: FC<IProps> = ({ title, onClick, onSearch }) => {
  const navigation = useNavigate();
  return (
    <div className="headerAdmin__container">
      <div className="searchLogoContainer">
        <div
          className="logoAdmin"
          onClick={() =>
            navigation(
              `${RouteNames.MAP}/${localStorage.getItem("activeMap") || "1/"}`
            )
          }
        >
          <img src={icons.logoAdminNew}></img>
        </div>
        {onSearch && (
          <FormInput
            style={"inputSearch"}
            value={undefined}
            onChange={(value) => onSearch(value)}
            subInput={undefined}
            required={false}
            error={""}
            keyData={""}
            placeholder="Поиск"
            friedlyInput
          />
        )}
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
      <Buttons text={title} onClick={onClick} />
    </div>
  );
};

export default HeaderAdmin;
