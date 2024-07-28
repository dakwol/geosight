import React, { useEffect, useState } from "react";
import "./styles.scss"; // Подключите свои стили здесь
import { IOptionInput } from "../../models/IOptionInput";
import {
  fieldToArray,
  formatDateIntlDate,
  formatDateIntlTimeDate,
} from "../UI/functions/functions";
import Loader from "../Loader/Loader";
import icons from "../../assets/icons/icons";
import FormInput from "../FormInput/FormInput";

interface Header {
  key: string;
  value: IOptionInput;
}

interface Item {
  [key: string]: string | number;
}

interface Props {
  data: Item[];
  headers: Header[];
  totals: (string | number)[];
  type?: string;
  onItemClick?: (item: Item) => void;
  onItemDelete?: (item: Item) => void;
  onDataChange?: (data: Item[]) => void;
}

const Tables: React.FC<Props> = ({
  data,
  headers,
  totals,
  type,
  onItemClick,
  onItemDelete,
  onDataChange,
}) => {
  const [tableData, setTableData] = useState(data);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const handleInputChange = (
    rowIndex: number,
    key: string,
    value: string | number | boolean
  ) => {
    const newData = [...tableData];
    //@ts-ignore
    newData[rowIndex] = {
      ...newData[rowIndex],
      [key]: value,
    };
    setTableData(newData);
    onDataChange && onDataChange(newData);
  };

  const handleSelectAll = (value: boolean) => {
    const newData = tableData.map((item) => {
      const newItem = { ...item };
      for (let key in newItem) {
        if (typeof newItem[key] === "boolean") {
          //@ts-ignore
          newItem[key] = value;
        }
      }
      return newItem;
    });
    setTableData(newData);
    onDataChange && onDataChange(newData);
  };

  return (
    <>
      {data.length === 0 ? (
        <Loader />
      ) : (
        <div className="block-table-container">
          {headers && (
            <div
              className="block-table-header"
              style={{
                gridTemplateColumns: `repeat(${headers.length}, 1fr) ${
                  onItemClick || onItemDelete ? "20rem" : "0rem"
                }`,
              }}
            >
              {headers?.map((header, index) => (
                <div key={index} className="block-table-header-cell">
                  {header.value.label}
                </div>
              ))}
            
            </div>
              
          )}
          {type === "poi" && (
                <div className="block-table-header-cell">
                  <FormInput
                    style={""}
                    value={undefined}
                    onChange={(value: string, isChecked?: boolean) =>
                      handleSelectAll(isChecked || false)
                    }
                    subInput={"Выбрать все"}
                    required={false}
                    error={""}
                    type="boolean"
                    keyData={""}
                  />
                </div>
              )}
          <div
            className="block-table-body"
            style={{
              gridTemplateColumns: `repeat(${headers.length}, 1fr) ${
                onItemClick || onItemDelete ? "20rem" : "0rem"
              }`,
            }}
          >
            {tableData.map((item, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {fieldToArray(item).map((dataItem) => (
                  <div key={dataItem.key} className="block-table-row">
                    {type === "poi" ? (
                      dataItem.key === "name" ? (
                        dataItem.value
                      ) : (
                        <FormInput
                          style={""}
                          value={dataItem.value}
                          onChange={(value) =>
                            handleInputChange(rowIndex, dataItem.key, value)
                          }
                          subInput={undefined}
                          required={false}
                          type={
                            dataItem.key === "is_active"
                              ? "boolean"
                              : undefined
                          }
                          checked={dataItem.value}
                          onCheck={(value) =>
                            handleInputChange(rowIndex, dataItem.key, value)
                          }
                          error={""}
                          keyData={""}
                        />
                      )
                    ) : dataItem.key === "updated_at" ||
                      dataItem.key === "created_at" ||
                      dataItem.key === "end_time" ? (
                      (dataItem.value !== null || dataItem.value) &&
                      formatDateIntlTimeDate(dataItem.value)
                    ) : dataItem.key === "maps" ? (
                      dataItem.value !== null &&
                      dataItem.value.length !== 0 &&
                      dataItem.value[0]
                    ) : (
                      dataItem.value
                    )}
                  </div>
                ))}
                <div className="containerRowButtons">
                  {onItemClick && (
                    <img
                      className="redactButton"
                      src={icons.Pencil}
                      alt="Edit"
                      onClick={() => onItemClick && onItemClick(item)}
                    />
                  )}
                  {type === "scoring" ? (
                    item.status === "in_progress" && (
                      <img
                        className="deleteButton"
                        src={icons.TrashOne}
                        alt="delete"
                        onClick={() => onItemDelete && onItemDelete(item)}
                      />
                    )
                  ) : (
                    <img
                      className="deleteButton"
                      src={icons.TrashOne}
                      alt="delete"
                      onClick={() => onItemDelete && onItemDelete(item)}
                    />
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Tables;
