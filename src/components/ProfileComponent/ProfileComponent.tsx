import React, { FC, Fragment, useEffect, useState } from "react";
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
import FilePicker from "../FilePicker/FilePicker";

interface IUserDataProps {
  avatar: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface IUserData {
  userData: IUser;
  onType: (e: string) => void;
}

const ProfileComponent: FC<IUserData> = ({ userData, onType }) => {
  const [isType, setIsType] = useState<string>("view");
  const [optionUserUpdate, setOptionUserUpdate] = useState<IUserOption[]>();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dataPress = useSelector(
    (state: any) => state.dataPressReducer.dataPress
  );

  useEffect(() => {
    if (userData) {
      fieldToArray(userData).map((item) => handleChange(item.key, item.value));
    }
  }, [userData]);

  const userApi = new UserApiRequest();

  const handleChange = (fieldName: string, fieldValue: string | boolean) => {
    dispatch(DataPressActionCreators.setDataPress(fieldName, fieldValue));
  };

  useEffect(() => {
    onType(isType);
    if (isType === "redact") {
      userApi
        .options()
        .then((resp) => {
          if (resp.success) {
            //@ts-ignore
            setOptionUserUpdate(resp.data?.actions?.update);
          }
        })
        .catch((error) => {
          console.error("Error fetching user options:", error);
        });
    }
  }, [isType]);

  console.log("dataPress", dataPress);

  const renderUserInfo = (label: string, value: string) => {
    return (
      <div className="userInfo">
        <label>{label}</label>
        {value ? (
          <h4>{value}</h4>
        ) : (
          <Skeleton count={1} height={"30rem"} width={300} borderRadius={12} />
        )}
      </div>
    );
  };

  const redactUser = () => {
    userApi.update({ id: `${userData.id}/`, body: dataPress }).then((resp) => {
      if (resp.success && resp.data) {
        console.log(resp.data);
      }
    });
  };

  const logout = () => {
    //@ts-ignore
    dispatch(AuthActionCreators.logout());
    navigate(RouteNames.LOGIN);
  };

  const renderUserForm = () => {
    return (
      <div className="formUser">
        {optionUserUpdate &&
          fieldToArray(optionUserUpdate)?.map((item, index) => {
            if (item.key === "id" || item.key === "avatar") {
              return;
            }
            return (
              <Fragment>
                <FormInput
                  style={""}
                  value={
                    //@ts-ignore
                    dataPress[item.key] || userData[item.key]
                  }
                  onChange={(e) => {
                    handleChange(item.key, e);
                  }}
                  subInput={item.value.label}
                  required={item.value.required}
                  error={""}
                  type={item.value.type}
                  friedlyInput
                  keyData={item.key}
                />
              </Fragment>
            );
          })}
      </div>
    );
  };

  console.log("====================================");
  console.log("userData", userData);
  console.log("====================================");

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
  const RedactContent: FC = () => {
    return (
      <div>
        <h1 className="titleModal">Редактировать профиль</h1>
        <div className="containerUserInfoAvatar redact">
          <img
            src={
              userData.avatar
                ? userData.avatar
                  ? `${apiConfig.baseUrlMedia.slice(
                      0,
                      -6
                    )}${userData.avatar.slice(23)}`
                  : icons.photoNone
                : icons.photoNone
            }
            className="avatar"
            alt="User Avatar"
          />
          <div className="redactPhoto">
            <img src={icons.photo_camera}></img>
          </div>
        </div>
        <div className="containerUserInfo">
        <div className="formUser">
        {optionUserUpdate &&
          fieldToArray(optionUserUpdate)?.map((item, index) => {
            if (item.key === "id" || item.key === "avatar") {
              return;
            }
            return (
              <Fragment>
                <FormInput
                  style={""}
                  value={
                    //@ts-ignore
                    dataPress[item.key] || userData[item.key]
                  }
                  onChange={(e) => {
                    handleChange(item.key, e);
                  }}
                  subInput={item.value.label}
                  required={item.value.required}
                  error={""}
                  type={item.value.type}
                  friedlyInput
                  keyData={item.key}
                />
              </Fragment>
            );
          })}
      </div>
        </div>

        <div className="footerModal">
          <Buttons
            ico={icons.logOut}
            className="logoutButton"
            text={"Назад"}
            onClick={() => {
              setIsType("view");
            }}
          />
          <div></div>
          <Buttons
            text={"Сохранить изменения"}
            className="redactButton"
            onClick={() => {
              redactUser();
            }}
          />
        </div>
      </div>
    );
  };

  return isType === "view" ? <ViewContent /> : <RedactContent />;
};

export default ProfileComponent;
