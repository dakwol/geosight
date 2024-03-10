import React, { FC, useEffect, useState } from "react";
import HeaderAdmin from "../../components/HeaderAdmin/HeaderAdmin";
import "./styles.scss";
import Tables from "../../components/Tables/Tables";
import UserApiRequest from "../../api/User/Users";
import { IUser, IUserOption } from "../../models/IUser";
import { fieldToArray } from "../../components/UI/functions/functions";

const CompanyListPage: FC = () => {
  const companyApi = new UserApiRequest();
  const [isHeaderTable, setHeaderTable] = useState<IUserOption>();
  const [isBodyTable, setBodyTable] = useState<any>([]);

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

  return (
    <div className="grayPageContainer">
      <HeaderAdmin />
      <Tables
        data={isBodyTable ? isBodyTable : []}
        //@ts-ignore
        headers={isHeaderTable ? fieldToArray(isHeaderTable) : []}
        totals={[]}
      />
    </div>
  );
};

export default CompanyListPage;
