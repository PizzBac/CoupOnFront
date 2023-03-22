//StompHook.js
import React, { useState, useEffect } from 'react';
import { useSubscription, useStompClient } from 'react-stomp-hooks';

function StompHook(props) {
  const { onReceivedMessage, onLobbyName } = props;
  const [destination, setDestination] = useState(props.destination);
  const stompClient = useStompClient();
  const [subscription, setSubscription] = useState("/user/lobby");
  const [headers, setHeaders] = useState(""); //JSON stringfy 하면 안됨.

  useSubscription(subscription, (str) => {
    onReceivedMessage(str.body);
  });

  function handleSubmit(event) {
    event.preventDefault();

    if (stompClient) {
      stompClient.publish({
        headers: {"lobbyName": headers},
        destination: destination
      });
      onLobbyName(headers);
    } else {
      console.log("stompClient is null");
    }
  }

  return (
    <div style={{backgroundColor: "pink", paddingLeft: "300px"}}>
      <form onSubmit={handleSubmit}>
        <div>
          <span>subscription:</span>
          <input
            type="text"
            value={subscription}
            onChange={(e) => setSubscription(e.target.value)}
          />
        </div>
        <div>
          <span>destination:</span>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
        <div>
          <span>headers:</span>
          <input
            type="text"
            onChange={(e) => setHeaders(e.target.value)}
          />
        </div>
        <button type="submit">서버로 메세지 보내기(통신)</button>
      </form>
    </div>
  );
}

export default StompHook;
