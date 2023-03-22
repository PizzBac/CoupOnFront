//StompHook.js
import React, { useState, useEffect } from 'react';
import { useSubscription, useStompClient } from 'react-stomp-hooks';

function StompHook(props) {
  const { onReceivedMessage, onLobbyName } = props;
  const [destination, setDestination] = useState(props.destination);
  const stompClient = useStompClient();
  const [subscription, setSubscription] = useState("/user/lobby");
  const [headers, setHeaders] = useState("default");

  useSubscription(subscription, (str) => {
    onReceivedMessage(str.body);
  });

  function seeAllUsers() {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/users"
      })
    } else {
      console.log("stompClient is null");
    }
  }

  function createLobby() {
    if (stompClient) {
      stompClient.publish({
        headers: {"lobbyName": headers},
        destination: "/app/create"
      })
    } else {
      console.log("stompClient is null");
    }
  }

  function seeAllGames() {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/showallgame"
      })
    } else {
      console.log("stompClient is null");
    }
  }

  function startGame() {
    if (stompClient) {
      stompClient.publish({
        headers: {"lobbyName": headers},
        destination: "/app/start"
      })
    } else {
      console.log("stompClient is null");
    }
  }

  return (
    <div style={{backgroundColor: "pink", paddingLeft: "300px"}}>
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
            value={headers}
            onChange={(e) => {
              setHeaders(e.target.value);
              onLobbyName(e.target.value);
              }
            }
          />
        </div>
        <button onClick={seeAllUsers}>모든 유저 보기</button>
        <button onClick={seeAllGames}>모든 방 보기</button>
        <button onClick={createLobby}>방 만들기</button>
        <button onClick={startGame}>게임 시작하기</button>
    </div>
  );
}

export default StompHook;
