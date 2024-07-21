export const isAdmin =
JSON.parse(localStorage.getItem("account") || "").role === "admin";
export const isManager =
JSON.parse(localStorage.getItem("account") || "").role === "manager";