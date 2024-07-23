import React, { FC, useEffect, useState } from "react";
import FormInput from "../FormInput/FormInput";
import Buttons from "../Buttons/Buttons";
import UserApiRequest from "../../api/User/Users";
import apiConfig from "../../api/apiConfig";
import "./styles.scss";
import MapsApiRequest from "../../api/Maps/Maps";
import { useLocation } from "react-router-dom";
import icons from "../../assets/icons/icons";
import Loader from "../Loader/Loader";

interface IUserActive {
  id: number | string;
  avatar: string;
  first_name: string;
  last_name: string;
  email: string;
}

const SheringModal: FC = () => {
  const userApi = new UserApiRequest();
  const mapsApi = new MapsApiRequest();
  const [isUpdate, setIsUpdate] = useState(false);
  const [isCopy, setIsCopy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usersSearchArray, setUsersSearchArray] = useState<IUserActive[]>([]);
  const [usersArray, setUsersArray] = useState<IUserActive[]>([]);
  const [userActive, setUserActive] = useState<IUserActive>({
    id: "",
    avatar: "",
    first_name: "",
    last_name: "",
    email: "",
  });

  useEffect(() => {
    setIsLoading(true);
    mapsApi
      .getAllowedUser(`${localStorage.getItem("activeMap") || ""}/`)
      .then((resp) => {
        if (resp.success && resp.data) {
          setUsersArray(resp.data.results);
          setIsLoading(false);
        }
      });
  }, [isUpdate]);

  const handleSearchUsers = (value: string) => {
    userApi
      .getUsersCards(
        `${value}&map=${`${localStorage.getItem("activeMap") || ""}`}`
      )
      .then((resp) => {
        if (resp.success && resp.data) {
          setUsersSearchArray(resp.data.results);
        }
      });
  };

  const handleActiveUser = (item: IUserActive) => {
    setUserActive(item);
    setUsersSearchArray([]);
  };

  const handleInviteUser = () => {
    mapsApi
      .signAllowedUser(
        `${localStorage.getItem("activeMap") || ""}/`,
        `?map_url=${window.location.href}&user=${userActive.id}`
      )
      .then((resp) => {
        if (resp.success && resp.data) {
          setIsUpdate(!isUpdate);
        }
      });
  };

  const handleDeleteUser = (id: string) => {
    mapsApi
      .removeAllowedUser(`${localStorage.getItem("activeMap") || ""}/`, `${id}`)
      .then((resp) => {
        if (resp.success && resp.data) {
          setIsUpdate(!isUpdate);
        }
      });
  };

  const handleCopyLink = () => {
    const url = window.location.href; // Get the current URL
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setIsCopy(true);
        setTimeout(() => {
          setIsCopy(false);
        }, 1500);
      })
      .catch((err) => {
        console.error("Ошибка при копировании URL: ", err);
      });
  };

  return (
    <div className="sheringModal">
      <div className="sharingSearchContainer">
        <div className="searchInputContainer">
          <FormInput
            style={""}
            value={userActive.email}
            onChange={(value) => handleSearchUsers(value)}
            subInput={"Введите почту"}
            required={false}
            error={
              usersSearchArray &&
              //@ts-ignore
              usersSearchArray.length !== 0 &&
              "ничего не найдено"
            }
            keyData={""}
          />
          {usersSearchArray &&
            //@ts-ignore
            usersSearchArray.length !== 0 && (
              <div className="searhUserContainer">
                {
                  //@ts-ignore
                  usersSearchArray?.map((item) => {
                    return (
                      <div
                        className={`searchUserItem ${
                          userActive?.id == item.id && "active"
                        }`}
                        onClick={() => {
                          handleActiveUser(item);
                        }}
                      >
                        <img
                          src={`${apiConfig.baseUrlMedia}${item.avatar}`}
                        ></img>
                        <div>
                          <h3>{`${item.first_name} ${item.last_name}`}</h3>
                          <p>{`${item.email}`}</p>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            )}
          <Buttons
            text={"Пригласить"}
            disabled={userActive.id === ""}
            onClick={() => handleInviteUser()}
          />
        </div>
      </div>
      <div className="containerShering">
        {usersArray || isLoading ? (
          //@ts-ignore
          usersArray.length !== 0 && (
            <div className="usersSharedContainer">
              {
                //@ts-ignore
                usersArray?.map((item) => {
                  return (
                    <div className={`searchUserItemArray `}>
                      <div className="searchUserItem">
                        <img
                          src={`${apiConfig.baseUrlMedia}${item.avatar}`}
                        ></img>
                        <div>
                          <h3>{`${item.first_name} ${item.last_name}`}</h3>
                          <p>{`${item.email}`}</p>
                        </div>
                      </div>
                      <div
                        className="deleteUser"
                        onClick={() => handleDeleteUser(`${item.id}`)}
                      ></div>
                    </div>
                  );
                })
              }
            </div>
          )
        ) : (
          <div className="loaderContainerModal">
            <Loader />
          </div>
        )}
        <p className="copyLinkButton" onClick={handleCopyLink}>
          <img src={icons.fileCopy}></img>{" "}
          {`${isCopy ? "Ссылка скопирована" : "Скопировать ссылку"}`}
        </p>
      </div>
    </div>
  );
};

export default SheringModal;
