import React, { useRef, useState, useEffect, Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import icons from "../../assets/icons/icons";
import "./styles.scss";
import Modal from "../Modal/Modal";
import ProfileComponent from "../ProfileComponent/ProfileComponent";
import { IUser } from "../../models/IUser";

const Sidebar = ({ sbData, pageType }: any) => {
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

  useEffect(() => {
    localStorage.setItem("sidebarState", JSON.stringify(isActive));
  }, [isActive]);

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
        isVisible={isOpenModal != ""}
        styleModal={typeModal === "redact" ? "bigModal" : ""}
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
                    onClick={(e) => {
                      setIsOpenModal("e.name");
                    }}
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
                <img src={icons.Logo}></img>
              </div>
            </div>
          </div>
          <div>
            <h1>1</h1>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Sidebar;
