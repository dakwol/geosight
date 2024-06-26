import React, { useRef, useState, useEffect, Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import icons from "../../assets/icons/icons";
import "./styles.scss";
import Modal from "../Modal/Modal";
import ProfileComponent from "../ProfileComponent/ProfileComponent";
import { IUser } from "../../models/IUser";
import Skeleton from "react-loading-skeleton";
import SidebarLayers from "./SidebarLayers/SidebarLayers";
import SidebarFilter from "./SidebarFilter/SidebarFilter";
import SidebarMap from "./SidebarMap/SidebarMap";
import apiConfig from "../../api/apiConfig";

const Sidebar = ({ sbData, pageType, mapData }: any) => {
  const [isActive, setIsActive] = useState(() => {
    const storedState = localStorage.getItem("sidebarState");
    return storedState ? JSON.parse(storedState) : false;
  });

  const storedUser = JSON.parse(
    localStorage.getItem("account") || "{}"
  ) as IUser;

  const { pathname } = useLocation();
  const sidebarRef = useRef(null);

  const active = sbData.findIndex((e: { path: string }) => e.path === pathname);

  const [isOpenModal, setIsOpenModal] = useState<string>("");
  const [typeModal, setTypeModal] = useState<string>("");
  const [activeTab, setActiveTab] = useState<number | null>(0); // Состояние для отслеживания активного элемента

  useEffect(() => {
    localStorage.setItem("sidebarState", JSON.stringify(isActive));
  }, [isActive]);

  const buttonTabsSidebar = [
    {
      id: 1,
      name: "",
      component: (
        <SidebarLayers mapDataId={mapData.id} mapDataLayers={mapData.layers} />
      ),
      active: false,
      ico: icons.layers,
      activeIco: icons.layersActive,
    },
    {
      id: 2,
      name: "",
      component: <SidebarFilter />,
      active: false,
      ico: icons.filterAlt,
      activeIco: icons.filterAltActive,
    },
    {
      id: 3,
      name: "",
      component: <SidebarMap />,
      active: false,
      ico: icons.map,
      activeIco: icons.mapActive,
    },
  ];

  // Обработчик клика для элементов в боковой панели
  const handleSidebarItemClick = (index: number) => {
    setActiveTab(index); // Устанавливаем активный элемент при клике
  };

  return (
    <Fragment>
      <Modal
        content={(() => {
          switch (isOpenModal) {
            case "profile":
              return (
                <ProfileComponent
                  userData={storedUser}
                  onType={(e) => {
                    setTypeModal(e);
                  }}
                />
              );
            default:
              return null;
          }
        })()}
        onClose={() => [setIsOpenModal(""), setTypeModal("")]}
        isOpen={isOpenModal != ""}
      />

      <div
        className={`sidebar__box ${isActive ? "active" : ""} ${
          pageType === "ControlPanel"
            ? "control-pannel_sidebar"
            : pageType === "SMI"
            ? "smi_sidebar"
            : ""
        }`}
      >
        <div ref={sidebarRef} className={`sidebar ${isActive ? "active" : ""}`}>
          <div className="sidebarContainer">
            <img src={icons.Logo} alt="Logo"></img>

            <div className="sidebar__container">
              <nav className="sidebar__nav">
                {sbData.map((e: any, i: React.Key | null | undefined) => (
                  <div
                    onClick={
                      e.id === 1
                        ? e.navigate
                        : (value) => {
                            setIsOpenModal(`${value}`);
                          }
                    }
                    key={i}
                    className={`nanItem ${i === active ? "active" : ""} `}
                  >
                    <img
                      src={e.ico}
                      alt="Icon"
                      style={isActive ? { marginRight: 0 } : {}}
                    ></img>
                    <span className={`display ${isActive ? "hidden" : ""}`}>
                      {e.name}
                    </span>
                  </div>
                ))}
              </nav>
              <div
                onClick={() => {
                  setIsOpenModal("profile");
                }}
                className="avatarUser"
              >
                {storedUser.avatar ? (
                  <img
                    src={`${apiConfig.baseUrlMedia}${storedUser.avatar.slice(
                      23
                    )}`}
                  ></img>
                ) : (
                  <Skeleton
                    circle
                    width={30}
                    height={30}
                    style={{ cursor: "pointer" }}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="sidebarRight">
            {mapData?.name ? (
              <h1 className="titleSidebar">{mapData?.name || ""}</h1>
            ) : (
              <Skeleton count={1} height={40} borderRadius={12} />
            )}
            <div className="tubSidebar">
              {buttonTabsSidebar.map((item, index) => (
                <div
                  key={item.id}
                  className={`buttonIco ${activeTab === index ? "active" : ""}`}
                  onClick={() => handleSidebarItemClick(index)}
                >
                  {item.ico && (
                    <img
                      src={activeTab === index ? item.activeIco : item.ico}
                      alt="Icon"
                      style={isActive ? { marginRight: 0 } : {}}
                    />
                  )}
                </div>
              ))}
            </div>
            <div>
              {buttonTabsSidebar.map((item, index) => (
                <div
                  key={item.id}
                  className={`${activeTab === index ? "active" : ""}`}
                >
                  {activeTab === index ? item.component : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Sidebar;
