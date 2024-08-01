import React, { FC, useEffect, useState } from "react";
import "./styles.scss";
import Skeleton from "react-loading-skeleton";
import Buttons from "../Buttons/Buttons";
import icons from "../../assets/icons/icons";
import FormInput from "../FormInput/FormInput";
import { IUser, IUserOption } from "../../models/IUser";
import { useDispatch, useSelector } from "react-redux";
import { AuthActionCreators } from "../../store/reducers/auth/action-creator";
import UserApiRequest from "../../api/User/Users";
import { fieldToArray } from "../UI/functions/functions";
import { DataPressActionCreators } from "../../store/reducers/dataPressItem/action-creator";
import apiConfig from "../../api/apiConfig";
import { RouteNames } from "../../routes";
import { useNavigate } from "react-router-dom";
import RedactContent from "./RedactProfile/RedactProfile";

interface IUserData {
  userData: IUser;
  onType: (e: string) => void;
}

const ProfileComponent: FC<IUserData> = ({ userData, onType }) => {
  const [isType, setIsType] = useState<string>("view");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const renderUserInfo = (label: string, value: string) => (
    <div className="userInfo">
      <label>{label}</label>
      {value ? (
        <h4>{value}</h4>
      ) : (
        <Skeleton count={1} height={"30rem"} width={300} borderRadius={12} />
      )}
    </div>
  );


  const logout = () => {
    //@ts-ignore
    dispatch(AuthActionCreators.logout());
    navigate(RouteNames.LOGIN);
  };


  const ViewContent: FC = () => {
    return (
      <div className="lkModal">
        <h1 className="titleModal">Личный кабинет</h1>
        <div className="containerUserInfoAvatar">
          <img
            src={
              userData.avatar
                ? `${apiConfig.baseUrlMedia.slice(
                    0,
                    -6
                  )}${userData.avatar.slice(23)}`
                : icons.photoNone
            }
            className="avatar"
            alt="User Avatar"
          />
          {userData.first_name && userData.last_name ? (
            <h1 className="userName">{`${userData.last_name} ${userData.first_name}`}</h1>
          ) : (
            <Skeleton width={200} height={40} />
          )}
        </div>
        <div className="containerUserInfo">
          {renderUserInfo("Телефон", userData.phone_number)}
          {renderUserInfo("Почта", userData.email)}
        </div>

        <div className="footerModal">
          <Buttons
            ico={icons.logOut}
            className="logoutButton"
            text={"Выйти"}
            onClick={() => {
              logout();
            }}
          />
          <Buttons
            text={"Редактировать профиль"}
            className="redactButton"
            onClick={() => {
              setIsType("redact");
            }}
          />
        </div>
      </div>
    );
  };
  

  return isType === "view" ? <ViewContent /> : <RedactContent userData={userData} isType={setIsType}/>;
};

export default ProfileComponent;
