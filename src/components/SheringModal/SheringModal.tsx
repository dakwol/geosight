import React, { FC, useEffect, useState } from "react";
import FormInput from "../FormInput/FormInput";
import Buttons from "../Buttons/Buttons";
import UserApiRequest from "../../api/User/Users";

const SheringModal: FC = () => {
  const userApi = new UserApiRequest();
  const [usersArray, setUsersArray] = useState();

  useEffect(() => {
    userApi.getCompanyUsers().then((resp) => {
      if (resp.success && resp.data) {
        console.log("rrrrrrrr", resp.data);
        setUsersArray(resp.data);
      }
    });
  }, []);

  return (
    <div>
      <div>
        <div>
          <FormInput
            style={""}
            value={undefined}
            onChange={function (value: string, isChecked?: boolean): void {
              throw new Error("Function not implemented.");
            }}
            subInput={"Введите почту"}
            required={false}
            error={""}
            keyData={""}
          />
          <div>
            {usersArray &&
              //@ts-ignore
              usersArray.length !== 0 &&
              //@ts-ignore
              usersArray?.map((item) => {
                return <></>;
              })}
          </div>
        </div>
        <Buttons
          text={"Пригласить"}
          onClick={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>
    </div>
  );
};

export default SheringModal;
