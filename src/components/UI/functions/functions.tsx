const getFormatedDate = (date: string): string => {
  let formated = "";
  const get_date = new Date(date);
  const day = ("00" + get_date.getDate()).slice(-2);
  const month = ("00" + (get_date.getMonth() + 1)).slice(-2);
  const year = get_date.getFullYear();
  formated = `${day}.${month}.${year}`;
  return formated;
};

const getHtmlFormatDate = (date: string): string => {
  let formated = "";
  const get_date = new Date(date);
  const day = ("00" + get_date.getDate()).slice(-2);
  const month = ("00" + (get_date.getMonth() + 1)).slice(-2);
  const year = get_date.getFullYear();
  formated = `${year}-${month}-${day}`;
  return formated;
};

const getDateTime = (date: string): string => {
  const get_date = new Date(date);
  const day = ("00" + get_date.getDate()).slice(-2);
  const month = ("00" + (get_date.getMonth() + 1)).slice(-2);
  const year = get_date.getFullYear();
  const hours = ("00" + get_date.getHours()).slice(-2);
  const minutes = ("00" + get_date.getMinutes()).slice(-2);
  const dateStr = `${day}.${month}.${year} ${hours}:${minutes}`;
  return dateStr;
};

function fieldToArray(
  fields: Record<string, any>
): { key: string; value: any }[] {
  if (!fields) {
    return [];
  }

  const fieldEntries = Object.entries(fields);

  if (fieldEntries.length === 0) {
    return [];
  }

  const resultArray = fieldEntries.map(([key, value]) => ({ key, value }));
  return resultArray;
}

export default function formatBytes(
  bytes: number,
  decimals: number = 2
): string {
  if (bytes === 0) {
    return "0";
  } else {
    var k = 1024;
    var dm = decimals < 0 ? 0 : decimals;
    var sizes = ["байт", "КБ", "МБ", "ГБ", "ТБ"];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
}

const transformDate = (inputDate: string): string => {
  const parts = inputDate.split(".");

  if (parts.length === 3) {
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];

    return `${year}-${month}-${day}`;
  } else {
    return "Invalid Date";
  }
};

// Получение значения куки по имени
function getCookie(name: string): string | null {
  const cookieName = `${name}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return null;
}

// Проверка на массив массивов
function hasNestedArray(arr: any[]): boolean {
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      return true; // Если элемент массив, вернуть true
    }
  }
  return false; // Если ни один элемент не является массивом, вернуть false
}

function hasDoubleNestedArray(arr: any[]): boolean {
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      for (let j = 0; j < arr[i].length; j++) {
        if (Array.isArray(arr[i][j])) {
          return true; // Если найден двойной вложенный массив, вернуть true
        }
      }
    }
  }
  return false; // Если двойной вложенный массив не найден, вернуть false
}

export {
  getFormatedDate,
  getDateTime,
  fieldToArray,
  transformDate,
  getHtmlFormatDate,
  getCookie,
  hasNestedArray,
  hasDoubleNestedArray,
};
