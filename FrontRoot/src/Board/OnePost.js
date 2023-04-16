import React, { useState } from 'react';
import ModifyPost from './ModifyPost';
import Reply from './Reply';
import './OnePost.css'

function OnePost(props) {
  const { selectedPost, setBoardScreen, modifyPost, deletePost, server } = props;

  const [modify, setModify] = useState(false);
  const loginUserId = sessionStorage.getItem('loginUserId');

  function writerCheck(writer) {
    return loginUserId === writer;
  }

  const modifySubmit = () => {
    setModify(true);
  };

  const deleteSubmit = () => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      deletePost(selectedPost.index);
      setBoardScreen("board");
    }
  }

  const backSubmit = () => {
    setBoardScreen("board");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  return (
    <>
      {modify ? (
        <ModifyPost
          selectedPost={selectedPost}
          setBoardScreen={setBoardScreen}
          modifyPost={modifyPost}
          setModify={setModify}
        />
      ) : (
        <div className="post-container">
          <div className="post-title">
            <h2>{selectedPost?.title}</h2>
          </div>
          <hr />
          <div>
            <div className="post-writer">
              <p>작성자: {selectedPost?.writer}</p>
            </div>
            <div className="post-readCount">
              <p>조회수: {selectedPost?.readCount}</p>
            </div>
            <div className="post-date">
              <p>작성일: {formatDate(selectedPost?.date)}</p>
            </div>
          </div>
          <hr />
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: selectedPost?.content }}
          />
          <hr />
          <div className="buttons">
            {writerCheck(selectedPost?.writer) && (
              <>
                <button onClick={modifySubmit}>글 수정하기</button>
                <button onClick={deleteSubmit}>글 삭제하기</button>
              </>
            )}
            <button onClick={backSubmit}>뒤로 가기</button>
          </div>
          <hr />
          <Reply
            server={server}
            seeOnePost={props.seeOnePost}
            postIndex={selectedPost?.index}
            selectedPost={selectedPost}
          />
        </div>
      )}
    </>
  );

}

export default OnePost;