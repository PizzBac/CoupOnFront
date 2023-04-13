// player.js
import React, { useState, useEffect, useRef } from 'react';
import { useStompClient } from 'react-stomp-hooks';
import './player.css';

function Player(props) {
  const { className, localPlayerCards, localPlayerlostCards, name, coins, cardNumbers, userName, players, wasteUsersName, wasteUsersCard, exchangedCardOptions } = props;

  let card0 = localPlayerCards[0];
  let card1 = localPlayerCards[1];
  let card3 = "back";
  let card4 = "back";

//   if (localPlayerCards.length == 2 ) {
//     let card0 = localPlayerCards[0];
//     let card1 = localPlayerCards[1];
//   } else if (localPlayerCards.length == 1 && localPlayerlostCards.length == 1) {
//     let card0 = localPlayerCards[0];
//     let card1 = localPlayerlostCards[0];
    
//     card3 = localPlayerlostCards[0]
//   } else if (localPlayerCards.length == 0 && localPlayerlostCards.length == 2) {
//     let card0 = localPlayerlostCards[0];
//     let card1 = localPlayerlostCards[1];

//     card3 = localPlayerlostCards[0]
//     card4 = localPlayerlostCards[1]
//   }

const updatedPlayers = players.map((player) => {
    if (player.name === userName){
        console.log(userName);
        return {
            ...player,
            localPlayerCards: localPlayerCards,
            localPlayerlostCards: localPlayerlostCards,
          };  
    }
      return {
        ...player,
        localPlayerCards: ["back", "back"],
        localPlayerlostCards: localPlayerlostCards,
      };

  });

    console.log(updatedPlayers);

  const stompClient = useStompClient();
  const [subscription, setSubscription] = useState("/user/lobby");
  const lobbyName = props.lobbyName;
  let owner = false;

  const publishMessage = (body) => {
    stompClient.publish({ subscription, destination: '/app/game', headers: { lobbyName: lobbyName }, body });
  };

  const handleButtonClick = () => {
    publishMessage(name);
  };
  const handleCard0Click = () => {
    publishMessage(card0);
  };
  const handleCard1Click = () => {
    publishMessage(card1);
  };
  const handleCard2Click = () => {
    publishMessage(exchangedCardOptions[2]);
  };
  const handleCard3Click = () => {
    publishMessage(exchangedCardOptions[3]);
  };

  if (name === userName) {
    owner = true;
  } else {
    owner = false;
  }

  return (
    <>
      {owner && (
        <div className={`player ${className}`}>
          <button className='player_font' onClick={handleButtonClick}>{name}(나)</button>
          <div>
            {card0 &&
              <img src={require("" + `./images/${card0}.png`)} alt={card0} className="img cardImg" onClick={handleCard0Click} />
            }
            {card1 &&
              <img src={require("" + `./images/${card1}.png`)} alt={card1} className="img cardImg" onClick={handleCard1Click} />
            }
            {exchangedCardOptions && (
              <>
                {exchangedCardOptions.length === 3 &&
                  <img src={require("" + `./images/${exchangedCardOptions[2]}.png`)} className="img cardImg" onClick={handleCard2Click} />
                }
                {exchangedCardOptions.length === 4 &&
                  <>
                    <img src={require("" + `./images/${exchangedCardOptions[2]}.png`)} className="img cardImg" onClick={handleCard2Click} />
                    <img src={require("" + `./images/${exchangedCardOptions[3]}.png`)} className="img cardImg" onClick={handleCard3Click} />
                  </>
                }
              </>
            )}
          </div>
          <div className='coin_container'>
            <div className='coin img'></div><span className='coin_font'>{coins}</span>
          </div>
        </div>
      )}
      {!owner && (
        <div className={`player ${className}`}>
          <button className='player_font' onClick={handleButtonClick}>{name}</button>
            <div>
            {localPlayerlostCards[0] &&
              <img src={require("" + `./images/${localPlayerlostCards[0]}.png`)} className="img cardImg" />
            }
            {!localPlayerlostCards[0] &&
              <img src={require("" + `./images/${card3}.png`)} className="img cardImg" />
            }
            {localPlayerlostCards[1] &&
              <img src={require("" + `./images/${localPlayerlostCards[1]}.png`)} className="img cardImg" />
            }
            {!localPlayerlostCards[1] &&
              <img src={require("" + `./images/${card4}.png`)} className="img cardImg" />
            }
            </div>
          <div className='coin_container'>
            <div className='coin img'></div><span className='coin_font'>{coins}</span>
          </div>
        </div>
      )}
    </>
  );
}

export default Player;