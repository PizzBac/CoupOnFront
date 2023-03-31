import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StompSessionProvider } from "react-stomp-hooks";
import Lobby from "./Lobby";
import StompHookProps from "./ServerQue/StompHookProps";
import Board from "./Board"
import LobbyJH2 from "./LobbyJH2"

// const url = "wss://coup.jestground.com/ws"; // 현오씨 서버
const url = "ws://3.36.196.244:5000/ws"; // 현석씨 서버
// const url = "http://3.36.196.244:5000/board";
// 서버에서 돌릴 때 보드의 주소값 localhost에서 3.36.196.244로 바꿔야 합니다.

function App() {
    const [lobbyName, setLobbyName] = useState("");

    let url = "ws://localhost:5001/ws";
    // let url = "ws://3.36.196.244:5000/ws"; // 현석씨 서버

    function SettingLobbyName(x) {
        setLobbyName(x);
    };

    return (
        <StompSessionProvider url={url} debug={(s) => console.log(s)}>
            <BrowserRouter>
                <Routes>
                    <Route
                        exact path="/"
                        element={
                            <LobbyJH2
                                SettingLobbyName={SettingLobbyName}
                            />
                        }
                    />
                    <Route exact path="/game" element={<StompHookProps lobbyName={lobbyName} />} />
                    <Route exact path="/board" element={<Board />} />
                </Routes>
            </BrowserRouter>
        </StompSessionProvider>
    );
};

export default App;
