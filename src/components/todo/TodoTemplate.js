import React, { useEffect, useState } from 'react';

import '../../scss/TodoTemplate.scss';
import TodoHeader from './TodoHeader';
import TodoMain from './TodoMain';
import TodoInput from './TodoInput';
import {
  API_BASE_URL,
  TODO,
} from '../../config/host-config';

const TodoTemplate = () => {
  // 백앤드 서버에 할 일 목록(json)을 요청(fetch)해서 받아와야 함

  // todos 배열을 상태 관리
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // 페이지가 처음 렌더링 됨과 동시에 할 일 목록을 서버에 요청해서 뿌려 주겠습니다.
    fetch(`${API_BASE_URL}${TODO}`)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);

        // fetch를 통해 받은 데이터를 상태 변수에 전달
        setTodos(json.todos);
      });
  }, []);

  // TodoInput에게 todoText를 받아오는 함수
  // 자식 컴포넌트가 부모 컴포넌트에게 데이터를 전달할 때는
  // 일반적인 props사용이 불가능
  // 부모 컴포넌트에서 함수를 선언(매개변수 꼭 선언) -> props로 함수를 전달.
  // 자식 컴포넌트에서 전달받은 함수를 호출하면서 매개값으로 데이터를 전달.
  const addTodo = (todoText) => {
    const newTodo = {
      title: todoText,
    };
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
  };

  // 할 일 삭제 처리 함수
  const removeTodo = (id) => {
    fetch(`${API_BASE_URL}${TODO}/${id}`, {
      method: 'DELETE',
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
      headers: { 'content-type': 'application/json' },
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

  return (
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
};

export default TodoTemplate;
