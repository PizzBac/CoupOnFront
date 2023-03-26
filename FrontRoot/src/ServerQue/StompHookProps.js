import React, { useState, useEffect, useRef } from 'react';
import StompHook from './StompHook';
import { useLocation } from 'react-router-dom';
import Banker from '../front/banker';
import Console from '../front/console';
import Player from '../front/player';
import ScrollToBottom from 'react-scroll-to-bottom';
import './StompHookProps.css';
import '../reset.css';
import Chat from '../front/Chat';

function StompHookProps(props) {
  const { lobbyName } = props;
  const subscription = "/user/lobby";
  const [destination, setDestination] = useState("/app/game");

  const body = "Income";
  const [receivedMessage, setReceivedMessage] = useState("");
  const messageListRef = useRef([]); // 축적.

  console.log(lobbyName);

  function handleReceivedMessage(message){
    setReceivedMessage(message);
    messageListRef.current = [...messageListRef.current, message];
  };
  
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
    // {로 시작하고 }로 끝나는 문자열 중에서 type이 UPDATE인 것만 필터링
    if (msg.startsWith("{") && msg.endsWith("}")) {
      const parsedMsg = JSON.parse(msg);
      return parsedMsg.type === "LOG";
    } else {
      return false;
    }
  });

  const userChoiceMessages = messageListRef.current.filter((msg) => {
    // {로 시작하고 }로 끝나는 문자열 중에서 type이 UPDATE인 것만 필터링
    if (msg.startsWith("{") && msg.endsWith("}")) {
      const parsedMsg = JSON.parse(msg);
      return parsedMsg.type === "CHOICE";
    } else {
      return false;
    }
  });

  const userMessages = messageListRef.current.filter((msg) => {
    // {로 시작하고 }로 끝나는 문자열 중에서 type이 UPDATE인 것만 필터링
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
    // console.log(JSON.parse(latestLogMessage).userMessage);
  }


  return (
    <div className='gameConsole'>
      <StompHook
        subscription={subscription}
        destination={destination}
        body={body}
        onReceivedMessage={handleReceivedMessage}
        onLobbyName={setLobbyName}
      />
      <div className="bankerConsole">
        <Banker receivedMessage={receivedMessage} />
        <Console destination={destination} lobbyName={lobbyName} body={body} blockedMessages={blockedMessages} />
      </div>
      <div className='logConsoleDiv'>
        <Chat lobbyName={lobbyName} />
        <ScrollToBottom className='logConsole'>
          <ul>
            {logMessages.map((obj, index) => <li>{JSON.parse(obj).userMessage}</li>)}
          </ul>
        </ScrollToBottom>
      </div>

      {latestUpdateMessage &&
        <div className="Player">
          {/* <Player localPlayerCards={JSON.parse(latestUpdateMessage).content.localPlayerCards} 
                  lobbyName={lobbyName} 
                  name={JSON.parse(latestUpdateMessage).content.userName}
                  coins={JSON.parse(latestUpdateMessage).content.coins}
          /> */}
          {/* {JSON.parse(latestUpdateMessage).content.players.map((obj, index) => <li>{obj.name} {obj.coins}</li>)} */}
          {JSON.parse(latestUpdateMessage).content.players.map((obj, index) =>
            <Player
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
            />)}
            
        </div>
      }
    </div>
  );
}

export default StompHookProps;
