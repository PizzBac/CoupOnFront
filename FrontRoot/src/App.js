import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StompSessionProvider } from "react-stomp-hooks";
import Lobby from "./Lobby";
import StompHookProps from "./ServerQue/StompHookProps";
import TestBoard from "./dummy/TestBoard"

// const url = "wss://coup.jestground.com/ws"; // 현오씨 서버
// const url = "ws://3.36.196.244:5000/ws"; // 현석씨 서버
// const url = "ws://localhost:5000/ws"; // 로컬호스트
// const url = "http://3.36.196.244:5000/board";
// const url = "http://localhost:5000/board";

function App() {
    const [lobbyName, setLobbyName] = useState("");

    let url = "ws://localhost:5000/ws";

    function SettingLobbyName(x) {
        setLobbyName(x);
    };

    function SettingUrl(x) {
        url = x;
        console.log("url 변경" + url)
    }

    return (
        <StompSessionProvider url={url} debug={(s) => console.log(s)}>
            <BrowserRouter>
                <Routes>
                    <Route
                        exact path="/"
                        element={
                            <Lobby
                                SettingLobbyName={SettingLobbyName}
                                SettingUrl={SettingUrl}
                            />
                        }
                    />
                    <Route exact path="/game" element={<StompHookProps lobbyName={lobbyName} />} />
                    <Route exact path="/board" element={<TestBoard />} />
                </Routes>
            </BrowserRouter>
        </StompSessionProvider>
    );
};

export default App;
