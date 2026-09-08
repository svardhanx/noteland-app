import { API_BASE_URL } from "./constants";

export const apiEndPoints = Object.freeze({
  ME: `${API_BASE_URL}/auth/me`,
  GET_USER: `${API_BASE_URL}/auth/user`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  GET_USER_NOTES: `${API_BASE_URL}/notes/`,
  CREATE_NOTE: `${API_BASE_URL}/notes/`,
  UPDATE_NOTE: `${API_BASE_URL}/notes/`,
  DELETE_NOTE: `${API_BASE_URL}/notes/`,
  CREATE_TASK: `${API_BASE_URL}/notes/`,
  UPDATE_TASK: `${API_BASE_URL}/notes/`,
});
