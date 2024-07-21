const userData = JSON.parse(localStorage.getItem("account") || '{}')

export const isAdmin = userData.role === "admin";
export const isManager = userData.role === "manager";