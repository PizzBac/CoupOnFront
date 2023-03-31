import React, {useState, useEffect} from 'react';
import './reset.css'
import './MainPage.css'
import LobbyJH2 from './LobbyJH2'
import logo1 from './front/images/coup-main.png'; // 이미지 파일 경로
import logo2 from './front/images/coup-logo-explain.png'; // 이미지 파일 경로
import Board from "./Board"

function MainPage(props) {
  const { SettingLobbyName } = props;
  const [logoIndex, setLogoIndex] = useState(0);
  const logos = [
    {src: logo1, alt: 'logo1'},
    {src: logo2, alt: 'logo2'}
  ];
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setLogoIndex(logoIndex => (logoIndex + 1) % logos.length);
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, [logos.length]);

  return (
    <div className="App">
      <header>
        <div className='welcome-container'>
          <span className="welcomeMsg">레지스탕스 쿠 게임에 오신 것을 환영합니다.</span>
        </div>
      </header>
      <div className='main-logo'>
        <img src={logos[logoIndex].src} alt={logos[logoIndex].alt} />
      </div>
      <div className="card-container">
        <section className="card">
          <Board></Board>
        </section>
        <section className="card">
          <LobbyJH2 className="Lobby-container" SettingLobbyName={SettingLobbyName}></LobbyJH2>
        </section>
      </div>
    </div>
  );
}

export default MainPage;
