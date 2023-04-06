//StompHookProps.js
import React, { useState, useRef, useEffect } from 'react';
import { useSubscription } from 'react-stomp-hooks';
import ScrollToBottom from 'react-scroll-to-bottom';
import Banker from '../front/banker';
import Console from '../front/console';
import Player from '../front/player';
import Chat from '../front/Chat';
import './StompHookProps.css';
import '../reset.css';

// import { saveAs } from 'file-saver';
// const logFilePath = 'serverRecievedMsg.txt';
// const log = (msgList) => {
//   const now = new Date();
//   const timestamp = now.toLocaleString();
//   const logMessage = msgList.map((msg, index) => `[${index}] ${msg}`).join('\n');
//   const blob = new Blob([logMessage], { type: 'text/plain;charset=utf-8' });
//   saveAs(blob, logFilePath);
//   console.info(`${timestamp}:\n${logMessage}`);
// };

function StompHookProps(props) {
  const [destination, setDestination] = useState("/app/game");
  const [lobbyName, setLobbyName] = useState(LoadLobbyName());

  function LoadLobbyName() {
    const lobbyName = sessionStorage.getItem('lobbyName');
    return lobbyName ? lobbyName : "로비명 없음";
  }

  const [receivedMessage, setReceivedMessage] = useState("");
  const messageListRef = useRef([]); // 축적

  // useEffect(() => {
  //   log(messageListRef.current);
  // }, []);


  useSubscription("/user/lobby", (str) => {
    handleReceivedMessage(str.body);
  });

  function handleReceivedMessage(message) {
    setReceivedMessage(message);
    messageListRef.current = [...messageListRef.current, message];
  };

  console.log(messageListRef);

  const updateMessages = messageListRef.current.filter((msg) => {
    // {로 시작하고 }로 끝나는 문자열 중에서 type이 UPDATE인 것만 필터링
    if (msg.startsWith("{") && msg.endsWith("}") && msg.length > 100) {
      const parsedMsg = JSON.parse(msg);
      return parsedMsg.type === "UPDATE";
    } else {
      return false;
    }
  });

  const chosenMessages = messageListRef.current.filter((msg) => {
    // {로 시작하고 }로 끝나는 문자열 중에서 type이 UPDATE인 것만 필터링
    if (msg.startsWith("{") && msg.endsWith("}") && msg.length < 100) {
      const parsedMsg = JSON.parse(msg);
      return parsedMsg.type === "UPDATE";
    } else {
      return false;
    }
  });

  const logMessages = messageListRef.current.filter((msg) => {
    if (msg.startsWith("{") && msg.endsWith("}")) {
      const parsedMsg = JSON.parse(msg);
      return parsedMsg.type === "LOG";
    } else {
      return false;
    }
  });

  const userChoiceMessages = messageListRef.current.filter((msg) => {
    if (msg.startsWith("{") && msg.endsWith("}")) {
      const parsedMsg = JSON.parse(msg);
      return parsedMsg.type === "CHOICE";
    } else {
      return false;
    }
  });

  const userMessages = messageListRef.current.filter((msg) => {
    if (msg.startsWith("{") && msg.endsWith("}")) {
      const parsedMsg = JSON.parse(msg);
      console.log(parsedMsg);
      return parsedMsg.userMessage
    } else {
      return false;
    }
  });
  console.log(userMessages);

  let latestUpdateMessage = [...updateMessages].pop();
  let latestChosenUpdateMessage = [...chosenMessages].pop();
  let latestLogMessage = [...logMessages].pop();
  let latestuserChoiceMessages = [...userChoiceMessages].pop();

  console.log(latestLogMessage);

  if (latestUpdateMessage) {
    console.log(JSON.parse(latestUpdateMessage).content.players);
  } else {
    console.log("아직 유저 정보가 없습니다.");
  }
  // let aa = "yCXVg가 Contessa를 버림";

  let blockedMessages = null;
  let exchangedCardOptions = null;

  console.log("latestuserChoiceMessages: " + latestuserChoiceMessages);

  if (latestuserChoiceMessages) {
    if (JSON.parse(latestuserChoiceMessages).userMessage.substring(0, 12) === "버릴 카드를 선택하세요") {
      exchangedCardOptions = JSON.parse(latestuserChoiceMessages).content
    }
    blockedMessages = JSON.parse(latestuserChoiceMessages).content.filter(message => message.substring(0, 5) === "Block");
  } else {
    console.log("아직 고를 수 있는게 없습니다.")
  }
  console.log(exchangedCardOptions);

  let wasteUsersName = "";
  let wasteUsersCard = "";
  if (latestLogMessage) {
    let tmpmsg = JSON.parse(latestLogMessage).userMessage;
    if (tmpmsg.split(' ')[2] === "버림") {
      console.log("카드를 버림.");
      wasteUsersName = tmpmsg.split(' ')[0].substring(0, tmpmsg.split(' ')[0].length - 1);
      wasteUsersCard = tmpmsg.split(' ')[1].substring(0, tmpmsg.split(' ')[1].length - 1);
    }
  }

  return (
    <div className='gameDiv'>

      <div className='topDiv'>

      </div>

      <div className="bankerDiv">
        <Banker receivedMessage={receivedMessage} />
      </div>

      <div className='bottomDiv'>

        <div className='logAndChatDiv'>
          <ScrollToBottom className='logDiv'>
            <ul>
              {logMessages.map((obj, index) => <li>{JSON.parse(obj).userMessage}</li>)}
            </ul>
          </ScrollToBottom>
          <Chat lobbyName={lobbyName} />
        </div>

        <div className='consoleAndPlayerDiv'>
          <Console destination={destination} lobbyName={lobbyName} blockedMessages={blockedMessages} />
          {latestUpdateMessage &&
            <div className="playerDiv">
              {JSON.parse(latestUpdateMessage).content.players.map((obj, index) =>
                <Player
                  className={`player${index + 1} ${index < 3 ? 'top' : 'bottom'}`}
                  localPlayerCards={JSON.parse(latestUpdateMessage).content.localPlayerCards}
                  lobbyName={lobbyName}
                  name={obj.name}
                  coins={obj.coins}
                  userName={JSON.parse(latestUpdateMessage).content.userName}
                  players={JSON.parse(latestUpdateMessage).content.players}
                  cardNumbers={obj.cardNumbers}
                  wasteUsersName={wasteUsersName}
                  wasteUsersCard={wasteUsersCard}
                  exchangedCardOptions={exchangedCardOptions}
                />
              )}
            </div>
          }
        </div>

      </div>

    </div>
  );
}

export default StompHookProps;
