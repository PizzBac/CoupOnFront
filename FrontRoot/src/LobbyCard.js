//LobbyCard.js
import React from 'react';
import './LobbyCard.css';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

function LobbyCard(props) {
  const { lobbyInfoRef, lobbyName } = props;
  const lobbyInfo = lobbyInfoRef.current[lobbyName];

  if (!lobbyInfo) {
    return null; // if no lobbyInfo is found for the given lobbyName, return null to render nothing
  }

  return (
    <div className="lobby-card-container">
      <Card className="lobby-card">
        <Card.Body>
          <Card.Title className={`card-title ${lobbyInfo.status.toLowerCase()}`}>{lobbyInfo.lobbyName}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted card-subtitle">로비상태: {lobbyInfo.status}</Card.Subtitle>
          <Card.Text className="mb-2">참가자:</Card.Text>
          <ListGroup>
            {lobbyInfo.currentPlayer.map((player, index) => (
              <ListGroup.Item key={index}>{player}</ListGroup.Item>
            ))}
          </ListGroup>
          <hr />
          <div className="button-group">
            {lobbyInfo.status === 'OPEN' ? (
              <div className="card-buttons">
                <button className="btn btn-primary btn-sm" onClick={() => props.onJoinLobby(lobbyName)}>참가</button>
                {/* <button className="btn btn-success btn-sm">게임시작</button> */}
              </div>
            ) : (
              <p>게임이 시작되었습니다.</p>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default LobbyCard;
