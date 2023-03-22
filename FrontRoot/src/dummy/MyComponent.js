import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';

function MyComponent() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://javaspringbootcoupgamebackend-env.eba-2u3en2tr.ap-northeast-2.elasticbeanstalk.com/ws',
      connectHeaders: {
        login: 'guest',
        passcode: 'guest',
      },
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    const onConnect = () => {
      console.log('connected');
      client.subscribe('/user/lobby', onMessageReceived);
      client.send('/app/create', JSON.stringify({"lobbyName":"Room1"}), {
        'content-type': 'application/json',
      });
    };

    const onMessageReceived = (message) => {
      setMessages((prevMessages) => [...prevMessages, message.body]);
      console.log("hihi");
      console.log(message.body);
    };

    client.onConnect = onConnect;
    client.activate();

    return () => {
      client.ws.onclose = () => {}; // disable onclose handler first
      client.deactivate();
      client.over();
    };
  }, []);

  return (
    <div>
      <h1>Messages가 여기에 표시됩니다.</h1>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
}

export default MyComponent;
