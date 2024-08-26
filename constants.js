export const DB_NAME = "Bajja_DB";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENVIRONMENT !== "development",
};

export const USER_ROLES_ENUM = {
  BUYER: "buyer",
  SELLER: "seller",
};

export const AVAILABLE_USER_ROLES = Object.values(USER_ROLES_ENUM);
