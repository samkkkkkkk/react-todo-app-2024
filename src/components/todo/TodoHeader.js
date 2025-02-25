import React from 'react';
import '../../scss/TodoHeader.scss';

const TodoHeader = ({ countTodo, promote }) => {
  const today = new Date();

  const dateString = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const dayName = today.toLocaleDateString('ko-KR', {
    weekday: 'long',
  });

  const upgrade = () => {
    if (
      window.confirm(
        '프리미엄으로 업그레이드 하시겠습니까?',
      )
    ) {
      promote();
    }
  };

  // 회원 등급에 따른 조건별 렌더링
  const gradeView = () => {
    const role = localStorage.getItem('USER_ROLE');
    console.log('TodoHeader -> role: ', role);
    if (role === 'COMMON') {
      return (
        <span
          className='promote bedge bg-warning'
          onClick={upgrade}
        >
          일반회원
        </span>
      );
    } else if (role === 'PREMIUM') {
      return (
        <span className='promote bedge bg-danger'>
          프리미엄
        </span>
      );
    } else if (role === 'ADMIN') {
      return (
        <span className='promote bedge bg-info'>
          관리자
        </span>
      );
    }
  };

  return (
    <header>
      <h1>{dateString}</h1>
      <div className='day'>{dayName}</div>
      <div className='tasks-left'>
        할 일 {countTodo()}개 남음
      </div>
      {gradeView()}
    </header>
  );
};

export default TodoHeader;
