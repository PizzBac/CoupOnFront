// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StompSessionProvider } from 'react-stomp-hooks';
import Lobby from './Lobby';
import StompHookProps, { STOMP_HOOK_PROPS_PATH } from './ServerQue/StompHookProps';

const url = 'ws://javaspringbootcoupgamebackend-env.eba-2u3en2tr.ap-northeast-2.elasticbeanstalk.com/ws'

const App = () => {
  return (
    <StompSessionProvider
    url={url}
    debug={(s) => console.log(s)}
    >
      <BrowserRouter>
        <Routes>
          {/* <Route exact path="/" element={<Lobby/>} /> */}
          <Route exact path='/game' element={<StompHookProps/>} />
        </Routes>
      </BrowserRouter>
    </StompSessionProvider>
  );
};

export default App;