import React, { useState, useEffect, useRef } from 'react';
import './banker.css';

function Banker(props) {
  const { receivedMessage } = props;
  const [message, setMessage] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (typeof receivedMessage === 'string' && receivedMessage.trim().startsWith('{') && receivedMessage.trim().endsWith('}')) {
      console.log('JSON형태입니다.');
      setMessage(JSON.parse(receivedMessage));
      // const message = JSON.parse(receivedMessage);
    } else if (receivedMessage.length === 0) {
      setMessage("서버로부터 도착한 메세지가 없습니다.");
    } else {
      console.log('JSON형태가 아닙니다.');
    }

    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [receivedMessage]);

  return (
    <div className="announcement anc-message" ref={scrollRef}>
      {receivedMessage ? receivedMessage : message}
    </div>
  );
}

export default Banker;
