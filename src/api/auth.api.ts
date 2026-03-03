import api from "./axios";

export const loginApi = (loginCredentials: { email: string, password: string }) => api.post('/auth/login', loginCredentials);
export const logoutApi = () => api.delete('/auth/logout');
export const getRefreshTokenApi = (refreshToken: string) => api.post("/auth/refresh-token", { refreshToken });
export const updatePasswordApi = (email: string, newEmail:string|undefined, oldPass: string, newPass: string) => api.post("/auth/change-password",{email, newEmail, oldPass, newPass});