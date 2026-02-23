import { VITE_BACKEND_URL } from "./constants";

export const apiEndPoints = Object.freeze({
  ME: `${VITE_BACKEND_URL}/auth/me`,
  GET_USER: `${VITE_BACKEND_URL}/auth/get-user`,
  GET_USER_NOTES: `${VITE_BACKEND_URL}/notes/get-user-notes`,
  LOGIN: `${VITE_BACKEND_URL}/auth/login`,
  REGISTER: `${VITE_BACKEND_URL}/auth/register`,
  CREATE_NOTE: `${VITE_BACKEND_URL}/notes/create-note`,
  UPDATE_NOTE: `${VITE_BACKEND_URL}/notes/update-note`,
  DELETE_NOTE: `${VITE_BACKEND_URL}/notes/delete-note`,
});
