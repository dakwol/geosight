import React, { FC, Fragment, useEffect, useState } from "react";
import "./styles.scss";
import Skeleton from "react-loading-skeleton";
import Buttons from "../Buttons/Buttons";
import icons from "../../assets/icons/icons";
import FormInput from "../FormInput/FormInput";
import { IUser, IUserOption } from "../../models/IUser";
import { useDispatch } from "react-redux";
import { AuthActionCreators } from "../../store/reducers/auth/action-creator";
import UserApiRequest from "../../api/User/Users";
import { fieldToArray } from "../UI/functions/functions";
import { DataPressActionCreators } from "../../store/reducers/dataPressItem/action-creator";
import apiConfig from "../../api/apiConfig";

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

  const renderUserForm = () => {
    return (
      <div className="formUser">
        {optionUserUpdate ? (
          fieldToArray(optionUserUpdate)?.map((item, index) => {
            if (item.key === "id" || item.key === "avatar") {
              return;
            }
            return (
              <Fragment>
                {item.value ? (
                  <FormInput
                    style={""}
                    value={
                      //@ts-ignore
                      userData[item.key]
                    }
                    onChange={(e) => {
                      handleChange(item.key, e);
                    }}
                    subInput={item.value.label}
                    required={item.value.required}
                    error={""}
                    friedlyInput
                    keyData={item.key}
                  />
                ) : (
                  <Skeleton />
                )}
              </Fragment>
            );
          })
        ) : (
          <>
            <Skeleton count={1} height={"60rem"} borderRadius={12} />
            <Skeleton count={1} height={"60rem"} borderRadius={12} />
            <Skeleton count={1} height={"60rem"} borderRadius={12} />
            <Skeleton count={1} height={"60rem"} borderRadius={12} />
          </>
        )}
      </div>
    );
  };

  console.log("====================================");
  console.log("userData", userData);
  console.log("====================================");

  const ViewContent: FC = () => {
    return (
      <div>
        <h1 className="titleModal">Личный кабинет</h1>
        <div className="containerUserInfoAvatar">
          <img
            src={
              userData.avatar
                ? `${apiConfig.baseUrlMedia}${userData.avatar.slice(23)}`
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
              //@ts-ignore
              dispatch(AuthActionCreators.logout());
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
                  ? `${apiConfig.baseUrlMedia}${userData.avatar.slice(23)}`
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
        <div className="containerUserInfo">{renderUserForm()}</div>

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
              // handle click
            }}
          />
        </div>
      </div>
    );
  };

  return isType === "view" ? <ViewContent /> : <RedactContent />;
};

export default ProfileComponent;
