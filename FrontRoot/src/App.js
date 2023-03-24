// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StompSessionProvider } from "react-stomp-hooks";
import Lobby from "./Lobby";
import StompHookProps, {
    STOMP_HOOK_PROPS_PATH,
} from "./ServerQue/StompHookProps";

const url = "wss://coup.jestground.com/ws";

const App = () => {
    const parentFunction = (x) => {
      console.log(x);
      setLobbyName(x);
    };
    const [lobbyName, setLobbyName] = useState("");

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
