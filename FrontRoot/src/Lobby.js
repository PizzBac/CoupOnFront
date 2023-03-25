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

  const [value, setValue] = useState(''); //얘는 이름 입력하면 로비 만들기 위한 선언임
  const [tableData, setTableData] = useState([]); //얘도 마찬가지

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

  function handleChange(event) {//얘가 1이고 1~4는 이름 입력하면 그 이름을 가진 테이블을 생성하기 위한 코드
    setValue(event.target.value);
  };

  function handleSubmit(event) {//2
    event.preventDefault();
    if (!value) return; // 입력값이 없는 경우 처리
    const rowData = <tr ><td style={{ border: "1px solid black" }}>{value}</td></tr>;
    setTableData([...tableData, rowData]);
    setValue("");
  }

  function handleDelete(rowDataToDelete){//3
    const newData = tableData.filter(rowData => rowData !== rowDataToDelete);
    setTableData(newData);
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
  
  function MoveMyRoom(row) { //순서를 조정해야겠다. 
    const startButton = document.querySelector('button[disabled]');
    //비활성화된 버튼을 찾는 코드이다.
    startButton.disabled = false;
    //그 버튼을 찾아서 false로 만든다. (활성화 시킨다는 뜻)
    startButton.addEventListener('click', startGame); //과연 이 코드가 꼭 있어야 한다.
  }

  function startGame() { //만약 stompClient 객체가 존재할 경우, lobbyInput을 가지고 app/start로 이동
    if (stompClient) {
      stompClient.publish({
        headers: { "lobbyName": lobbyInput },
        destination: "/app/start"
      })
    }navigate('/game');
    //코드가 잘 작동되는지 확인해 보고 싶으면
    //alert를 찍어보거나 console.log를 찍어보면 된다.
    //지금도 alert 찍어보고 작동을 안 하니까 alert 작동 코드 물어봐서 해결했다.
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
        {/*<input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className='sendMessgae' onClick={sendMessage}>Send</button> */}
        <button className='seeAllUsers' onClick={seeAllUsers}>See all users</button>
        <button className='seeAllGames' onClick={seeAllGames}>See all games</button>
        <button className='createLobby' onClick={createLobby}>Create Lobby</button>
        {/* <button className='startGame' onClick={startGame}>Start Game</button> */}
        <div>
          <span>LobbyName:</span>
          <input
            type="text"
            value={lobbyInput}
            onChange={(e) => setLobbyInput(e.target.value)}
          />
        </div>
      </div>

      {/* 얘네가 테이블 생성하는 코드임 */}
      <div> 
      <form onSubmit={handleSubmit}>
  <label>
    <input type="text" value={value} onChange={handleChange} />
  </label>
  <button type="submit">추가</button>
</form>
<table style={{ border: "1px solid black" }}>
  <tbody>
    {tableData.map((row, index)=>(
      <tr key={index}>{/* 여기서 이 함수를 호출하면서 row 값을 전달 */}
        <td>{row}</td>
        <td>
          <button onClick={()=>MoveMyRoom(row)}>참여</button>
          <button onClick={()=>deleteTableRow(index)}>삭제</button>
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