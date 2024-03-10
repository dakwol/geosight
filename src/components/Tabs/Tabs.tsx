import React, { useState, FC } from "react";
import "./styles.scss";
import Buttons from "../Buttons/Buttons";
import { useDispatch, useSelector } from "react-redux";

interface TabData {
  id: number;
  text: string;
  content: React.ReactNode; // Тип React.ReactNode позволяет принимать HTML-контент
}

interface TabsProps {
  tabsData: TabData[];
  activeTabId: (id: number) => void;
}

const TabContent: FC<{ content: React.ReactNode }> = ({ content }) => {
  return <div className="infoTextContainer">{content}</div>;
};

const Tabs: FC<TabsProps> = ({ tabsData, activeTabId }) => {
  const [activeTab, setActiveTab] = useState(tabsData[0].id);
  const dispatch = useDispatch();
  const needsRerender = useSelector((state: any) => state.needsRerender);

  const handleTabClick = (id: number) => {
    setActiveTab(id);
    activeTabId(id);
  };

  return (
    <div className="tabRole">
      <div className="roleContainerButton">
        {tabsData.map((item) => (
          <Buttons
            key={item.id}
            className={`buttonRole ${item.id === activeTab ? "active" : ""}`}
            onClick={() => handleTabClick(item.id)}
            text={item.text}
          />
        ))}
      </div>
      {tabsData.map((item) => (
        <div key={item.id}>
          {item.id === activeTab && <TabContent content={item.content} />}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
