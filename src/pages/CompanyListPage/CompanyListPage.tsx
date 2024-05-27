import React, { FC, Fragment, useEffect, useState } from "react";
import HeaderAdmin from "../../components/HeaderAdmin/HeaderAdmin";
import "./styles.scss";
import Tables from "../../components/Tables/Tables";
import UserApiRequest from "../../api/User/Users";
import { IUser, IUserOption } from "../../models/IUser";
import { fieldToArray } from "../../components/UI/functions/functions";
import FormInput from "../../components/FormInput/FormInput";
import Modal from "../../components/Modal/Modal";
import { ICompanies } from "../../models/ICompanies";

const CompanyListPage: FC = () => {
  const companyApi = new UserApiRequest();
  const [isHeaderTable, setHeaderTable] = useState<IUserOption>();
  const [isBodyTable, setBodyTable] = useState<any>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [optionCreate, setOptionCreate] = useState<ICompanies>();

  useEffect(() => {
    companyApi.optionsUsersCompanies().then((resp) => {
      if (resp.success) {
        //@ts-ignore
        setHeaderTable(resp.data && resp.data.actions.list);

        companyApi.getUsersCompanies().then((resp) => {
          if (resp.success) {
            //@ts-ignore
            setBodyTable(resp.data && (resp.data.results as IUser));
          }
        });
      }
    });
  }, []);

  const companyCreate = () => {
    console.log("userCreate вызван"); // Отладочное сообщение
    companyApi.options().then((resp) => {
      if (resp.success && resp.data && resp.data) {
        //@ts-ignore
        setOptionCreate(resp.data.actions.create as IUserCreateOption);
        setIsOpenModal(true);
      }
    });
  };

  return (
    <Fragment>
      <Modal
        content={
          <div>
            {optionCreate &&
              fieldToArray(optionCreate).map((item) => {
                return (
                  <FormInput
                    style={""}
                    value={undefined}
                    onChange={() => {}}
                    subInput={item.value.label}
                    required={item.value.required}
                    error={""}
                    keyData={""}
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
          title={"Создать компанию"}
          onClick={() => {
            companyCreate();
          }}
        />
        <Tables
          data={isBodyTable ? isBodyTable : []}
          //@ts-ignore
          headers={isHeaderTable ? fieldToArray(isHeaderTable) : []}
          totals={[]}
        />
      </div>
    </Fragment>
  );
};

export default CompanyListPage;
