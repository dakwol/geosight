import React, { FC, useEffect, useState } from "react";
import HeaderAdmin from "../../components/HeaderAdmin/HeaderAdmin";
import "./styles.scss";
import Tables from "../../components/Tables/Tables";
import UserApiRequest from "../../api/User/Users";
import { IUser, IUserCreateOption, IUserOption } from "../../models/IUser";
import { fieldToArray } from "../../components/UI/functions/functions";
import Modal from "../../components/Modal/Modal";
import FormInput from "../../components/FormInput/FormInput";

const UsersListPage: FC = () => {
  const userApi = new UserApiRequest();
  const [isHeaderTable, setHeaderTable] = useState<IUserOption>();
  const [optiomCreate, setOptionCreate] = useState<IUserCreateOption>();
  const [isBodyTable, setBodyTable] = useState<any>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const classContain = {
    cadastral: "col-1",
    type: "col-1",
    land_cost: "col-1",
    market_value: "col-1",
    number: "col-2",
    area: "col-2",
    utilities_cost: "col-2",
    down_payment: "col-2",
  };

  useEffect(() => {
    userApi.options().then((resp) => {
      if (resp.success) {
        //@ts-ignore
        setHeaderTable(resp.data && resp.data.actions.list);

        userApi.list().then((resp) => {
          if (resp.success) {
            //@ts-ignore
            setBodyTable(resp.data && (resp.data.results as IUser));
          }
        });
      }
    });
  }, []);

  const userCreate = () => {
    console.log("userCreate вызван"); // Отладочное сообщение
    userApi.options().then((resp) => {
      if (resp.success && resp.data && resp.data) {
        //@ts-ignore
        setOptionCreate(resp.data.actions.create as IUserCreateOption);
        setIsOpenModal(true);
      }
    });
  };

  return (
    <>
      <Modal
        content={
          <div className="gridModal">
            {optiomCreate &&
              fieldToArray(optiomCreate).map((item) => {
                return (
                  <FormInput
                    style={""}
                    value={undefined}
                    onChange={() => {}}
                    subInput={item.value.label}
                    required={item.value.required}
                    error={""}
                    keyData={""}
                    options={item.value.choices}
                  />
                );
              })}
          </div>
        }
        onClose={() => setIsOpenModal(false)}
        isOpen={isOpenModal}
      />
      <div className="grayPageContainer">
        <HeaderAdmin
          title={"Создать пользователя"}
          onClick={() => {
            userCreate();
          }}
        />
        <Tables
          data={isBodyTable ? isBodyTable : []}
          //@ts-ignore
          headers={isHeaderTable ? fieldToArray(isHeaderTable) : []}
          totals={[]}
        />
      </div>
    </>
  );
};

export default UsersListPage;
