import React, { useState } from "react";
import './Reply.css';

function Reply(props) {

    const url = `http://${props.server}`;
    const [replyContent, setReplyContent] = useState("");
    const [replyWriter, setReplyWriter] = useState("");
    const [editing, setEditing] = useState("default");
    const [editReplyContent, setEditReplyContent] = useState("");
    const [editReplyWriter, setEditReplyWriter] = useState("");

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    function writeReply(e) {
        e.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: replyContent,
                writer: replyWriter,
            }),
        };

        setReplyContent('');
        setReplyWriter('');

        fetch(`${url}/board/reply/${props.postIndex}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                props.seeOnePost(props.postIndex);
            })
            .catch(error => console.error(error));
    };

    function handleEditClick(index, content) {
        setEditing(index);
        setEditReplyContent(content);
    };

    function editReply(e, idx, writer) {
        e.preventDefault();

        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idx: idx,
                content: editReplyContent,
                writer: writer,
            }),
        };

        fetch(`${url}/board/reply/${props.postIndex}`, requestOptions)
            .then(() => {
                props.seeOnePost(props.postIndex);
                setEditing("default");
                setEditReplyContent("");
                setEditReplyWriter("");
            })
            .catch(error => console.error(error));
    };

    function handleCancelClick() {
        setEditing("default");
        setEditReplyContent("");
        setEditReplyWriter("");
    };

    function deleteReply(e, idx, writer) {
        e.preventDefault();

        const requestOptions = {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idx: idx,
                writer: writer,
            }),
        };

        fetch(`${url}/board/reply/${props.postIndex}`, requestOptions)
            .then(() => {
                props.seeOnePost(props.postIndex);
            })
            .catch(error => console.error(error));
    };

    return (
        <div className="reply-container">

            <h3>댓글 작성</h3>
            <form className='writeReplyForm' onSubmit={writeReply}>
                <div>작성자: </div>
                <div className='replyWriter'>
                    <input
                        type="text"
                        value={replyWriter}
                        onChange={(e) => setReplyWriter(e.target.value)}
                    />
                </div>
                <div>내용: </div>
                <div className='replyContent'>
                    <input
                        type="text"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                    />
                </div>
                <button className='replyBtn'>댓글 작성</button>
            </form>


            <h3>댓글</h3>
            {props.selectedPost.comments?.map((comment, index) => (
                <div key={index} className="comment">
                    <div>번호: {comment.idx}</div>
                    <div className="comment-writer">작성자: {comment.writer}</div>
                    {editing === index ? (
                        <>
                            <form onSubmit={(e) => editReply(e, comment.idx, comment.writer)}>
                                <div className="comment-content">
                                    <label>내용: </label>
                                    <input
                                        type="text"
                                        value={editReplyContent}
                                        onChange={(e) => setEditReplyContent(e.target.value)}
                                    />
                                </div>
                                <button type="submit">확인</button>
                                <button onClick={handleCancelClick}>취소</button>
                            </form>
                        </>
                    ) : (
                        <>
                            <div className="comment-content">내용: {comment.content}</div>
                            <div className="comment-date">
                                작성일: {formatDate(comment.date)}
                            </div>
                            <button onClick={() => handleEditClick(index, comment.content)}>
                                수정
                            </button>
                            <button onClick={(e) => deleteReply(e, comment.idx, comment.writer)}>
                                삭제
                            </button>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Reply;