import { FC, useEffect, useState } from "react";
import UserApiRequest from "../../../api/User/Users";
import icons from "../../../assets/icons/icons";
import Buttons from "../../Buttons/Buttons";
import FormInput from "../../FormInput/FormInput";
import { fieldToArray } from "../../UI/functions/functions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import apiConfig from "../../../api/apiConfig";
import { IUserOption } from "../../../models/IUser";

const RedactContent: FC<any> = ({userData, isType}) => {
    const [optionUserUpdate, setOptionUserUpdate] = useState<IUserOption[]>([]);
    const [localDataPress, setLocalDataPress] = useState<Record<string, any>>({});

    useEffect(() => {
      userApi
        .options()
        .then((resp) => {
          if (resp.success) {
            setOptionUserUpdate(resp.data?.actions?.update || []);
          }
        })
        .catch((error) => {
          console.error("Error fetching user options:", error);
        });
    
  }, []);
  

    const navigate = useNavigate();
    const dataPress = useSelector(
      (state: any) => state.dataPressReducer.dataPress
    );
  
  const userApi = new UserApiRequest();

  useEffect(() => {
    if (userData) {
      const newData = fieldToArray(userData).reduce((acc, item) => {
        //@ts-ignore
        acc[item.key] = item.value;
        return acc;
      }, {});
      setLocalDataPress(newData);
    }
  }, [userData]);


  const handleChange = (fieldName: string, fieldValue: string | boolean) => {
    setLocalDataPress(prevState => ({
      ...prevState,
      [fieldName]: fieldValue
    }));
  };
  const redactUser = () => {
    userApi.update({ id: `${userData.id}/`, body: localDataPress }).then((resp) => {
      if (resp.success && resp.data) {
        console.log(resp.data);
        localStorage.setItem('account', JSON.stringify(resp.data))
        setLocalDataPress(resp.data)
      }
    });
  };
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

            console.log('item',item);
            

            return (
              <FormInput
                style={""}
                value={
                  //@ts-ignore
                  localDataPress[item.key]
                }
                onChange={(value) => {
                  handleChange(item.key, value);
                }}
                subInput={item.value.label}
                required={item.value.required}
                error={""}
                type={item.value.type}
                friedlyInput
                keyData={item.key}
              />
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
              isType("view");
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

export default RedactContent;