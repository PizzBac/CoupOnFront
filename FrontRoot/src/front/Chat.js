import React, { useState, useEffect, useRef } from 'react';
import "./Chat.css";
// import { FaPaperPlane } from "react-icons/fa";
import { useSubscription, useStompClient } from 'react-stomp-hooks';

function Chat(props) {
    const { lobbyName } = props;
    const [message, setMessage] = useState("");
    const [chatLog, setChatLog] = useState([]);

    const stompClient = useStompClient();
    useSubscription(`/topic/chat/${lobbyName}`, (str) => {
        console.log(str.body);
        const object = JSON.parse(str.body);

        setChatLog([...chatLog, object.content]);
    });

    // 새로운 메시지가 추가될 때마다 자동으로 스크롤을 아래쪽으로 이동
    const messagesEndRef = useRef(null);
    useEffect(() => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, [chatLog]);

    function handleChangeMessage(event) {
        setMessage(event.target.value);
    };

    function handleSubmit(event) {
        event.preventDefault();
        const newMessage = { message };
        if (stompClient) {
            stompClient.publish({
                destination: `/app/chat/${lobbyName}`,
                body: JSON.stringify(newMessage.message)
            });
        } else {
            console.log("stompClient is null");
        }

        setMessage("");
    };

    return (
        <div className="chatWrapper">
            {/* 채팅 목록 */}
            <div className="chatcontainer" >
                {chatLog.map((item, index) => (
                    <div className="text" key={index + 1}>
                        <strong>{item.sender}:</strong> {item.message}
                    </div>
                ))}
                < div ref={messagesEndRef} />
                {/* ref 속성을 이용하여 messagesEndRef 변수와 div 요소를 연결 */}
            </div >
            <form onSubmit={handleSubmit}>
                <label className="messageLabel">
                    <input
                        className="messageInput"
                        type="text"
                        value={message}
                        onChange={handleChangeMessage}
                        placeholder="메시지를 입력하세요"
                    />
                    <span className="submitBtn" onClick={handleSubmit}>
                        {/* <FaPaperPlane /> */}
                    </span>
                </label>
            </form>
        </div>
    );
}

export default Chat;