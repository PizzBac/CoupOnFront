//StompHook.js
import React, { useState, useEffect } from 'react';
import { useSubscription, useStompClient } from 'react-stomp-hooks';

function StompHook(props) {
  const { onReceivedMessage, lobbyName } = props;
  const [destination, setDestination] = useState(props.destination);
  const stompClient = useStompClient();
  const [receivedMessage, setReceivedMessage] = useState("");
  const [lobbyName2, setLobbyName2] = useState(lobbyName);
  const [subscription, setSubscription] = useState("/user/lobby");
  const [headers, setHeaders] = useState({"lobbyName":lobbyName}); //JSON stringfy 하면 안됨.
  const [body, setBody] = useState("");

  useEffect(() => {
    setHeaders({ "lobbyName": lobbyName2 });
  }, [lobbyName2]);

  useSubscription(subscription, (str) => {
    onReceivedMessage(str.body);
  });

  function handleSubmit(event) {
    event.preventDefault();
    // setHeaders({"lobbyName":lobbyName2});

    if (stompClient) {
      stompClient.publish({
        destination,
        headers,
        body,
      });
      console.log(headers);
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
            value={lobbyName2}
            onChange={(e) => setLobbyName2(e.target.value)}
          />
        </div>
        <button type="submit">서버로 메세지 보내기(통신)</button>
      </form>
    </div>
  );
}

export default StompHook;
