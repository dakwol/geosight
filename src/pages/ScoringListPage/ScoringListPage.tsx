import React, { FC, Fragment, useEffect, useState } from "react";
import HeaderAdmin from "../../components/HeaderAdmin/HeaderAdmin";
import "./styles.scss";
import Tables from "../../components/Tables/Tables";

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
import MapsApiRequest from "../../api/Maps/Maps";
import { DataTable } from "primereact/datatable";
import { Column, ColumnEditorOptions, ColumnEvent } from "primereact/column";
import { InputText } from "primereact/inputtext";

const ScoringListPage: FC = () => {
  const ScoringApi = new MapsApiRequest();
  const [isHeaderTable, setHeaderTable] = useState<IUserOption>();
  const [isBodyTable, setBodyTable] = useState<any>([]);
  const [optionCreate, setOptionCreate] = useState<any>();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [newMap, setNewMap] = useState<any>();
  const [isRedact, setIsRedact] = useState(false);
  const [poi, setPoi] = useState<any>([]);
  const dispatch = useDispatch();

  const { Table, isUpdate, error } = useTypeSelector(
    (state) => state.TableReducer
  );

  useEffect(() => {
    ScoringApi.layersScoringOption().then((resp) => {
      if (resp.success) {
        setHeaderTable(resp.data && resp.data.actions.scoring_list);
        setOptionCreate(resp.data && resp.data.actions.scoring);

        ScoringApi.getLayersScoring().then((resp) => {
          if (resp.success) {
            setBodyTable(resp.data && resp.data.results);
          }
        });
      }
    });
  }, [isUpdate]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(TableActionCreators.setUpdate(!isUpdate));
    }, 15000);

    return () => clearInterval(interval);
  }, [isUpdate]);

  const handleNewScoring = (
    key: string,
    value: string | boolean | string[]
  ) => {
    const updatedMap = {
      ...newMap,
      [key]: value,
    };
    setNewMap(updatedMap as any);
    dispatch(TableActionCreators.setTable(updatedMap as any));
  };

  const newScoringCreate = () => {
    ScoringApi.createScoring(Table).then((resp) => {
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
  // const mapUpdate = () => {
  //   ScoringApi.updateLayersScoring(`${Table.id}/`, Table).then((resp) => {
  //     if (resp.success && resp.data) {
  //       dispatch(TableActionCreators.setUpdate(!isUpdate));
  //       setIsOpenModal(false);
  //     } else {
  //       dispatch(
  //         TableActionCreators.setErr({ message: resp.message, type: "error" })
  //       );
  //     }
  //   });
  // };
  const scoringKill = (id: string | number) => {
    ScoringApi.killLayersScoring(`${id}`).then((resp) => {
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

  const handleOpenScoringModal = () => {
    ScoringApi.layersPoi().then((resp) => {
      if (resp.success && resp.data) {
        setPoi(resp.data);
        setIsOpenModal(true);
      }
    });
  };

  const handleSearch = (value: string) => {
    ScoringApi.list({ urlParams: `?search=${value}` }).then((resp) => {
      if (resp.success) {
        setBodyTable(resp.data && resp.data.results);
      }
    });
  };

  console.log("TABLES", Table);

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
            <h1>{isRedact ? "Редактирование скоринга" : "Новый скоринг"}</h1>
            <div className="gridModal">
              {optionCreate &&
                fieldToArray(optionCreate).map((item) => {
                  if (item.key === "poi") {
                    console.log("itemitem", item);

                    return (
                      <div className="col-3">
                        <Tables
                          data={poi}
                          type="poi"
                          headers={fieldToArray(item.value.child.children)}
                          totals={[]}
                          onDataChange={(data) =>
                            //@ts-ignore
                            handleNewScoring(item.key, data)
                          }
                        />
                      </div>
                    );
                  }
                  return (
                    <FormInput
                      key={item.key} // Уникальный ключ для каждого FormInput
                      style="col-3"
                      value={Table ? Table[item.key] : undefined}
                      onChange={(e) =>
                        handleNewScoring(
                          item.key,
                          item.key === "maps" ? [e] : e
                        )
                      }
                      subInput={item.value.label}
                      required={item.value.required}
                      error={""}
                      //@ts-ignore
                      textArea={item.key === "description"}
                      keyData={""}
                      type={item.value.type}
                      // @ts-ignore
                      options={item.value.choices}
                    />
                  );
                })}
            </div>

            <div className="gridModal">
              <Buttons text={"Отмена"} onClick={() => setIsOpenModal(false)} />
              <Buttons
                text={"Создать скоринг"}
                onClick={() => {
                  newScoringCreate();
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
          title={"Создать скоринг"}
          onClick={() => {
            handleOpenScoringModal();
          }}
          onSearch={(value) => {
            handleSearch(value);
          }}
        />
        <Tables
          data={isBodyTable}
          headers={isHeaderTable ? fieldToArray(isHeaderTable) : []}
          totals={[]}
          type="scoring"
          onItemDelete={(item) => {
            scoringKill(item.id);
          }}
        />
      </div>
    </Fragment>
  );
};

export default ScoringListPage;
