import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

function CustomModal(props) {
  const [selectedChoice, setSelectedChoice] = useState("");

  const handleButtonClick = (choice) => {
    setSelectedChoice(choice);
  };

  const handleSubmit = () => {
    props.onSelectChoice(selectedChoice);
    setSelectedChoice("");
    props.onClose();
  };

  return (
    <Modal show={props.show} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Make a choice</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{props.receivedMessage.userMessage}</p>
        <div>
          {props.receivedMessage.content.map((choice) => (
            <Button key={choice} variant="primary" onClick={() => handleButtonClick(choice)}>
              {choice}
            </Button>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CustomModal;
