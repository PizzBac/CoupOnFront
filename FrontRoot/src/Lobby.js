import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { StompSessionProvider, useSubscription, useStompClient } from 'react-stomp-hooks'; //이게 백엔드랑 통신하는 코드

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

  let startButton = null; //참여 여러번 눌러도 오류 안 뜨게 고쳐주는 코드.
  function MoveMyRoom(row) {
    startButton = startButton || document.querySelector('button[disabled]'); //비활성화된 버튼을 찾는 코드이다.
    //전역 변수인 startButton을 사용하고, 값이 없는 경우에만 찾아서 할당합니다.
    startButton.disabled = false; //그 버튼을 찾아서 false로 만든다.(활성화 사킨다는 뜻)
    startButton.addEventListener('click', startGame); //이 코드가 없으면 startGame()이 작동을 안한다.
  }


  function startGame() { //만약 stompClient 객체가 존재할 경우, lobbyInput을 가지고 app/start로 이동
    navigate('/game');
    if (stompClient) {
      stompClient.publish({
        headers: { "lobbyName": lobbyInput },
        destination: "/app/start"
      })
    }
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
        <div>
          <span>LobbyName:</span>
          <input
            type="text"
            value={lobbyInput}
            onChange={(e) => setLobbyInput(e.target.value)}
          />
        </div>
      </div>

      <hr />

      {/* 얘네가 테이블 생성하는 코드임 */}
      <div>
        <form onSubmit={ParticipationButton}>
          <label>
            <input type="text" value={forCreateLobbyInputName} onChange={handleChange} />
          </label>
          <button type="submit">추가</button>
        </form>
        <table style={{ border: "1px solid black" }}>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>{/* 여기서 이 함수를 호출하면서 row 값을 전달 */}
                <td>{row}</td>
                <td>
                  <button onClick={() => MoveMyRoom(row)}>참여</button>
                  <button onClick={() => deleteTableRow(index)}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={startGame} disabled={true}>Start Game</button>
      </div>
    </div>
  );
};
// StompSessionProvider component takes a url prop that specifies the websocket endpoint
export default Lobby;