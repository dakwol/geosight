import React, { FC, useCallback, useEffect, useState } from "react";
import HeaderAdmin from "../../components/HeaderAdmin/HeaderAdmin";
import "./styles.scss";
import Tables from "../../components/Tables/Tables";
import UserApiRequest from "../../api/User/Users";
import { IUser, IUserCreateOption, IUserOption } from "../../models/IUser";
import { fieldToArray } from "../../components/UI/functions/functions";
import Modal from "../../components/Modal/Modal";
import FormInput from "../../components/FormInput/FormInput";
import Buttons from "../../components/Buttons/Buttons";
import { useTypeSelector } from "../../hooks/useTypedSelector";
import { useDispatch } from "react-redux";
import { UserActionCreators } from "../../store/reducers/userCreateReducer/action-creatorUser";
import ErrorMessage from "../../components/UI/ErrorMassage/ErrorMassage";
interface ClassContain {
  company: string;
  email: string;
  first_name: string;
  is_send_email: string;
  last_name: string;
  password: string;
  phone_number: string;
  role: string;
}

const UsersListPage: FC = () => {
  const userApi = new UserApiRequest();
  const [isHeaderTable, setHeaderTable] = useState<IUserOption>();
  const [optiomCreate, setOptionCreate] = useState<IUserCreateOption>();
  const [isBodyTable, setBodyTable] = useState<any>([]);
  const [newUser, setNewUser] = useState<IUser>();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const dispatch = useDispatch();

  const { User, isUpdate, error } = useTypeSelector(
    (state) => state.UserReducer
  );

  const classContain: ClassContain = {
    company: "col-3",
    email: "col-3",
    first_name: "col-1",
    is_send_email: "col-3",
    last_name: "col-2",
    password: "col-2",
    phone_number: "col-1",
    role: "col-3",
  };

  useEffect(() => {
    userApi.options().then((resp) => {
      if (resp.success) {
        setHeaderTable(resp.data && resp.data.actions.list);
        setOptionCreate(resp.data.actions.create as IUserCreateOption);

        userApi.list().then((resp) => {
          if (resp.success) {
            setBodyTable(resp.data && (resp.data.results as IUser));
          }
        });
      }
    });
  }, [isUpdate]);

  const userCreateModal = () => {
    dispatch(UserActionCreators.setUser(undefined));

    setIsOpenModal(true);
  };

  const handleNewUser = (key: string, value: string | boolean) => {
    const updatedUser = {
      ...newUser,
      [key]: value,
    };
    console.log("====================================");
    console.log("updatedUser", updatedUser);
    console.log("====================================");
    setNewUser(updatedUser as IUser);
    dispatch(UserActionCreators.setUser(updatedUser as IUser));
  };

  const newUserCreate = () => {
    userApi.create({ body: User }).then((resp) => {
      if (resp.success && resp.data) {
        dispatch(UserActionCreators.setUpdate(!isUpdate));
        setIsOpenModal(false);
      } else {
        dispatch(
          UserActionCreators.setErr({
            message: "Ошибка создания пользователя",
            type: "error",
          })
        );
      }
    });
  };

  const handleRedactUser = (userItem: IUser) => {
    setIsOpenModal(true);
    dispatch(UserActionCreators.setUser(undefined));
    fieldToArray(userItem).forEach((item) =>
      handleNewUser(item.key, item.value)
    );
  };

  return (
    <>
      {error.message !== "" && error.message && (
        <ErrorMessage
          type={error.type}
          message={error.message}
          onClick={function (): void {
            throw new Error("Function not implemented.");
          }}
          onClose={() => dispatch(UserActionCreators.setErr({ message: "" }))}
        ></ErrorMessage>
      )}
      <Modal
        content={
          <div className="modalTable">
            <h1>Создать профиль</h1>
            <div className="gridModal">
              {optiomCreate &&
                fieldToArray(optiomCreate).map((item) => {
                  return (
                    <FormInput
                      style={
                        //@ts-ignore
                        classContain[item.key]
                      }
                      value={
                        User
                          ? //@ts-ignore
                            User[item.key]
                          : undefined
                      }
                      checked={
                        User
                          ? //@ts-ignore
                            User[item.key]
                          : false
                      }
                      onChange={(e) => {
                        handleNewUser(item.key, e);
                      }}
                      onCheck={(e) => {
                        handleNewUser(item.key, e);
                      }}
                      subInput={item.value.label}
                      required={item.value.required}
                      error={""}
                      type={item.value.type}
                      keyData={""}
                      options={item.value.choices}
                    />
                  );
                })}
            </div>
            <div className="gridModal">
              <Buttons text={"Отмена"} onClick={() => setIsOpenModal(false)} />
              <Buttons
                text={"Создать пользователя"}
                onClick={() => {
                  newUserCreate();
                }}
              />
            </div>
          </div>
        }
        onClose={() => setIsOpenModal(false)}
        isOpen={isOpenModal}
      />
      <div className="grayPageContainer">
        <HeaderAdmin
          title={"Создать пользователя"}
          onClick={() => {
            userCreateModal();
          }}
        />
        <Tables
          data={isBodyTable ? isBodyTable : []}
          //@ts-ignore
          headers={isHeaderTable ? fieldToArray(isHeaderTable) : []}
          totals={[]}
          onItemClick={(e) => handleRedactUser(e as any)}
        />
      </div>
    </>
  );
};

export default UsersListPage;
