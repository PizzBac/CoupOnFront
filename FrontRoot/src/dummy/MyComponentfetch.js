import { useState, useEffect } from 'react';

function MyComponent() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('ws://javaspringbootcoupgamebackend-env.eba-2u3en2tr.ap-northeast-2.elasticbeanstalk.com/ws/app/game', {
      method : "POST",          //메소드 지정
      headers : {               //데이터 타입 지정
        "Content-Type":"application/json; charset=utf-8",
        "lobbyName":"Room1"
        },
      body: JSON.stringify(data)   //실제 데이터 파싱하여 body에 저장
    }).then(res=>res.json())    // 리턴값이 있으면 리턴값에 맞는 req 지정
    .then(res => {console.log(res)})  // 리턴값에 대한 처리
  }, []);
  
  return (
    <div>
      {data.map(item => <div key={item.id}>{item.name}</div>)}
      <p>hihi</p>
    </div>
  );
}

export default MyComponent;
