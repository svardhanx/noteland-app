import { VITE_BACKEND_URL } from "./constants";

export const apiEndPoints = Object.freeze({
  ME: `${VITE_BACKEND_URL}/auth/me`,
  GET_USER: `${VITE_BACKEND_URL}/auth/user`,
  LOGIN: `${VITE_BACKEND_URL}/auth/login`,
  LOGOUT: `${VITE_BACKEND_URL}/auth/logout`,
  REGISTER: `${VITE_BACKEND_URL}/auth/register`,
  GET_USER_NOTES: `${VITE_BACKEND_URL}/notes/`,
  CREATE_NOTE: `${VITE_BACKEND_URL}/notes/`,
  UPDATE_NOTE: `${VITE_BACKEND_URL}/notes/`,
  DELETE_NOTE: `${VITE_BACKEND_URL}/notes/`,
  CREATE_TASK: `${VITE_BACKEND_URL}/notes/`,
  UPDATE_TASK: `${VITE_BACKEND_URL}/notes/`,
});
