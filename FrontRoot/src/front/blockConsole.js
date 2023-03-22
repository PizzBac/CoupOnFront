import React, { useState } from 'react';
import { useStompClient } from 'react-stomp-hooks';

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
    // <div>
    //   {blockedMessages.map((msg, index) => (
    //     <button className="blockBtn" key={index} onClick={() => handleClick(msg)}>
    //       {msg}
    //     </button>
    //   ))}
    // </div>
    <>
      {blockedMessages.map((msg, index) => (
        <div className="hex btn-pass" key={index} onClick={() => handleClick(msg)}>
          <div className="hex-inner1">
            <div className="hex-inner2 basic-action pass">
              {msg}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default BlockConsole;
