import React, { useEffect, useState } from 'react';

import '../../scss/TodoTemplate.scss';
import TodoHeader from './TodoHeader';
import TodoMain from './TodoMain';
import TodoInput from './TodoInput';
import {
  API_BASE_URL,
  TODO,
} from '../../config/host-config';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'reactstrap';

const TodoTemplate = () => {
  const redirection = useNavigate();

  // 백앤드 서버에 할 일 목록(json)을 요청(fetch)해서 받아와야 함

  // todos 배열을 상태 관리
  const [todos, setTodos] = useState([]);

  // 로딩 상태값 관리 (처음에는 로딩이 무조건 필요하기 때문에 true -> 로딩이 끝나면 false로 진행)
  const [loading, setLoading] = useState(true);

  // 로그인 인증 토큰 얻어오기
  const token = localStorage.getItem('ACCESS_TOKEN');

  // fetch 요청을 보낼 때 사용할 요청 해더 설정.
  const requestHeader = {
    'content-type': 'application/json',
    // JWT에 대한 인증 토큰이라는 타입을 선언.
    Authorization: 'Bearer ' + token,
  };

  // TodoInput에게 todoText를 받아오는 함수
  // 자식 컴포넌트가 부모 컴포넌트에게 데이터를 전달할 때는
  // 일반적인 props사용이 불가능
  // 부모 컴포넌트에서 함수를 선언(매개변수 꼭 선언) -> props로 함수를 전달.
  // 자식 컴포넌트에서 전달받은 함수를 호출하면서 매개값으로 데이터를 전달.
  const addTodo = async (todoText) => {
    const newTodo = {
      title: todoText,
    };

    const res = await fetch(`${API_BASE_URL}${TODO}`, {
      method: 'POST',
      headers: requestHeader,
      body: JSON.stringify(newTodo),
    });

    const json = await res.json();
    setTodos(json.todos);

    /*    
    fetch(`${API_BASE_URL}${TODO}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(newTodo),
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        // status 상태에 따라 에러 처리를 다르게 진행
        else {
          console.log('error');
        }
      })
      .then((data) => {
        setTodos(data.todos);
      });
      */
  };

  // 할 일 삭제 처리 함수
  const removeTodo = (id) => {
    fetch(`${API_BASE_URL}${TODO}/${id}`, {
      method: 'DELETE',
      headers: requestHeader,
    })
      .then((res) => res.json())
      .then((data) => setTodos(data.todos))
      .catch((err) => {
        console.log('err: ', err);
        alert('잘못된 요청입니다.');
      });
  };

  // 할 일 체크 처리 함수
  const checkTodo = (id, done) => {
    fetch(`${API_BASE_URL}${TODO}`, {
      method: 'PATCH',
      headers: requestHeader,
      body: JSON.stringify({
        id,
        done: !done,
      }),
    })
      .then((res) => res.json())
      .then((data) => setTodos(data.todos))
      .catch((err) => {
        console.log('err: ', err);
        alert('잘못된 요청입니다.');
      });
  };

  // // 체크가 안 된 할 일의 개수를 카운트 하기
  const countRestTodo = () =>
    todos.filter((todo) => !todo.done).length;

  useEffect(() => {
    // 페이지가 처음 렌더링 됨과 동시에 할 일 목록을 서버에 요청해서 뿌려 주겠습니다.
    fetch(`${API_BASE_URL}${TODO}`, {
      method: 'GET',
      headers: requestHeader,
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        else if (res.status === 403) {
          alert('로그인이 필요한 서비스 입니다!');
          redirection('/login');
        } else {
          alert('관리자에게 문의하세요!');
        }
      })
      .then((json) => {
        // fetch를 통해 받은 데이터를 상태 변수에 전달
        if (json) setTodos(json.todos);

        // 로딩 완료 처리
        setLoading(false);
      });
  }, []);

  // 로딩이 끝난 후 보여줄 컴포넌트
  const loadEndedPage = (
    <div className='TodoTemplate'>
      <TodoHeader countTodo={countRestTodo} />
      <TodoMain
        todoList={todos}
        remove={removeTodo}
        check={checkTodo}
      />
      <TodoInput addTodo={addTodo} />
    </div>
  );

  // 로딩 중일 때 보여줄 컴포넌트
  const loadingPage = (
    <div className='loading'>
      <Spinner color='danger'>loading...</Spinner>
    </div>
  );

  return <>{loading ? loadingPage : loadEndedPage}</>;
};

export default TodoTemplate;
