import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StompSessionProvider } from "react-stomp-hooks";
import StompHookProps from "./ServerQue/StompHookProps";
import Board from "./Board/Board"
import LobbyJH2 from "./LobbyJH2"
import MainPage from "./MainPage"
import Login from "./Login"

// const url = "wss://coup.jestground.com/ws"; // 현오씨 서버
// const url = "ws://3.36.196.244:5000/ws"; // 현석씨 서버
// const url = "http://3.36.196.244:5000/board";

function App() {
    const [lobbyName, setLobbyName] = useState("");
    const [connected, setConnected] = useState(false);

    const server = "localhost:5000"; // 로컬 호스트
    // const server = "3.36.196.244:5000"; // 현석씨 서버
    const url = `ws://${server}/ws`;

    function SettingLobbyName(x) {
        setLobbyName(x);
    };

    function CheckConnect() {
        setConnected(prev => !prev)
    }

    return (
        <StompSessionProvider url={url} debug={(s) => console.log(s)}>
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<LobbyJH2 SettingLobbyName={SettingLobbyName} />} />
                    <Route exact path="/game" element={<StompHookProps lobbyName={lobbyName} />} />
                    <Route exact path="/board" element={<Board />} />
                    <Route exact path="/main" element={<MainPage SettingLobbyName={SettingLobbyName} server={server} CheckConnect={CheckConnect} />} />
                    <Route exact path="/login" element={<Login />} />
                </Routes>
            </BrowserRouter>
        </StompSessionProvider>
    );
};

export default App;
