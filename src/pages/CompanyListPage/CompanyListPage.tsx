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
import { useTypeSelector } from "../../hooks/useTypedSelector";
import { TableActionCreators } from "../../store/reducers/tableCreateReducer/action-creatorTable";
import { useDispatch } from "react-redux";
import ErrorMessage from "../../components/UI/ErrorMassage/ErrorMassage";

const CompanyListPage: FC = () => {
  const companyApi = new UserApiRequest();
  const [isHeaderTable, setHeaderTable] = useState<IUserOption>();
  const [isBodyTable, setBodyTable] = useState<any>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [optionCreate, setOptionCreate] = useState<ICompanies>();
  const [newCompany, setNewCompany] = useState<ICompanies>();

  const dispatch = useDispatch();

  const { Table, isUpdate, error } = useTypeSelector(
    (state) => state.TableReducer
  );

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
      }
    });
  }, [isUpdate]);

  const companyCreate = () => {
    companyApi.optionsUsersCompanies().then((resp) => {
      if (resp.success && resp.data && resp.data) {
        //@ts-ignore
        setOptionCreate(resp.data.actions.create as ICompanies);
        setIsOpenModal(true);
      }
    });
  };

  const handleNewCompany = (key: string, value: string | boolean) => {
    const updatedLayer = {
      ...newCompany,
      [key]: value,
    };
    setNewCompany(updatedLayer as ICompanies);
    dispatch(TableActionCreators.setTable(updatedLayer as ICompanies));
  };

  const newCompanyCreate = () => {
    companyApi.createCompanies(Table).then((resp) => {
      if (resp.success && resp.data) {
        dispatch(TableActionCreators.setUpdate(!isUpdate));
        setIsOpenModal(false);
      } else {
        dispatch(
          TableActionCreators.setErr({
            message: "Ошибка создания компании",
            type: "error",
          })
        );
      }
    });
  };

  const handleSearch = (value: string) => {
    companyApi.getUsersCompanies(`?search=${value}`).then((resp) => {
      if (resp.success) {
        setBodyTable(resp.data && resp.data.results);
      }
    });
  };

  return (
    <Fragment>
      {error.message && error.message !== "" && (
        <ErrorMessage
          type={error.type}
          message={error.message}
          onClick={function (): void {
            throw new Error("Function not implemented.");
          }}
          onClose={() => dispatch(TableActionCreators.setErr({ message: "" }))}
        ></ErrorMessage>
      )}
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
                      onChange={(value) => {
                        handleNewCompany(item.key, value);
                      }}
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
            <div className="gridModal">
              <Buttons text={"Отмена"} onClick={() => setIsOpenModal(false)} />
              <Buttons
                text={"Создать компанию"}
                onClick={() => {
                  newCompanyCreate();
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
          title={"Создать компанию"}
          onClick={companyCreate}
          onSearch={(value) => {
            handleSearch(value);
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
