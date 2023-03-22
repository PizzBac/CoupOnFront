import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import {useStompClient } from 'react-stomp-hooks';

const ExampleModal = ({ showModal, closeModal, handleChoice }) => {
  const [selected, setSelected] = useState(null);

  const handleButtonClick = (option) => {
    setSelected(option);
  };

  const handleConfirm = () => {
    if (selected) {
      handleChoice(selected);
      closeModal();
    }
  };

  return (
    <Modal show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Make a choice</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {["Challenge", "Pass"].map((option) => (
          <Button
            key={option}
            variant={option === selected ? "primary" : "outline-primary"}
            className="mr-2 mb-2"
            onClick={() => handleButtonClick(option)}
          >
            {option}
          </Button>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const MyComponent = () => {
  const [body, setBody] = useState(null);
  const [showModal, setShowModal] = useState(false);


  const stompClient = useStompClient();
  const [subscription, setSubscription] = useState("/user/lobby");
  const [destination, setDestination] = useState("/app/game");
  const [lobbyName, setLobbyName] = useState("Room6");
  const [headers, setHeaders] = useState({"lobbyName":lobbyName}); //JSON stringfy 하면 안됨

  const handleChoice = (choice) => {
    setBody(choice);
  };

  const handleIncomeClick = () => {
    setBody("Income");
    console.log(subscription, destination, headers, body);
    
    stompClient.publish({ subscription, destination, headers, body });
  };

  const handleExchangeClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <button onClick={handleIncomeClick}>Income</button>
      <button onClick={handleExchangeClick}>Exchange</button>
      <ExampleModal
        showModal={showModal}
        closeModal={closeModal}
        handleChoice={handleChoice}
      />
    </div>
  );
};

export default MyComponent;
