import React, { useState } from "react";
import './CreateRoom.css';

function CreateRoom() {
  const [value, setValue] = useState('');
  const [tableData, setTableData] = useState([]);

  function handleChange(event) {
    setValue(event.target.value);
  };

  function handleSubmit(event) {
    event.preventDefault();
    if (!value) return; // 입력값이 없는 경우 처리
    const rowData = <tr ><td style={{ border: "1px solid black" }}>{value}</td></tr>;
    setTableData([...tableData, rowData]);
    setValue("");
  }

  function handleDelete(rowDataToDelete){
    const newData = tableData.filter(rowData => rowData !== rowDataToDelete);
    setTableData(newData);
  }

  function deleteTableRow(index) {
    const newData = [...tableData];
    newData.splice(index, 1);
    setTableData(newData);
  }
  

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <input type="text" value={value} onChange={handleChange} />
        </label>
        <button type="submit">추가</button>
      </form>
      <table style={{ border: "1px solid black" }}>
        <tbody>
          {tableData.map((row, index) => (
  <tr key={index}>
    <td>{row}</td>
    <td>
      <button onClick={() => deleteTableRow(index)}>삭제</button>
    </td>
  </tr>
))}

        </tbody>
      </table>
    </div>
  );
}

export default CreateRoom;
