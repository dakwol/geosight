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
import { isAdmin, isManager } from "../../utils";
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
  const [isRedact, setIsRedact] = useState(false);
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
    setIsRedact(false);
    setIsOpenModal(true);
  };

  const handleNewUser = (key: string, value: string | boolean) => {
    const updatedUser = {
      ...newUser,
      [key]: value,
    };
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
    dispatch(UserActionCreators.setUser(undefined));

    userApi.options().then((resp) => {
      if (resp.success) {
        setOptionCreate(resp.data.actions.edit as IUserCreateOption);
        userApi.getById({ id: userItem.id }).then((resp) => {
          if (resp.success && resp.data) {
            const updatedUser = fieldToArray(resp.data).reduce(
              (acc, data) => {
                //@ts-ignore
                acc[data.key] = data.value;
                return acc;
              },
              { ...newUser }
            );
            setIsRedact(true);
            setNewUser(updatedUser as IUser);
            dispatch(UserActionCreators.setUser(updatedUser as IUser));
            setIsOpenModal(true);
          }
        });
      }
    });
  };

  const userUpdate = () => {
    userApi.editUser(`${User?.id}/`, User).then((resp) => {
      if (resp.success && resp.data) {
        dispatch(UserActionCreators.setUpdate(!isUpdate));
        setIsOpenModal(false);
      } else {
        dispatch(
          UserActionCreators.setErr({ message: resp.message, type: "error" })
        );
      }
    });
  };
  const userDelete = (id: string | number) => {
    userApi.delete({ id: `${id}/` }).then((resp) => {
      if (resp.success && resp.data) {
        dispatch(UserActionCreators.setUpdate(!isUpdate));
        setIsOpenModal(false);
      } else {
        dispatch(
          UserActionCreators.setErr({ message: resp.message, type: "error" })
        );
      }
    });
  };

  const handleSearch = (value: string) => {
    userApi.list({ urlParams: `?search=${value}` }).then((resp) => {
      if (resp.success) {
        setBodyTable(resp.data && resp.data.results);
      }
    });
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
            <h1>{isRedact ? "Редактировать профиль" : "Создать профиль"}</h1>
            <div className="gridModal">
              {optiomCreate &&
                fieldToArray(optiomCreate).map((item) => {
                  if (isAdmin || item.key !== "company") {
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
                        options={
                          isManager
                            ? item.value.choices?.slice(0, -1)
                            : item.value.choices
                        }
                      />
                    );
                  }
                })}
            </div>
            <div className="gridModal">
              <Buttons text={"Отмена"} onClick={() => setIsOpenModal(false)} />
              <Buttons
                text={isRedact ? "Редактировать" : "Создать пользователя"}
                onClick={() => {
                  isRedact ? userUpdate() : newUserCreate();
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
          onSearch={(value) => {
            handleSearch(value);
          }}
        />
        <Tables
          data={isBodyTable ? isBodyTable : []}
          //@ts-ignore
          headers={isHeaderTable ? fieldToArray(isHeaderTable) : []}
          totals={[]}
          onItemClick={(e) => handleRedactUser(e as any)}
          onItemDelete={(item) => {
            userDelete(item.id);
          }}
        />
      </div>
    </>
  );
};

export default UsersListPage;
