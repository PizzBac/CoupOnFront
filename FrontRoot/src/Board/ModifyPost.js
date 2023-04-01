import React, { useState } from 'react';

function ModifyPost(props) {
    const { selectedPost, setBoardScreen, modifyPost, setModify } = props;

    const [title, setTitle] = useState(selectedPost.title);
    const [content, setContent] = useState(selectedPost.content);

    const handleSubmit = () => {
        modifyPost(selectedPost.index, title, content);
        setModify(false);
    };

    const backSubmit = () => {
        setModify(false);
    };

    return (
        <>
            <h2>글 수정</h2>
            <div>
                <input
                    type="text"
                    placeholder="제목"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    className='content'
                    placeholder="내용"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
            </div>
            <div>
                <button onClick={handleSubmit}>수정하기</button>
                <button onClick={backSubmit}>뒤로 가기</button>
            </div>
        </>
    );
}

export default ModifyPost;
