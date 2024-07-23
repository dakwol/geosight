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
import { isAdmin } from "../../utils";

const MapListPage: FC = () => {
  const mapsApi = new MapsApiRequest();
  const [isHeaderTable, setHeaderTable] = useState<IUserOption>();
  const [isBodyTable, setBodyTable] = useState<any>([]);
  const [optionCreate, setOptionCreate] = useState<IMapsCreateOptions>();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [newMap, setNewMap] = useState<IMapsCreateOptions>();
  const [isRedact, setIsRedact] = useState(false);
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
  }, [isUpdate]);

  const handleOpenModal = () => {
    setIsOpenModal(true);
    setIsRedact(false);
    dispatch(TableActionCreators.setTable(undefined));
  };

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
  const mapUpdate = () => {
    mapsApi.update({ id: `${Table.id}/`, body: Table }).then((resp) => {
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
  const mapDelete = (id: string | number) => {
    mapsApi.delete({ id: `${id}/` }).then((resp) => {
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

  const handleSearch = (value: string) => {
    mapsApi.list({ urlParams: `?search=${value}` }).then((resp) => {
      if (resp.success) {
        setBodyTable(resp.data && resp.data.results);
      }
    });
  };

  const handleRedactMap = (item: any) => {
    console.log("dddddd", item);

    mapsApi.getById({ id: item.id, urlParams: `/data` }).then((resp) => {
      if (resp.success && resp.data) {
        const updatedMap = fieldToArray(resp.data).reduce(
          (acc, data) => {
            //@ts-ignore
            acc[data.key] = data.value;
            return acc;
          },
          { ...newMap }
        );
        setIsRedact(true);
        setNewMap(updatedMap as IMapsCreateOptions);
        dispatch(
          TableActionCreators.setTable(updatedMap as IMapsCreateOptions)
        );
        setIsOpenModal(true);
      }
    });
  };

  console.log("Table", Table);

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
            <h1>{isRedact ? "Редактирование карты" : "Новая карта"}</h1>
            <div className="gridModal">
              {optionCreate &&
                fieldToArray(optionCreate).map((item) => {
                  if (isAdmin || item.key !== "company") {
                    console.log("ssss", isAdmin);

                    return (
                      <FormInput
                        style={"col-3"}
                        value={Table ? Table[item.key] : undefined}
                        onChange={(e) => {
                          handleNewMaps(item.key, e);
                        }}
                        subInput={item.value.label}
                        required={item.value.required}
                        error={""}
                        textArea={item.key === "description"}
                        keyData={""}
                        type={item.value.type}
                        //@ts-ignore
                        options={item.value.choices}
                      />
                    );
                  }
                })}
            </div>
            <div className="gridModal">
              <Buttons text={"Отмена"} onClick={() => setIsOpenModal(false)} />
              <Buttons
                text={isRedact ? "Редактировать" : "Создать карту"}
                onClick={() => {
                  isRedact ? mapUpdate() : newMapCreate();
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
            handleOpenModal();
          }}
          onSearch={(value) => {
            handleSearch(value);
          }}
        />
        <Tables
          data={isBodyTable}
          headers={isHeaderTable ? fieldToArray(isHeaderTable) : []}
          totals={[]}
          onItemClick={(item) => {
            handleRedactMap(item);
          }}
          onItemDelete={(item) => {
            mapDelete(item.id);
          }}
        />
      </div>
    </Fragment>
  );
};

export default MapListPage;
