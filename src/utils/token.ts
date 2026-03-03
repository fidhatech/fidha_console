const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken'
const USER_ACCESS_KEY = 'user'
import { type TokenType } from "../types/general.type";

export const setTokens = (tokens: TokenType) => {
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken)
};

export const getTokens = (): { accessToken: string | null, refreshToken: string | null } => {
    return {
        accessToken: getAccessToken(),
        refreshToken: getRefreshToken()
    };
};

export const getAccessToken = (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (token: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const setUser = (user: string): void => {
     localStorage.setItem(USER_ACCESS_KEY, user);
};

export const getUser = (): string | null => {
    return localStorage.getItem(USER_ACCESS_KEY);
}

export const getRefreshToken = (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
};

export const setRefreshToken = (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
};


export const removeTokens = (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
};