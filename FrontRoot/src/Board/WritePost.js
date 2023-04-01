import React, { useState } from 'react';

function WritePost(props) {
    const { writeNewPost, setBoardScreen } = props;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [writer, setWriter] = useState('');

    const handleSubmit = () => {
        if (!title || !content || !writer) {
            alert('모든 내용을 입력해주세요.');
            return;
        }

        writeNewPost(title, content, writer);
        setTitle('');
        setContent('');
        setWriter('');
    };

    const backSubmit = () => {
        setBoardScreen("board");
    };

    return (
        <>
            <h2>새 글쓰기</h2>
            <div>
                <input
                    // className='title'
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
                <input
                    className='writer'
                    type="text"
                    placeholder="글쓴이"
                    value={writer}
                    onChange={(e) => setWriter(e.target.value)}
                />
            </div>
            <div>
                <button onClick={handleSubmit}>글쓰기</button>
                <button onClick={backSubmit}>뒤로 가기</button>
            </div>

        </>
    );
}

export default WritePost;
