import React, { useState } from 'react';
import ModifyPost from './ModifyPost';

function OnePost(props) {
    const { selectedPost, setBoardScreen, modifyPost, deletePost } = props;

    const [modify, setModify] = useState(false);

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
                <>
                    <h2>제목: {selectedPost?.title}</h2>
                    <p>내용: {selectedPost?.content}</p>
                    <p>작성자: {selectedPost?.writer}</p>
                    <p>조회수: {selectedPost?.readCount}</p>
                    <p>작성일: {selectedPost?.date}</p>
                    <p>글번호: {selectedPost?.index}</p>
                    <button onClick={modifySubmit}>글 수정하기</button>
                    <button onClick={deleteSubmit}>글 삭제하기</button>
                    <button onClick={backSubmit}>뒤로 가기</button>
                </>
            )}
        </>
    );
}

export default OnePost;