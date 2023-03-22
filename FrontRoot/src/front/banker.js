import React, { useState, useEffect } from 'react';
import './banker.css';

function Banker(props) {
  const { receivedMessage } = props;
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (typeof receivedMessage === 'string' && receivedMessage.trim().startsWith('{') && receivedMessage.trim().endsWith('}')) {
      console.log('JSON형태입니다.');
      const message = JSON.parse(receivedMessage);
    } else if (receivedMessage.length === 0){
      setMessage("서버로부터 도착한 메세지가 없습니다.");
    } else {
      console.log('JSON형태가 아닙니다.');
    }
  }, [receivedMessage]);

  return (
    <div className="banker">
      <p className="announcement anc-message">
        {receivedMessage ? receivedMessage : message}
      </p>
    </div>
  );
}

export default Banker;
