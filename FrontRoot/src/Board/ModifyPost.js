import React, { useState } from 'react';

function ModifyPost(props) {
    const { selectedPost, setBoardScreen, modifyPost, setModify } = props;

    const [title, setTitle] = useState(selectedPost.title);
    const [content, setContent] = useState(selectedPost.content);

    const handleSubmit = () => {
        if (!title || !content) {
            alert('모든 내용을 입력해주세요.');
            return;
        }

        modifyPost(selectedPost.index, title, content);
        setModify(false);
    };

    const backSubmit = () => {
        setModify(false);
    };

    return (
        <div className="container">
            <h2>글 수정하기</h2>
            <form>
                <div className="form-group row">
                    <label htmlFor="title" className="col-sm-2 col-form-label">제목</label>
                    <div className="col-sm-10">
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            placeholder="제목"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-group row">
                    <label htmlFor="content" className="col-sm-2 col-form-label">내용</label>
                    <div className="col-sm-10">
                        <textarea
                            className='form-control write-text'
                            id="content"
                            placeholder="내용"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col-sm-12">
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>수정하기</button>
                        <button type="button" className="btn btn-secondary" onClick={backSubmit}>뒤로 가기</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default ModifyPost;
