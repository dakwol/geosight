import React from "react";
import "./styles.scss"; // Подключите свои стили здесь
import { IOptionInput } from "../../models/IOptionInput";
import {
  fieldToArray,
  formatDateIntlDate,
  formatDateIntlTimeDate,
} from "../UI/functions/functions";
import Loader from "../Loader/Loader";
import icons from "../../assets/icons/icons";

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
  onItemClick?: (item: Item) => void;
  onItemDelete?: (item: Item) => void;
}

const Tables: React.FC<Props> = ({
  data,
  headers,
  totals,
  onItemClick,
  onItemDelete,
}) => {
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
                  onItemClick ? "20rem" : "0rem"
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
          <div
            className="block-table-body"
            style={{
              gridTemplateColumns: `repeat(${headers.length}, 1fr) ${
                onItemClick ? "20rem" : "0rem"
              }`,
            }}
          >
            {data.map((item, rowIndex) => {
              return (
                <>
                  {fieldToArray(item).map((dataItem) => (
                    <div key={dataItem.key} className="block-table-row">
                      {dataItem.key === "updated_at"
                        ? formatDateIntlTimeDate(dataItem.value)
                        : dataItem.value}
                    </div>
                  ))}
                  <div className="containerRowButtons">
                    <img
                      className="redactButton"
                      src={icons.Pencil}
                      alt="Edit"
                      onClick={() => onItemClick && onItemClick(item)}
                    />
                    <img
                      className="deleteButton"
                      src={icons.TrashOne}
                      alt="delete"
                      onClick={() => onItemDelete && onItemDelete(item)}
                    />
                  </div>
                </>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Tables;
