import React, { useState, useEffect, useRef } from 'react';
import StompHook from './StompHook';
import { useLocation } from 'react-router-dom';
import Banker from '../front/banker';
import Console from '../front/console';
import Player from '../front/player';
import BlockConsole from '../front/blockConsole';

import './StompHookProps.css';

function StompHookProps() {

  // const location = useLocation();

  // const { destination, headers } = location.state;
  // const lobbyName = headers.lobbyName;
  const [destination, setDestination] = useState("/app/create");
  const [lobbyName, setLobbyName] = useState("test3");
  const [headers, setHeaders] = useState({lobbyName: lobbyName});
  const subscription = "/user/lobby";
  const body = "Income";
  const [receivedMessage, setReceivedMessage] = useState("");
  const messageListRef = useRef([]);
  
  let msg;

  const handleReceivedMessage = (message) => {
    msg = message;
    setReceivedMessage(message);
    messageListRef.current = [...messageListRef.current, receivedMessage, msg];
  };

  console.log(messageListRef);
  console.log(messageListRef.current);

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
  if (latestuserChoiceMessages) {
    console.log(JSON.parse(latestuserChoiceMessages).content);
    blockedMessages = JSON.parse(latestuserChoiceMessages).content.filter(message => message.substring(0, 5) === "Block");
  } else {
    console.log("아직 고를 수 있는게 없습니다.")
  }
  console.log(blockedMessages);

  let wasteUsersName = "";
  let wasteUsersCard = "";
  if (latestLogMessage) {
    let tmpmsg = JSON.parse(latestLogMessage).userMessage;
    if (tmpmsg.split(' ')[2] === "버림") {
      console.log("카드를 버림.");
      wasteUsersName = tmpmsg.split(' ')[0].substring(0, tmpmsg.split(' ')[0].length-1);
      wasteUsersCard = tmpmsg.split(' ')[1].substring(0, tmpmsg.split(' ')[1].length-1);
    }
    // console.log(JSON.parse(latestLogMessage).userMessage);
  }

  
  return ( 
    <div>
        <StompHook
          subscription={subscription}
          destination={destination}
          headers={headers}
          body={body}
          onReceivedMessage={handleReceivedMessage}
          lobbyName={lobbyName}
        />
        <div className="BankerConsole">
          <Banker receivedMessage={receivedMessage} />
          <Console destination={destination} lobbyName={lobbyName} body={body} />
          {blockedMessages &&
            <BlockConsole lobbyName={lobbyName} blockedMessages={blockedMessages}/>
          }
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
          <Player localPlayerCards={JSON.parse(latestUpdateMessage).content.localPlayerCards} 
                  lobbyName={lobbyName} 
                  name={obj.name}
                  coins={obj.coins}
                  userName={JSON.parse(latestUpdateMessage).content.userName}
                  players={JSON.parse(latestUpdateMessage).content.players}
                  wasteUsersName={wasteUsersName}
                  wasteUsersCard={wasteUsersCard}
          />)}
        </div>
        
        }
    </div>
  );
}

export default StompHookProps;
