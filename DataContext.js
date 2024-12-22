// DataContext.js
import React, { createContext, useState } from "react";

export const DataContext = createContext({
  data: null,
  anotherData: null, // 新しいデータ
  setData: () => {},
  setAnotherData: () => {}, // 新しいデータの更新用
});

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [globalSharedData, setGlobalSharedData] = useState(null);

  return (
    <DataContext.Provider
      value={{ data, setData, globalSharedData, setGlobalSharedData }}
    >
      {children}
    </DataContext.Provider>
  );
};
