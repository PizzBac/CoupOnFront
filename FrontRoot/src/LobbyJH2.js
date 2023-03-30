import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSubscription, useStompClient } from 'react-stomp-hooks'; //이게 백엔드랑 통신하는 코드

function Lobby(props) {
  const { SettingLobbyName } = props;
  const [messages, setMessages] = useState([]);
  const [lobbyInput, setLobbyInput] = useState("test");
  // const [subscription, setSubscription] = useState("/user/lobby");
  const [forCreateLobbyInputName, setForCreateLobbyInputName] = useState(''); //얘는 이름 입력하면 로비 만들기 위한 선언임
  const [tableData, setTableData] = useState([]); //얘도 마찬가지

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

  function handleChange(event) {//얘가 1이고 1~4는 이름 입력하면 그 이름을 가진 테이블을 생성하기 위한 코드
    setForCreateLobbyInputName(event.target.value);
  };

  function ParticipationButton(event) {//2
    event.preventDefault();
    if (!forCreateLobbyInputName) return; // 입력값이 없는 경우 처리
    const rowData = <tr ><td style={{ border: "1px solid black" }}>{forCreateLobbyInputName}</td></tr>;
    setTableData([...tableData, rowData]);
    setForCreateLobbyInputName("");
  }

  function deleteTableRow(index) {//4
    const newData = [...tableData];
    newData.splice(index, 1);
    setTableData(newData);
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

//   function parseLobbyInfo(messages) {
//     if (typeof messages !== 'string') {
//       console.error('Invalid messages: not a string');
//       return null;
//     }
  
//     const regex = /로비명 (.*?) 로비를 생성했다.\n로비 이름 : (.*?)\n현재 상태 : (.*?)\n현재 플레이어: \[(.*?)\]/;
//     const match = messages.match(regex);
  
//     if (!match) {
//       console.error('No lobby information found in messages');
//       return null;
//     }
  
//     const lobby = {
//       lobbyName: match[2],
//       status: match[3],
//       currentPlayer: match[4]
//     };
  
//     return lobby;
//   }
  

//   const lobbyRef = useRef([]);

  console.log(messages);

  let lobbyInfo;

  function parseLobbyInfo(messages) {
    let regex = /로비 이름 : (.*?)\n현재 상태 : (.*?)\n현재 플레이어: (\[.*?\])/;
    const match = messages.match(regex);
    console.log(match);
  
    if (match) {
      const lobbyInfo = {
        lobbyName: match[1],
        status: match[2],
        currentPlayer: match[3]
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
  
  if (messages.length > 0) {
    // messages.forEach(message => {
    lobbyInfo = parseLobbyInfo(messages[messages.length - 1]);
    //     if (lobbyInfo) {
    //         lobbyInfoRef.current.push(lobbyInfo);
    //     }
    //     });
    if (lobbyInfo) {
        lobbyInfoRef.current[lobbyInfo.lobbyName] = lobbyInfo;
      }
    }
  console.log(lobbyInfoRef);


  function seeAllUsers() {
    stompClient.publish({
      destination: '/app/users',
    });
  };

  function checkExistingLobby(lobbyName) {
    // 기존 로비 목록에서 lobbyName과 같은 이름의 로비를 찾아서 반환
    const gameLobbies = []; //초기화 하는 코드는 이런식으로 []를 쓴다.
    return gameLobbies.find(lobby => lobby.name === lobbyName) !== undefined;
  }

  function createLobby() {
    // 이미 존재하는 로비인지 확인
    const existingLobby = checkExistingLobby(lobbyInput);
    if (existingLobby) {
      // 이미 존재하는 로비가 있을 경우 처리
      alert(`"${lobbyInput}" 로비는 이미 존재합니다. 다른 이름으로 로비를 만들어주세요.`);
      return seeAllGames();
    }

    // 새로운 로비 생성
    stompClient.publish({
      headers: { lobbyName: lobbyInput },
      destination: '/app/create',
      body: '',
    });

    seeAllGames();
  };

  function seeAllGames() {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/showallgame"
      })
    }
  }

  function MoveMyRoom(lobbyName) { //참여버튼임. 기존에 방이 있을경우 입장하시겠습니까? 가 뜸.

  };

  function startGame() { //만약 stompClient 객체가 존재할 경우, lobbyInput을 가지고 app/start로 이동
    navigate('/game');
    if (stompClient) {
      stompClient.publish({
        headers: { "lobbyName": lobbyInput },
        destination: "/app/start"
      })
    }
  }

  function toBoard() {
    navigate('/board');
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
        <button className='seeAllUsers' onClick={seeAllUsers}>See all users</button>
        <button className='seeAllGames' onClick={seeAllGames}>See all games</button>
        <button className='createLobby' onClick={createLobby}>Create Lobby</button>
        <button className='startGame' onClick={startGame}>Start Game</button>
        <button className='toBoard' onClick={toBoard}>To Board</button>
        <div>
          <span>LobbyName:</span>
          <input
            type="text"
            value={lobbyInput}
            onChange={(e) => setLobbyInput(e.target.value)}
          /> <button onClick={() => MoveMyRoom()}>참여</button>
        </div>
      </div>
      <hr />
    </div>
  );
};
// StompSessionProvider component takes a url prop that specifies the websocket endpoint
export default Lobby;