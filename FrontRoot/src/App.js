import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StompSessionProvider } from "react-stomp-hooks";
import StompHookProps from "./ServerQue/StompHookProps";
import Board from "./Board/Board"
import LobbyJH2 from "./LobbyJH2"
import MainPage from "./MainPage"
import Login from "./Login"

function App() {
    const [connected, setConnected] = useState(false);

    const server = "localhost:5000"; // 로컬 호스트
    // const server = "3.36.196.244:5000"; // 현석씨 서버
    const url = `ws://${server}/ws`;

    function CheckConnect() {
        setConnected(prev => !prev)
    }

    return (
        <StompSessionProvider url={url} debug={(s) => console.log(s)}>
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<Login server={server} />} />
                    <Route exact path="/main" element={<MainPage server={server} CheckConnect={CheckConnect} />} />
                    <Route exact path="/game" element={<StompHookProps />} />
                    <Route exact path="/board" element={<Board />} />
                    <Route exact path="/lobby" element={<LobbyJH2 CheckConnect={CheckConnect} />} />
                    <Route path="*" element={<Navigate to="/" />} /> {/* * 모든 URL을 /로 이동 */}
                </Routes>
            </BrowserRouter>
        </StompSessionProvider>
    );
};

export default App;
