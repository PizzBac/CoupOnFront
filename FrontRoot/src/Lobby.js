import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { STOMP_HOOK_PROPS_PATH } from "./ServerQue/StompHookProps";
import {
  StompSessionProvider,
  useSubscription,
  useStompClient,
} from 'react-stomp-hooks';
const url = 'ws://javaspringbootcoupgamebackend-env.eba-2u3en2tr.ap-northeast-2.elasticbeanstalk.com/ws'

function Lobby(){
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [lobbyInput, setLobbyInput] = useState("test");
  const [destination, setDestination] = useState("/app/create");
  // const [subscription, setSubscription] = useState("/user/lobby");

  const stompClient = useStompClient();

  const navigate = useNavigate();
  const location= useLocation();

  useEffect(
    () => {
    if (stompClient) {
      console.log("sucess");
    } else {
      console.log("stompClient is null");
    }
  }, [stompClient]);

  function handleCheck(event) {
    event.preventDefault();

    if (stompClient) {
      console.log("sucess");
    } else {
      console.log("stompClient is null");
    }
  }

  useSubscription('/user/lobby', (message) => {
    const msg = tryParseJSON(message.body);
    let usermsg = '';

    if (typeof msg === 'object') {
      usermsg = 'User Message: ' + msg.userMessage;
      usermsg += '\n' + 'Content: ' + JSON.stringify(tryParseJSON(msg.content));
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

  function sendMessage(){
    if (input) {
      // send method takes a destination path, an optional body and an optional headers object
      stompClient.publish({
        destination: '/app/game',
        headers: { lobbyName: lobbyInput },
        body: input,
      });
      setInput('');
    }
  };

  function createLobby(){
     const Id='hsjm0893';
     const Name='김종진';
     location.href = `http://localhost:3000/game?id=${Id}name=${Name}`;
      stompClient.publish({
      destination: '/app/create',
      headers: { lobbyName: lobbyInput },
      body: '1234',
    });
  };

  function startGame(){
    stompClient.publish({
      destination: '/app/start',
      headers: { lobbyName: lobbyInput },
    });
    navigate('/game', { state: { destination: '/app/game', headers:{lobbyName: lobbyInput}}});
  };

  function seeAllUsers(){
    stompClient.publish({
      destination: '/app/users',
    });
  };

  return (
    <div className="chat-app">
      <h1>Coup Online 백엔드 테스트</h1>
      <h3>URL : {url}</h3>
      <ul className="chat-log">
        {messages.map((message, index) => (
          <li key={index}>
            <pre>{message}</pre>
          </li>
        ))}
      </ul>
      <div>
        <button type='button' onClick={handleCheck}>서버 연결 체크하기</button>
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className='sendMessgae' onClick={sendMessage}>Send</button>
        <button className='createLobby' onClick={createLobby}>Create Lobby</button>
        <button className='startGame'  onClick={startGame}>Start Game</button>
        <button className='seeAllUsers' onClick={seeAllUsers}>See all users</button>
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
