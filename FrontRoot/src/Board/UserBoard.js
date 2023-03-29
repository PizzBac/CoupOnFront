import React, { useEffect, useState } from "react";
import './UserBoard.css';
import { StompSessionProvider,useStompClient } from 'react-stomp-hooks';
//일단 이거는 확실해

function UserBoard() {
  const stompClient = useStompClient(); //그다음에 이것도 확실해. 선언은 해야 하니까
  const [value, setValue] = useState('');
  const [tableData, setTableData] = useState([]);
  const [messages, setMessages] = useState([]);

  const url="http://3.36.196.244:5000/board";

  function handleSubmit() {
    setTableData([...tableData, { title: '제목', content: value }]);
    setValue('');
  }
  
  function handleChange(event) {
    setValue(event.target.value);
  }
  function seeAllUsers() {
    stompClient.publish({
      destination: '/app/users',
    });
  };
  return (
    <StompSessionProvider url={url}>
    <div>
      <span className="statistics">통계</span>
      <span className="Board">
        <table>
          <thead>
            <tr>
              <th>제목</th>
              <th>내용</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td>{row.title}</td>
                <td>{row.content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </span>
      <span>
        <input type="text" value={value} onChange={handleChange} />
        <button className="canWrite" onClick={handleSubmit}>글쓰기</button>
      </span>
    </div>
    </StompSessionProvider>
  );
}

export default UserBoard;