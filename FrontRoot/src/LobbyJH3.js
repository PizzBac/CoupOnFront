import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useSubscription, useStompClient } from 'react-stomp-hooks';
import LobbyCard from "./LobbyCard"
import './Lobby.css';

function Lobby(props) {
  const { SettingLobbyName } = props;
  const [messages, setMessages] = useState([]);
  const [lobbyInput, setLobbyInput] = useState("Default");

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
    }

    // setMessages([...messages, usermsg]);
    setMessages(prevMessages => [...prevMessages, usermsg]);
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

  // function parseLobbyInfo(messages) {
  //   let regex = /로비 이름 : (.*?)\n현재 상태 : (.*?)\n현재 플레이어: (\[(.*?)])/;
  //   const match = messages.match(regex);
  //   console.log(match);

  //   if (match) {
  //     const lobbyInfo = {
  //       lobbyName: match[1],
  //       status: match[2],
  //       currentPlayer: match[3].split(',').map(player => player.replace(/[\[\]']+/g, '').trim())
  //     };
  //     return lobbyInfo;
  //   } else {
  //     console.error('No lobby information found in messages');
  //     return null;
  //   }
  // }

  function parseLobbyInfo(message) {
    const match = message.match(/로비 이름 : (.*?)\n현재 상태 : (.*?)\n현재 플레이어: (\[(.*?)])/);
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



  // let currentMsg = [];
  // if (messages.length > 0) {
  //   if (messages[messages.length - 1].includes('\n\n')) {
  //     currentMsg = messages[messages.length - 1].split('\n\n').map(msg => msg.trim());
  //   } else {
  //     currentMsg = [messages[messages.length - 1]];
  //   }
  // }
  // if (currentMsg.length > 0) {
  //   currentMsg.forEach((msg) => {
  //     const lobbyInfo = parseLobbyInfo(msg);
  //     if (lobbyInfo) {
  //       lobbyInfoRef.current[lobbyInfo.lobbyName] = lobbyInfo;
  //     }
  //   })
  // };
  useEffect(() => {
    const currentMsg = [];
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].includes('\n\n')) {
        currentMsg.push(...messages[i].split('\n\n').map(msg => msg.trim()));
      } else {
        currentMsg.push(messages[i]);
      }
    }
    currentMsg.forEach((msg) => {
      const lobbyInfo = parseLobbyInfo(msg);
      if (lobbyInfo) {
        lobbyInfoRef.current[lobbyInfo.lobbyName] = lobbyInfo;
      }
    });
  }, [messages]);
  






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
  console.log(lobbyInfoRef);


  function seeAllUsers() {
    if (!stompClient) {
      alert("잠시 후 다시 시도해주세요.")
      return;
    }
  
    try {
      stompClient.send("/app/users", {});
    } catch (error) {
      alert("서버에 요청을 보내는 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };
  

  function createLobby(lobbyInput) {
    if (!stompClient) {
      alert("잠시 후 다시 시도해주세요.")
      return;
    }
  
    try {
      stompClient.send("/app/create", { lobbyName: lobbyInput });
    } catch (error) {
      alert("서버에 요청을 보내는 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      return;
    }
  
    SettingLobbyName(lobbyInput);
    // setLobbyInput(''); // LobbyInput을 초기화
    seeAllGames();
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
    if (!stompClient) {
      alert("잠시 후 다시 시도해주세요.")
      return;
    }
  
    try {
      stompClient.send("/app/start", { lobbyName: lobbyInput });
    } catch (error) {
      alert("서버에 요청을 보내는 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      return;
    }
  
    navigate('/game');
  }
  
  function joinLobby(lobbyName) {
    setLobbyInput(lobbyName);
    createLobby(lobbyName);
    if (!stompClient) {
      alert("잠시 후 다시 시도해주세요.")
      return;
    }
  
    try {
      stompClient.send("/app/create", { lobbyName: lobbyName });
    } catch (error) {
      alert("서버에 요청을 보내는 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      return;
    }
  
    SettingLobbyName(lobbyName);
    // setLobbyInput(''); // LobbyInput을 초기화
    seeAllGames();
  }

  return (
    <div className="chat-app">
      {/* <div className="lobby-container"> */}
      <button className='startGame' onClick={startGame}><p>로비: {lobbyInput} 의</p>게임 시작</button>
      <div className="chat-input">
        <button className='seeAllUsers' onClick={seeAllUsers}>모든 유저 보기</button>
        <button className='seeAllGames' onClick={seeAllGames}>모든 게임 보기</button>
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

export default Lobby;