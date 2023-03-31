import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSubscription, useStompClient } from 'react-stomp-hooks'; //이게 백엔드랑 통신하는 코드
import LobbyCard from "./LobbyCard"
import './Lobby.css';


function Lobby(props) {
  const { SettingLobbyName } = props;
  const [messages, setMessages] = useState([]);
  const [lobbyInput, setLobbyInput] = useState("Default");

  const stompClient = useStompClient();
  const navigate = useNavigate();

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

  // 마지막으로, setMessages 함수는 이전 메시지 배열(messages)과 새로운 메시지(usermsg)를 결합하여 메시지 배열을 업데이트합니다. 이 배열은 화면에 표시되는 채팅 창에 표시됩니다.
  useSubscription('/user/lobby', (message) => { // '/user/lobby' 채널에서 메세지를 수신하고 해당 메세지를 처리하는 함수
    //useSubscription은 React Hook인데, 얘가 WebSocket 연결을 생성하고 해당 연결을 통해 데이터를 수신하는데 사용
    const msg = tryParseJSON(message.body);
    let usermsg = ''; //메시지가 수신되면, tryParseJSON함수를 이용해서 JSON 문자열을 객체로 변환하려고 시도

    if (typeof msg === 'object') { //만약 변환이 성공하면 
      usermsg = 'User Message: ' + msg.userMessage; // msg 객체가 만들어진다. 얘가 바로 메세지를 확인해주는 친구이다.
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


  console.log(messages);

  let lobbyInfo;

  function parseLobbyInfo(messages) {
    let regex = /로비 이름 : (.*?)\n현재 상태 : (.*?)\n현재 플레이어: (\[(.*?)])/;
    const match = messages.match(regex);
    console.log(match);
  
    if (match) {
      const lobbyInfo = {
        lobbyName: match[1],
        status: match[2],
        currentPlayer: match[3].split(',').map(player => player.replace(/[\[\]']+/g, '').trim())
      };
      return lobbyInfo;
    } else {
      console.error('No lobby information found in messages');
      return null;
    }
  }
  const lobbyInfoRef = useRef({});

// 예시로 messages 변수를 만들어 parseLobbyInfo 함수를 호출합니다.
// const aa = "로비명 test44 로비를 생성했다.\n로비 이름 : test44\n현재 상태 : OPEN\n현재 플레이어: [MU1F2]\n";
  
  let currentMsg = [];
  if (messages.length > 0) {
    if (messages[messages.length - 1].includes('\n\n')) {
      currentMsg = messages[messages.length - 1].split('\n\n').map(msg => msg.trim());
    } else {
      currentMsg = [messages[messages.length - 1]];
    }
  }
  if (currentMsg.length > 0) {
    currentMsg.forEach((msg) => {
      const lobbyInfo = parseLobbyInfo(msg);
      if (lobbyInfo) {
          lobbyInfoRef.current[lobbyInfo.lobbyName] = lobbyInfo;
      }
    })
  };
  //   currenMsg.forEach((msg) => {
    //     const lobbyInfo = parseLobbyInfo(msg);
    //     if (lobbyInfo) {
      //       lobbyInfoRef.current[lobbyInfo.lobbyName] = lobbyInfo;
      //     }
      //   })
      // };
      // lobbyInfo = parseLobbyInfo(messages[messages.length - 1]);
      // if (lobbyInfo) {
        //     lobbyInfoRef.current[lobbyInfo.lobbyName] = lobbyInfo;
        //   }
        // }
  console.log(currentMsg);
  console.log(lobbyInfoRef);


  function seeAllUsers() {
    stompClient.publish({
      destination: '/app/users',
    });
  };

  function createLobby(lobbyInput) {
    // 새로운 로비 생성
    stompClient.publish({
      headers: { lobbyName: lobbyInput },
      destination: '/app/create',
      body: '',
    });
    // setLobbyInput(''); // LobbyInput을 초기화
    seeAllGames();
  }

  console.log("현재 선택된 로비", lobbyInput);

  function seeAllGames() {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/showallgame"
      })
    }
  }

  function startGame() { //만약 stompClient 객체가 존재할 경우, lobbyInput을 가지고 app/start로 이동
    navigate('/game');
    if (stompClient) {
      stompClient.publish({
        headers: { lobbyName: lobbyInput },
        destination: "/app/start"
      })
    }
  }

  function joinLobby(lobbyName) {
    setLobbyInput(lobbyName);
    createLobby(lobbyName);
  }

  function toBoard() {
    navigate('/board');
  }

  return (
    <div className="chat-app">
      {/* <h1>Coup Online 로비</h1>
      <ul className="chat-log">
        {messages.map((message, index) => (
          <li key={index}>
            <pre>{message}</pre>
          </li>
        ))}
      </ul> */}
      {/* <div>
        <button type='button' onClick={handleCheck}>서버 연결 체크하기(콘솔 창 통해 확인)</button>
      </div> */}
      {/* <div className="lobby-container"> */}
      <button className='startGame' onClick={startGame}>게임 시작</button>
        <div className="chat-input">
          <button className='seeAllUsers' onClick={seeAllUsers}>See all users</button>
          <button className='seeAllGames' onClick={seeAllGames}>See all games</button>
          <button className='toBoard' onClick={toBoard}>To Board</button>
        </div>
        <div className="div-lobby-input">
        <span className="lobby-input-label">생성할 로비이름:</span>
          <input
            type="text"
            className="lobby-input-text"
            value={lobbyInput}
            onChange={(e) => setLobbyInput(e.target.value)}
          /><button className='createLobby lobby-button' onClick={() => createLobby(lobbyInput)}>로비 만들기</button>
        </div>
        <hr />
        <div className="lobby-cards">
          {Object.keys(lobbyInfoRef.current).map((name, index) => (
                <LobbyCard
                key={index}
                lobbyInfoRef={lobbyInfoRef}
                lobbyName={name}
                onJoinLobby={() => joinLobby(name)}
              />
          ))}
        </div>
      {/* </div> */}
    </div>
  );
};
// StompSessionProvider component takes a url prop that specifies the websocket endpoint
export default Lobby;