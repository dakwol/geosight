import React, { FC } from "react";
import "./App.scss";
import AppRouter from "./routes/AppRouter";
import "primereact/resources/themes/lara-light-cyan/theme.css";

const App: FC = () => {
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
};

export default App;
