import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import './WritePost.css'

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
    <div className="container">
      <h2>새 글쓰기</h2>
      <form onSubmit={handleSubmit}>
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
            
          <label htmlFor="writer" className="col-sm-2 col-form-label">글쓴이</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="writer"
              placeholder="글쓴이"
              value={writer}
              onChange={(e) => setWriter(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="content" className="col-sm-2 col-form-label">내용</label>
          <div className="col-sm-10">
            <textarea
              className="form-control"
              id="content"
              placeholder="내용"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="form-group row">
          <div className="col-sm-12">
            <button type="submit" className="btn btn-primary">글쓰기</button>
            <button type="button" className="btn btn-secondary" onClick={backSubmit}>뒤로 가기</button>
          </div>
        </div>
      </form>
    </div>
  </>
);

      

}

export default WritePost;
