//LobbyInfo.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { StompSessionProvider, useSubscription, useStompClient } from 'react-stomp-hooks'; //이게 백엔드랑 통신하는 코드
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

import './LobbyInfo.css';

function LobbyInfo(props) {
    const { lobbyName, currentState, currentPlayers } = props;
    const headerClass = currentState === "OPEN" ? "card-header open" : currentState === "STARTED" ? "card-header started" : "card-header";
    const cardClass = `lobby-card${currentState === "STARTED" ? " started" : ""}`;
    const [messages, setMessages] = useState([]);
    const stompClient = useStompClient();
    const navigate = useNavigate();

    if (lobbyName) {
        console.log(lobbyName);
    }
      
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

        setMessages((prevMessages) => [...prevMessages, usermsg]);
        // setCurrentMsg(message.pop());

    }, { headers: { lobbyName: lobbyName } });

    const joinLobby = useCallback(() => {
        stompClient.publish({
            headers: { lobbyName: lobbyName },
            destination: '/app/create',
            body: '',
        });
    }, [stompClient]);

    const startGame = useCallback(() => {
        if (stompClient) {
          stompClient.publish({
            headers: { lobbyName: lobbyName },
            destination: "/app/start"
          })
          navigate('/game');
          props.SettingLobbyName(lobbyName);
        }
      }, [stompClient, lobbyName, props.SettingLobbyName]);
    

    return (
        <Card className={cardClass}>
            <Card.Header className={headerClass}>
                <h3>로비 이름: {lobbyName}</h3>
            </Card.Header>
            <Card.Body>
                <Card.Title>참가자</Card.Title>
                <ListGroup>
                    {currentPlayers &&
                        currentPlayers.map((player) => (
                            <ListGroup.Item key={player}>{player}</ListGroup.Item>
                        ))}
                </ListGroup>
                <button className="joinLobby" onClick={joinLobby}>참가하기</button>
                <button className="startGame" onClick={startGame}>게임시작</button>
            </Card.Body>
        </Card>
    );
}

export default LobbyInfo;





.lobby-card {
    margin: 10px;
    width: 300px;
    height: 200px;
    border-radius: 10px;
    font-family: 'Arial', sans-serif;
    font-size: 16px;
    font-weight: bold;
    filter: brightness(1);
  }
  
  .lobby-card.started {
    filter: brightness(0.5);
  }
  
  .card-header {
    background-color: gray;
    color: #fff;
    padding: 10px;
  }
  
  .card-header.open {
    background-color: #4cd7c1;
  }
  
  .card-header.started {
    background-color: red;
  }
  
  .card-title {
    margin-top: 10px;
  }
  
  .list-group-item {
    background-color: #f5f5f5;
  }
  
