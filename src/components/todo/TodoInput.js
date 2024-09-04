import React, { useState } from 'react';
import '../../scss/TodoInput.scss';
import { MdAdd } from 'react-icons/md';
import cn from 'classnames';

const TodoInput = ({ addTodo }) => {
  // 입력창이 열리는 여부를 표현하는 상태값
  const [open, setOpen] = useState(false);

  // 할 일 입력창에 입력한 내용을 표현하는 상태값
  const [todoText, setTodotext] = useState('');

  // 더하기 버튼 클릭시 이벤트 발생
  const onToggle = () => {
    setOpen(!open);
  };

  const todoChangeHandler = (e) => {
    setTodotext(e.target.value);
  };

  // submit 이벤트 핸들러
  const submitHandler = (e) => {
    e.preventDefault();

    addTodo(todoText);

    setTodotext('');
  };

  return (
    <>
      {open && (
        <div className='form-wrapper'>
          <form
            className='insert-form'
            onSubmit={submitHandler}
          >
            <input
              type='text'
              placeholder='할 일을 입력 후, 엔터를 누르세요!'
              onChange={todoChangeHandler}
              value={todoText}
            />
          </form>
        </div>
      )}

      {/* 
        cn() : 첫번째 파라미터는 항상 유지할 default 클래스
        두번째 파라미터는 논리 상태값
        => 논리 상태값이 true일 경우 해당 클래스 추가
          false일 경우 제거.
          {클래스이름: 논리값}, 
          클래스 이름 지정 안할 시 변수명이 클래스 이름으로 사용됨.
      */}

      <button
        // className={!open ? 'insert-btn' : 'insert-btn open'}
        className={cn('insert-btn', { open })}
        onClick={onToggle}
      >
        <MdAdd />
      </button>
    </>
  );
};

export default TodoInput;
