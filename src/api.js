import ky from "ky";

let getAccessToken = () => Promise.resolve('');

export function setAccessTokenGetter(getter) {
  getAccessToken = getter;
}

function waitForAccessToken(resolve, reject) {
  setTimeout(() => {
    getAccessToken()
        .then(token => {
          if (token) {
            resolve(token);
          } else {
            waitForAccessToken(resolve, reject);
          }
        })
        .catch(reason => reject(reason));
  }, 100);
}

function getAccessTokenWithWait() {
  return new Promise((resolve, reject) => waitForAccessToken(resolve, reject));
}

export const api = ky.create({
  prefixUrl: 'http://localhost:8080/api',
  retry: 0,
  hooks: {
    beforeRequest: [
        async request => {
          let token = await getAccessToken();

          if (token === '') {
            token = await getAccessTokenWithWait();
          }

          request.headers.set('Authorization', `Bearer ${token}`);
        },
    ],
  },
});
