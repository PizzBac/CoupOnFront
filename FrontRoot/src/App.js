// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StompSessionProvider } from 'react-stomp-hooks';
import Lobby from './Lobby';
import StompHookProps, { STOMP_HOOK_PROPS_PATH } from './ServerQue/StompHookProps';

const url = 'wss://coup.jestground.com/ws'

const App = () => {
  return (
    <StompSessionProvider
    url={url}
    debug={(s) => console.log(s)}
    >
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Lobby/>} />
          <Route exact path='/game' element={<StompHookProps/>} />
        </Routes>
      </BrowserRouter>
    </StompSessionProvider>
  );
};

export default App;