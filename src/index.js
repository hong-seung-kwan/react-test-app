import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';

import { createContext } from 'react';

import { Provider } from 'react-redux';
import store from './store/store';

import { login } from './store/memberSlice';

// createContext: 여러 컴포넌트에서 값을 공유할 때 사용
// 스토어, 슬라이스: 여러 컴포넌트에서 state를 공유할 때 사용

// context 생성하고 export
export const Context = createContext();

// API 주소 변경
// localhost -> aws 서버
// let host = 'http://localhost:8080';
let host = null;
if (window.location.hostname === "localhost") {
  host = 'http://localhost:8080';
} else {
  // AWS주소를 직접 사용하면 프로토콜 문제로 호출 안됨
  // 따라서 /api로 우회(프록시)할 것
  // 프록시? 가짜 요청 보내고 다시 실제 요청으로 변경
  // host = 'http://aws주소:8080' X
  // API 주소 없이 중간 경로만 있음
  // 상대 경로를 사용하면 현재 사이트 주소가 자동으로 붙음
  host = '/api';
}
console.log('현재 api주소: ', host)
// 로그인 정보 유지하기
// 브라우저를 다시 열었을 때 로컬 스토리지에 인증정보가 있는지 확인
// 인증정보가 있으면 로그인 처리
const userStr = localStorage.getItem('user');
const token = localStorage.getItem('token');
if (userStr !== null) {
  const user = JSON.parse(userStr);
  store.dispatch(login({ user: user, token: token }));
}

// 리액트 라우터를 사용하기 위해 최상위 태그를 <BrowserRouter>로 감싸야함
// 스토어를 사용할 위치에 Provider로 감싸기
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    {/* 컨텍스트를 통해 하위 컴포넌트들에게 host 데이터를 공유 */}
    <Context.Provider value={{ host }}>
      <Provider store={store}>
        <App />
      </Provider>
    </Context.Provider>
  </BrowserRouter>
);
