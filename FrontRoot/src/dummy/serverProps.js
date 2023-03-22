import React from 'react';
import MyComponentWithServerProps from './MyComponent';

function OtherComponent() {
  const serverProps = {
    brokerURL: 'ws://javaspringbootcoupgamebackend-env.eba-2u3en2tr.ap-northeast-2.elasticbeanstalk.com/ws',
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    subscribePath: '/user/lobby',
    sendPath: '/app/game',
    message: {"lobbyName":"Room1", "foo": "bar", "baz": {"qux": "quux"}},
  };

  return (
    <div>
      <h1>Other Component</h1>
      <MyComponentWithServerProps {...serverProps} />
    </div>
  );
}

export default OtherComponent;
