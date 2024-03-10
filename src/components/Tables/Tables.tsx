import React from "react";
import "./styles.scss"; // Подключите свои стили здесь
import { IOptionInput } from "../../models/IOptionInput";
import { fieldToArray } from "../UI/functions/functions";

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
}

const Tables: React.FC<Props> = ({ data, headers, totals, onItemClick }) => {
  console.log("====================================");
  console.log("headers", headers);
  console.log("====================================");
  return (
    <div className="block-table-container">
      {headers && (
        <div
          className="block-table-header"
          style={{ gridTemplateColumns: `repeat(${headers.length}, 1fr)` }}
        >
          {headers.map((header, index) => (
            <div key={index} className="block-table-header-cell">
              {header.value.label}
            </div>
          ))}
        </div>
      )}
      <div
        className="block-table-body"
        style={{ gridTemplateColumns: `repeat(${headers.length}, 1fr)` }}
      >
        {data.map((item, rowIndex) => {
          return fieldToArray(item).map((dataItem) => {
            return (
              <div
                key={dataItem.key}
                className="block-table-row"
                // onClick={() => onItemClick(item)}
              >
                {dataItem.value}
              </div>
            );
          });
        })}
      </div>
    </div>
  );
};

export default Tables;
