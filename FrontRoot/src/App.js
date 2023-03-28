import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StompSessionProvider } from "react-stomp-hooks";
import Lobby from "./Lobby";
import StompHookProps from "./ServerQue/StompHookProps";

const url = "wss://coup.jestground.com/ws"; // 현오씨 서버
// const url = "ws://3.36.196.244:5000/ws"; // 현석씨 서버

function App() {
    const [lobbyName, setLobbyName] = useState("");

    function SettingLobbyName(x) {
        setLobbyName(x);
    };

    useEffect(() => {
        // lobbyName이 변경될 때마다 StompHookProps를 다시 렌더링합니다.
        console.log("lobbyName has changed:", lobbyName);
    }, [lobbyName]);

    return (
        <StompSessionProvider url={url} debug={(s) => console.log(s)}>
            <BrowserRouter>
                <Routes>
                    <Route
                        exact path="/"
                        element={
                            <Lobby
                                SettingLobbyName={SettingLobbyName}
                            />
                        }
                    />
                    <Route exact path="/game" element={<StompHookProps lobbyName={lobbyName} />} />
                </Routes>
            </BrowserRouter>
        </StompSessionProvider>
    );
};

export default App;
