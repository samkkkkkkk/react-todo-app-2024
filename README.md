리액트 프로젝트 시작하기
node.js 설치 (LTS 버전으로)

create-react-app 설치 (최초 1번)

$ npm install -g create-react-app
react 프로젝트 생성
$ npx create-react-app 프로젝트이름
react 프로젝트 실행
$ cd 프로젝트폴더
$ npm start
http://localhost:3000 에서 프론트엔드 서버 실행.
git clone 시 주의사항
$ npm install
명령을 터미널에서 실행하여 라이브러리 설치

5. 추가 라이브러리

```
$ npm install react-icons // 아이콘
$ npm install classnames // 클래스 add/remove 편리한거
$ npm install sass // scss 문법 사용
$ npm install reactstrap bootstrap
$ npm install @mui/material @emotion/react @emotion/styled
$ npm install @mui/icons-material
$ npm install react-router-dom
$ npm install axios // 비동기 통신 라이브러리 (fetch보다 더 많은 기능을 제공)
```

## 리액트 라우터 설정

index.js에 BrowserRouter 컴포넌트로 App 감싸기.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<BrowserRouter>
<App />
</BrowserRouter>
);
