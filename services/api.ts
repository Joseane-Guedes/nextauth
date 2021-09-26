import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';


let cookies = parseCookies();

export const api = axios.create ({
    baseURL: 'http://localhost:3333',
    headers: {
        Authorization: `Bearer ${cookies['nextauth.token']}`
    }
});

api.interceptors.response.use(response => {
    return response; //success
  }, (error: AxiosError) => {
    if (error.response.status === 401) {
      if (error.response.data?.code === 'token.expired') {
        // refresh token
        cookies = parseCookies();
  
        const { 'nextauth.refreshToken': refreshToken } = cookies;
  
        api.post('/refresh', {
          refreshToken,
        }).then(response => {
          const { token } = response.data;
  
          setCookie(undefined, 'nextauth.token', token, {
            maxAge: 60 * 60 * 24 * 30, //30 days
            path: '/' //all routes can access this cookie
          });
  
          setCookie(undefined, 'nextauth.refreshToken', response.data.refreshToken, {
            maxAge: 60 * 60 * 24 * 30, //30 days
            path: '/' //all routes can access this cookie
          });
  
          api.defaults.headers['Authorization'] = `Bearer ${token}`; //updating token after login
        })
      } else {
        // logout user
      }
    }
  })