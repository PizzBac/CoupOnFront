// player.js
import React, { useState, useEffect, useRef } from 'react';
import { useStompClient } from 'react-stomp-hooks';
import './player.css';

function Player(props) {
  const { className, localPlayerCards, name, coins, cardNumbers, userName, players, wasteUsersName, wasteUsersCard, exchangedCardOptions } = props;

  let card0 = localPlayerCards[0];
  let card1 = localPlayerCards[1];
  let card3 = "back";
  let card4 = "back";
  // console.log(JSON.parse(players).name);
  let remainedCardNumber;

  // 중복 요소를 제거하는 함수
  const removeDuplicates = (arr) => {
    const set = new Set(arr);
    return Array.from(set);
  };

  const localPlayerCardsRef = useRef(localPlayerCards);

  useEffect(() => {
    localPlayerCardsRef.current = [...localPlayerCardsRef.current, localPlayerCards];
    // 배열에서 중복된 요소를 제거.
    localPlayerCardsRef.current = removeDuplicates(localPlayerCardsRef.current);
  }, [localPlayerCards]);

  console.log(localPlayerCardsRef);

  if (wasteUsersName && wasteUsersCard) {
    for (let i = 0; i < players.length; i++) {
      console.log(players[i].name);
      if (players[i].name === wasteUsersName) {
        remainedCardNumber = players[i].cardNumbers;
      }
    }
    console.log(remainedCardNumber);
  }

  if (remainedCardNumber === 1) {
    card3 = wasteUsersCard;
  }

  if (remainedCardNumber === 0) {
    card4 = wasteUsersCard;
  }

  const stompClient = useStompClient();
  const [subscription, setSubscription] = useState("/user/lobby");
  const lobbyName = props.lobbyName;
  let owner = false;

  const publishMessage = (body) => {
    stompClient.publish({ subscription, destination: '/app/game', headers: { lobbyName: lobbyName }, body });
  };

  const handleButtonClick = () => {
    console.log(name);
    publishMessage(name);
  };
  const handleCard0Click = () => {
    console.log(card0);
    publishMessage(card0);
  };
  const handleCard1Click = () => {
    console.log(card1);
    publishMessage(card1);
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
              <img src={require("" + `./images/${card1}.png`)} alt={card0} className="img cardImg" onClick={handleCard1Click} />
            }
            {exchangedCardOptions && (
              <>
                {exchangedCardOptions.length === 3 &&
                  <img src={require("" + `./images/${exchangedCardOptions[2]}.png`)} alt={card0} className="img cardImg" onClick={handleCard1Click} />
                }
                {exchangedCardOptions.length === 4 &&
                  <>
                    <img src={require("" + `./images/${exchangedCardOptions[2]}.png`)} alt={card0} className="img cardImg" onClick={handleCard1Click} />
                    <img src={require("" + `./images/${exchangedCardOptions[3]}.png`)} alt={card0} className="img cardImg" onClick={handleCard1Click} />
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
          {cardNumbers === 2 && (
            <div>
              <img src={require("" + `./images/${card3}.png`)} alt={card0} className="img cardImg" />
              <img src={require("" + `./images/${card4}.png`)} alt={card0} className="img cardImg" />
            </div>
          )}
          <div className='coin_container'>
            <div className='coin img'></div><span className='coin_font'>{coins}</span>
          </div>
        </div>
      )}
    </>
  );
}

export default Player;