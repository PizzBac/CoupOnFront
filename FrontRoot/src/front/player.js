import React, { useState, useEffect } from 'react';
import { useStompClient } from 'react-stomp-hooks';

import './player.css';

function Player(props) {
  const { localPlayerCards, name, coins, cardNumbers, userName, players, wasteUsersName, wasteUsersCard } = props;
  let card0 = localPlayerCards[0];
  let card1 = localPlayerCards[1];
  let card3 = "back";
  let card4 = "back";
  

  let remainedCardNumber;

  if (wasteUsersName && wasteUsersCard) {
    for (let i=0; i<players.length; i++) {
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
  const [body, setBody] = useState("");
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
    <div>
      {owner && (
    <div className="player">
      <button className='player_font' onClick={handleButtonClick}>{name}</button>
      <div>
      {card0 &&
        <img src={require(""+`./images/${card0}.png`)} alt={card0} className="img cardImg" onClick={handleCard0Click}/>
      }
      {card1 &&
        <img src={require(""+`./images/${card1}.png`)} alt={card0} className="img cardImg" onClick={handleCard1Click}/>
      }
      </div>
      <div>
        <div className='coin img'></div><span className='player_font'>{coins}</span>
      </div>
    </div>
    )}
    {!owner &&(
      <div className="player">
      <button className='player_font' onClick={handleButtonClick}>{name}</button>
      <div>
        <img src={require(""+`./images/${card3}.png`)} alt={card0} className="img cardImg"/>
        <img src={require(""+`./images/${card4}.png`)} alt={card0} className="img cardImg"/>
      </div>
      <div>
        <div className='coin img'></div><span className='player_font'>{coins}</span>
      </div>
    </div>
    )}
    </div>
  );
}

export default Player;
