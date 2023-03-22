import React, { useState } from 'react';
import { useStompClient } from 'react-stomp-hooks';
import './blockConsole.css';

function BlockConsole({ lobbyName, body, blockedMessages }) {

  const stompClient = useStompClient();
  const [subscription, setSubscription] = useState("/user/lobby");

  const publishMessage = (body) => {
    stompClient.publish({ subscription, destination: '/app/game', headers: { lobbyName: lobbyName }, body });
  };

  const handleClick = (msg) => {
    console.log(msg);
    publishMessage(msg);

  };

  return (
    <>
    {blockedMessages.map((msg, index) => {
      let btnMsg = '';
      if (msg === 'Block (Ambassador)') {
        btnMsg = '블록(외교관)';
      } else if (msg === 'Block (Captain)') {
        btnMsg = '블록(사령관)';
      }
      return (
        <div className="hex btn-block" key={index} onClick={() => handleClick(msg)}>
          <div className="hex-inner1">
            <div className="hex-inner2 basic-action block">
              <p>{btnMsg}</p>
            </div>
          </div>
        </div>
      );
    })}
  </>
  );
}

export default BlockConsole;
