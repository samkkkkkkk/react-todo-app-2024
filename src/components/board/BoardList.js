import React from 'react';
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

const BoardList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  console.log('searchParams in BoardList: ', searchParams);
  const page = searchParams.get('page') || 1;
  const size = searchParams.get('size') || 10;

  console.log('page: ', page);
  console.log('size: ', size);

  const pageParam = createSearchParams({
    page,
    size,
  }).toString();

  const goToDetail = (id) => {
    navigate({
      pathname: `/board/detail/${id}`,
      search: pageParam,
    });
  };

  return (
    <div style={{ marginTop: '300px' }}>
      <h2>Board List</h2>
      {/* 반복문을 이용한 게시판 렌더링... */}
      <button onClick={() => goToDetail(33)}>
        게시물 33번으로 가기!
      </button>
    </div>
  );
};

export default BoardList;
