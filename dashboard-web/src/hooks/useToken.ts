export interface Token
{
  get: () => string
  set: (token: string) => void
}

const accessTokenKey = 'accessToken';

export const useToken = (): Token => {
  return {
    get: () => {
      const token = localStorage.getItem(accessTokenKey)
      if (!token)
        throw new Error('No access token in local storage');
      return token;
    },
    set: (token: string) => localStorage.setItem(accessTokenKey, token)
  }
}
