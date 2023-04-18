import React, { useState, useEffect } from "react";
import './Reply.css';

function Reply(props) {

    const url = `http://${props.server}`;
    const [replyContent, setReplyContent] = useState("");
    const [replyWriter, setReplyWriter] = useState(LoadLoginUserId());
    const [editing, setEditing] = useState("default");
    const [editReplyContent, setEditReplyContent] = useState("");

    function LoadLoginUserId() {
        const loginUserId = sessionStorage.getItem('loginUserId');
        return loginUserId ? loginUserId : "아이디 없음";
    }

    const [showMoreOptions, setShowMoreOptions] = useState([]);

    const toggleMoreOptions = (index) => {
        const newShowMoreOptions = [...showMoreOptions];
        newShowMoreOptions[index] = !newShowMoreOptions[index];
        setShowMoreOptions(newShowMoreOptions);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}\n${hours}:${minutes}`;
    };

    function writeReply(e) {
        e.preventDefault();
        if (!replyContent) {
            alert('댓글 내용을 입력해주세요.');
            return;
        }

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: replyContent,
                writer: replyWriter,
            }),
        };

        setReplyContent('');

        fetch(`${url}/board/reply/${props.postIndex}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                props.seeOnePost(props.postIndex);
            })
            .catch(error => console.error(error));
    };

    function writerCheck(writer) {
        return replyWriter === writer || replyWriter === "GM";
    }

    function handleEditClick(index, content) {
        setEditing(index);
        setEditReplyContent(content);
    };

    function editReply(e, idx, writer) {
        e.preventDefault();
        if (!editReplyContent) {
            alert('댓글 내용을 입력해주세요.');
            return;
        }

        setShowMoreOptions([]);

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
            })
            .catch(error => console.error(error));
    };

    function handleCancelClick() {
        setEditing("default");
        setEditReplyContent("");
    };

    function deleteReply(e, idx, writer) {
        e.preventDefault();
        setShowMoreOptions([]);
        if (window.confirm("정말로 삭제하시겠습니까?")) {
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
        }
    };

    function reportReply() {
        alert("신고되었습니다.");
        setShowMoreOptions([]);
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (e.target.className !== "toggle-button" && e.target.className !== "more-options-button") {
                setShowMoreOptions([]);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div className="reply-container">
            <form className='writeReplyForm' onSubmit={writeReply}>
                <div className='replyContent'>
                    <textarea
                        className='replyContentTextarea'
                        type="text"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder='댓글을 입력하세요.'
                    />
                </div>
                <button className='replyBtn'>댓글 쓰기</button>
            </form>


            <table className="comment-table">
                <tbody>
                    {props.selectedPost.comments?.map((comment, index) => (
                        <tr key={index}>
                            <td className="column-writer">
                                {comment.writer}
                                <br />
                                <br />
                                <div className="date-div">
                                    {formatDate(comment.date)}
                                </div>
                            </td>
                            <td className="column-content">
                                {editing === index ? (
                                    <>
                                        <form onSubmit={(e) => editReply(e, comment.idx, comment.writer)}>
                                            <input
                                                type="text"
                                                value={editReplyContent}
                                                onChange={(e) => setEditReplyContent(e.target.value)}
                                            />
                                            <button type="submit">확인</button>
                                            <button onClick={handleCancelClick}>취소</button>
                                        </form>
                                    </>
                                ) : (
                                    <>{comment.content}</>
                                )}
                            </td>
                            <td className="column-actions">
                                {replyWriter !== "아이디 없음" && (
                                    <div className="comment-actions">
                                        <button className="toggle-button" onClick={() => toggleMoreOptions(index)}>
                                            &#8942;
                                        </button>
                                        {showMoreOptions[index] && (
                                            <div className="more-options">
                                                {writerCheck(comment.writer) ? (
                                                    <>
                                                        <button onClick={() => handleEditClick(index, comment.content)}>
                                                            수정
                                                        </button>
                                                        <button onClick={(e) => deleteReply(e, comment.idx, comment.writer)}>
                                                            삭제
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button onClick={reportReply}>
                                                        신고
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Reply;