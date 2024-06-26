import React, { FC, Fragment, useEffect, useState } from "react";
import HeaderAdmin from "../../components/HeaderAdmin/HeaderAdmin";
import "./styles.scss";
import Tables from "../../components/Tables/Tables";
import MapsApiRequest from "../../api/Maps/Maps";
import {
  IMapsCreateOptions,
  IMapsHeaderOptions,
  IMapsListOptions,
} from "../../models/IMaps";
import { IUserOption } from "../../models/IUser";
import { fieldToArray } from "../../components/UI/functions/functions";
import Modal from "../../components/Modal/Modal";
import FormInput from "../../components/FormInput/FormInput";
import Buttons from "../../components/Buttons/Buttons";
import { useDispatch } from "react-redux";
import { useTypeSelector } from "../../hooks/useTypedSelector";
import { TableActionCreators } from "../../store/reducers/tableCreateReducer/action-creatorTable";
import ErrorMessage from "../../components/UI/ErrorMassage/ErrorMassage";

const MapListPage: FC = () => {
  const mapsApi = new MapsApiRequest();
  const [isHeaderTable, setHeaderTable] = useState<IUserOption>();
  const [isBodyTable, setBodyTable] = useState<any>([]);
  const [optionCreate, setOptionCreate] = useState<IMapsCreateOptions>();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [newMap, setNewMap] = useState<IMapsCreateOptions>();
  const dispatch = useDispatch();

  const { Table, isUpdate, error } = useTypeSelector(
    (state) => state.TableReducer
  );

  useEffect(() => {
    mapsApi.options().then((resp) => {
      if (resp.success) {
        setHeaderTable(resp.data && resp.data.actions.list);
        setOptionCreate(resp.data && resp.data.actions.create);

        mapsApi.list().then((resp) => {
          if (resp.success) {
            setBodyTable(resp.data && resp.data.results);
          }
        });
      }
    });
  }, []);

  const handleNewMaps = (key: string, value: string | boolean) => {
    const updatedMap = {
      ...newMap,
      [key]: value,
    };
    setNewMap(updatedMap as IMapsCreateOptions);
    dispatch(TableActionCreators.setTable(updatedMap as IMapsCreateOptions));
  };

  const newMapCreate = () => {
    mapsApi.create({ body: Table }).then((resp) => {
      if (resp.success && resp.data) {
        dispatch(TableActionCreators.setUpdate(!isUpdate));
        setIsOpenModal(false);
      } else {
        dispatch(
          TableActionCreators.setErr({ message: resp.message, type: "error" })
        );
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
            <h1>Новая карта</h1>
            <div className="gridModal">
              {optionCreate &&
                fieldToArray(optionCreate).map((item) => {
                  return (
                    <FormInput
                      style={"col-3"}
                      value={undefined}
                      onChange={(e) => {
                        handleNewMaps(item.key, e);
                      }}
                      subInput={item.value.label}
                      required={item.value.required}
                      error={""}
                      keyData={""}
                      type={item.value.type}
                      //@ts-ignore
                      options={item.value.choices}
                    />
                  );
                })}
            </div>
            <div className="gridModal">
              <Buttons text={"Отмена"} onClick={() => setIsOpenModal(false)} />
              <Buttons
                text={"Создать карту"}
                onClick={() => {
                  newMapCreate();
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
          title={"Создать карту"}
          onClick={() => {
            setIsOpenModal(true);
          }}
        />
        <Tables
          data={isBodyTable}
          headers={isHeaderTable ? fieldToArray(isHeaderTable) : []}
          totals={[]}
        />
      </div>
    </Fragment>
  );
};

export default MapListPage;
