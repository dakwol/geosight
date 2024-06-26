import { useEffect, useState } from "react";

const useLocalStorage = (key: string) => {
    const [storageValue, setStorageValue] = useState(localStorage.getItem(key));
    const handleStorageChange = () => {
      setStorageValue(localStorage.getItem(key));
    };
  
    useEffect(() => {
        window.addEventListener("storage", handleStorageChange);
    
        // Для учета изменений в той же вкладке
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function (key, value) {
            //@ts-ignore
          originalSetItem.apply(this, arguments);
          handleStorageChange();
        };
    
        return () => {
          window.removeEventListener("storage", handleStorageChange);
          localStorage.setItem = originalSetItem;
        };
      }, []);
    
  
    return storageValue;
  };

export default useLocalStorage;