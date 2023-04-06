import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useSubscription, useStompClient } from 'react-stomp-hooks';
import LobbyCard from "./LobbyCard"
import './Lobby.css';

function Lobby(props) {
  const [messages, setMessages] = useState([]);
  const [lobbyInput, setLobbyInput] = useState("기본방");
  const [users, setUsers] = useState({});
  const [showUsers, setShowUsers] = useState(false);

  const stompClient = useStompClient();
  const navigate = useNavigate();

  if (stompClient) {
    console.log("Lobby stompClient success");
  } else {
    console.log("Lobby stompClient is null");
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (!stompClient) {
        console.log("retry connect");
        props.CheckConnect();
      }
    }, 1000); // 연결 끊길 시 1초마다 연결 재시도

    return () => {
      clearInterval(interval);
    };
  }, [stompClient]);

  useSubscription('/user/lobby', (message) => {
    const msg = tryParseJSON(message.body);
    let usermsg = '';

    if (typeof msg === 'object') {
      usermsg = 'User Message: ' + msg.userMessage;
      usermsg += '\n' + 'Content: ' + JSON.stringify(tryParseJSON(msg.content));

      if (msg.userMessage == "게임 시작") {
        startGame(); // 게임 시작
      }
    } else {
      usermsg = msg;

      if (msg.includes("접속한 로비")) { // if user lobby info is included in the message
        console.log(msg);
        const regex = /(.+?) 접속한 로비 : (.+?)\n/g;
        let match;
        while ((match = regex.exec(msg)) !== null) {
          const username = match[1];
          console.log(username);
          const lobby = match[2] === "없음" ? "대기중" : match[2];
          setUsers(prevUsers => {
            const newUsers = { ...prevUsers };
            newUsers[username] = lobby;
            return newUsers;
          });
        }
      }
    }

    // setMessages([...messages, usermsg]);
    setMessages(prevMessages => [...prevMessages, usermsg]);

  });

  console.log(users);

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
    if (stompClient) {
      stompClient.publish({
        destination: '/app/users',
      });
      setShowUsers(true); // show user bubble
    } else {
      alert("잠시 후 다시 시도해주세요.")
    }
  };

  function closeUserBubble() {
    setShowUsers(false); // hide user bubble
  }

  function createLobby(lobbyInput) {
    if (stompClient) {
      stompClient.publish({
        headers: { lobbyName: lobbyInput },
        destination: '/app/create',
        body: '',
      });
    }

    SaveLobbyName(lobbyInput);
    // setLobbyInput(''); // LobbyInput을 초기화
    seeAllGames();
  }

  function SaveLobbyName(lobbyInput) {
    sessionStorage.setItem('lobbyName', lobbyInput);
  }

  console.log("현재 선택된 로비", lobbyInput);

  function seeAllGames() {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/showallgame"
      })
    } else {
      alert("잠시 후 다시 시도해주세요.")
    }
  }

  function startGame() {
    navigate('/game');
    if (stompClient) {
      stompClient.publish({
        headers: { lobbyName: lobbyInput },
        destination: "/app/start"
      })
    } else {
      alert("잠시 후 다시 시도해주세요.")
    }
  }

  function joinLobby(lobbyName) {
    setLobbyInput(lobbyName);
    createLobby(lobbyName);
  }

  return (
    <div className="chat-app">
      <div className="lobby-container">
      <button className='startGame' onClick={startGame}><p>로비: {lobbyInput} 의</p>게임 시작</button>

      <div className="chat-input">
        <div className="seeAllUsers-container">
          <button className='seeAllUsers' onMouseEnter={seeAllUsers} onMouseLeave={closeUserBubble}>모든 유저 보기</button>
          {showUsers && Object.keys(users).length > 0 &&
            <div className="user-bubble">
              <h4 className="user-card-title">접속중인 유저 ({Object.keys(users).length})</h4>
              <div className="user-card-container">
                {Object.entries(users).map(([username, lobby]) => (
                  <div key={username} className="user-card">
                    <div className="user-card-username">{username}</div>
                    <div className="user-card-lobby">{lobby ? `로비: ${lobby}` : "로비 없음"}</div>
                  </div>
                ))}
              </div>
            </div>
          }
        </div>
        <button className='seeAllGames' onClick={seeAllGames}>모든 게임 보기</button>
      </div>

      <div className="div-lobby-input">
        {/* <span className="lobby-input-label">만들 로비</span> */}
        <input
          type="text"
          className="lobby-input-text"
          value={lobbyInput}
          onChange={(e) => setLobbyInput(e.target.value)}
          maxLength={5} // 최대 8글자까지 입력 가능
          placeholder='최대 5글자까지 입력 가능'
        /><button className='createLobby lobby-button' onClick={() => createLobby(lobbyInput)}>방 만들기</button>
      </div>
      
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
      </div>
    </div>
  );
};

export default Lobby;