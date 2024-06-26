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
import Buttons from "../../components/Buttons/Buttons";

const CompanyListPage: FC = () => {
  const companyApi = new UserApiRequest();
  const [isHeaderTable, setHeaderTable] = useState<IUserOption>();
  const [isBodyTable, setBodyTable] = useState<any>([]);
  const [usersArray, setUsersArray] = useState<IUser[]>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [optionCreate, setOptionCreate] = useState<ICompanies>();

  useEffect(() => {
    companyApi.optionsUsersCompanies().then((resp) => {
      if (resp.success) {
        //@ts-ignore
        setHeaderTable(resp.data && resp.data.actions.list);

        companyApi.getUsersCompanies().then((resp) => {
          if (resp.success) {
            setBodyTable(resp.data && (resp.data.results as IUser[]));
          }
        });
        companyApi.list().then((resp) => {
          if (resp.success) {
            let data = fieldToArray(resp.data.results).map((item) => {
              return { value: item.key, display_name: item.value.email };
            });
            //@ts-ignore
            setUsersArray(data);
          }
        });
      }
    });
  }, []);

  const companyCreate = () => {
    companyApi.optionsUsersCompanies().then((resp) => {
      if (resp.success && resp.data && resp.data) {
        //@ts-ignore
        setOptionCreate(resp.data.actions.create as ICompanies);
        setIsOpenModal(true);
      }
    });
  };

  console.log("====================================");
  console.log("isBodyTable", usersArray);
  console.log("====================================");

  return (
    <Fragment>
      <Modal
        content={
          <div className="modalTable">
            <h1>Новая компания</h1>
            <div className="gridModal">
              {optionCreate &&
                fieldToArray(optionCreate).map((item) => {
                  return (
                    <FormInput
                      style={"col-3"}
                      value={undefined}
                      onChange={() => {}}
                      subInput={item.value.label}
                      required={item.value.required}
                      error={""}
                      keyData={""}
                      type={item.value.type}
                      //@ts-ignore
                      // options={item.key === "users" && usersArray}
                    />
                  );
                })}
            </div>
          </div>
        }
        onClose={() => setIsOpenModal(false)}
        isOpen={isOpenModal}
      />
      <div className="grayPageContainer">
        <HeaderAdmin title={"Создать компанию"} onClick={companyCreate} />
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
