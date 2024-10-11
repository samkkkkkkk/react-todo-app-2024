// 여기서 axios 인스턴스를 생성하고,
// interceptor 기능을 활용하여, access token이 만료 되었을 때 refresh token을 사용하여
// 새로운 access token을 발급받는 비동기 방식으로 요청을 모듈화, (fetch는 interceptor 기능 x)
// axios 인스턴스는 token이 필요한 모든 요청에 활용 될 것입니다.

import axios from 'axios';
import { API_BASE_URL as BASE, USER } from './host-config';
import { useNavigate } from 'react-router-dom';

const TODO_URL = BASE;
const USER_URL = BASE + USER;

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: TODO_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
  Axios Interceptor는 요청 또는 응답이 처리되기 전에 실행되는 코드입니다.
  요청을 수정하거나, 응답에 대한 결과 처리를 수행할 수 있습니다.
*/

// Request Interceptor 설정
axiosInstance.interceptors.request.use(
  // 요청 보내기 전에 일괄 처리해야 할 내용을 함수로 선언.
  (config) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor 설정
axiosInstance.interceptors.response.use(
  (response) => response, // 응답에 문제가 없었다며 그대로 리턴
  async (error) => {
    console.log(
      'response Interceptor가 동작함! 응답 에러 발생!',
    );
    // 원본 요청의 정보를 기억을 해 놓자 -> 새 토큰 받아서 다시 보낼 꺼니까.
    const originalRequest = error.config; // config를 받아서 위에서 생성해 놓은 기본 설정을 받아온다.

    // const redirection = useNavigate();

    // 응답에 에러가 발생하면 실행할 두번째 함수.
    if (
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // _retry 사용자 정의 속성 입니다. 최초 요청에서는 조재하지 않습니다.
      // 만약 재 요청시에도 문제가 발생 했다면 (refresh 만료 등) 더 이상 똑같은 요청을 반복해서 무한 루프에 빠지지 않도록
      // 막아주는 역할을 한다.
      originalRequest._retry = true;
      console.log('응답상태 401 확인 토큰 재발급 요청!');

      // 응답상태 401 -> 토큰에 문제가 있음
      try {
        const refreshToken =
          localStorage.getItem('REFRESH_TOKEN');
        const res = await axios.post(
          `${USER_URL}/refresh`,
          { refreshToken },
        );
        // ${USER_URL}/refresh 요청이 성공 했다면 서버가 넘겨준 새로운 accessToken을 json에서 꺼내기.
        if (res.status === 200) {
          const { accessToken } = res.data; // axios는 json()함수 쓰지 않고 data로 json객체 바로 리턴
          localStorage.setItem('ACCESS_TOKEN', accessToken); // 동일한 이름으로 LocalStorage에 담자.
          // 실패한 원본 요청 정보에서 Authorization의 값을 새 토큰으로 바꿔주자.
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          // axios 인스턴스의 기본 header Authorization도 최신 토큰으로 바꿔놓자.
          axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

          // axiosInstance를 사용해서 다시 한 번 원보의 요청을 보낼 거고, 응답값을 원래 호출한 곳으로 리턴.
          return axiosInstance(originalRequest);
        }
      } catch (err) {
        // Refresh token이 만료된 경우
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('REFRESH_TOKEN');
        // redirection('/login');
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
