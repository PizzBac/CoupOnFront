import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { StompSessionProvider, useSubscription, useStompClient } from 'react-stomp-hooks';
import { STOMP_HOOK_PROPS_PATH } from "./ServerQue/StompHookProps";

function Lobby(props) {
  const { SettingLobbyName } = props;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [lobbyInput, setLobbyInput] = useState("test");
  const [destination, setDestination] = useState("/app/create");
  // const [subscription, setSubscription] = useState("/user/lobby");

  const stompClient = useStompClient();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    SettingLobbyName(lobbyInput)
  }, [lobbyInput]);

  if (stompClient) {
    console.log("success");
  } else {
    console.log("stompClient is null");
  }

  function handleCheck(event) {
    event.preventDefault();

    if (stompClient) {
      console.log("sucess");
    } else {
      console.log("stompClient is null");
    }
  }

  // 서버에서 메시지 받아서 출력 및 게임 이동
  useSubscription('/user/lobby', (message) => {
    const msg = tryParseJSON(message.body);
    let usermsg = '';

    if (typeof msg === 'object') {
      usermsg = 'User Message: ' + msg.userMessage;
      usermsg += '\n' + 'Content: ' + JSON.stringify(tryParseJSON(msg.content));
      if (msg.userMessage == "게임 시작") {
        startGame();
      }
    } else {
      usermsg = msg;
    }

    setMessages([...messages, usermsg]);
  });

  const tryParseJSON = (jsonString) => {
    try {
      var o = JSON.parse(jsonString);

      if (o && typeof o === 'object') {
        return o;
      }
    } catch (e) {
      return jsonString;
    }
  };

  // 무슨 기능?
  function sendMessage() {
    if (input) {
      // send method takes a destination path, an optional body and an optional headers object
      stompClient.publish({
        headers: { lobbyName: lobbyInput },
        destination: '/app/game',
        body: input,
      });
      setInput('');
    }
  };

  function seeAllUsers() {
    stompClient.publish({
      destination: '/app/users',
    });
  };

  function seeAllGames() {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/showallgame"
      })
    }
  }

  function createLobby() {
    stompClient.publish({
      headers: { lobbyName: lobbyInput },
      destination: '/app/create',
      body: '',
    });
  };

  function startGame() {
    if (stompClient) {
      stompClient.publish({
        headers: { "lobbyName": lobbyInput },
        destination: "/app/start"
      })
    }
    navigate('/game');
  }

  return (
    <div className="chat-app">
      <h1>Coup Online 로비</h1>
      <ul className="chat-log">
        {messages.map((message, index) => (
          <li key={index}>
            <pre>{message}</pre>
          </li>
        ))}
      </ul>
      <div>
        <button type='button' onClick={handleCheck}>서버 연결 체크하기(콘솔 창 통해 확인)</button>
      </div>
      <div className="chat-input">
        {/* <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className='sendMessgae' onClick={sendMessage}>Send</button> */}
        <button className='seeAllUsers' onClick={seeAllUsers}>See all users</button>
        <button className='seeAllGames' onClick={seeAllGames}>See all games</button>
        <button className='createLobby' onClick={createLobby}>Create Lobby</button>
        <button className='startGame' onClick={startGame}>Start Game</button>
        <div>
          <span>LobbyName:</span>
          <input
            type="text"
            value={lobbyInput}
            onChange={(e) => setLobbyInput(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

// StompSessionProvider component takes a url prop that specifies the websocket endpoint
export default Lobby;