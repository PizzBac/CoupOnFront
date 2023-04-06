import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './reset.css'
import './MainPage.css'
import LobbyJH2 from './LobbyJH2'
import logo1 from './front/images/coup-main.png'; // 이미지 파일 경로
import logo2 from './front/images/coup-logo-explain.png'; // 이미지 파일 경로
import youtubeLogo from './front/images/youtube-logo.png';
import Board from "./Board/Board"
import Chat from "./front/Chat"

function MainPage(props) {
  const [logoIndex, setLogoIndex] = useState(0);
  const logos = [
    { src: logo1, alt: 'logo1' },
    { src: logo2, alt: 'logo2' }
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeMenu, setActiveMenu] = useState('board');
  const navigate = useNavigate();

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    navigate('/login');
  }
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
          {/* <div> */}
          <button onClick={handleModalOpen} className="btn-youtube"></button>
          {/* <p>게임 규칙 도움</p> */}
          {/* </div> */}
          <span className="welcomeMsg">레지스탕스 쿠 게임에 오신 것을 환영합니다.</span>
          <button className='btn-logout' onClick={handleLogout}>로그아웃</button>
        </div>
      </header>

      {isModalOpen ? (
        <>
          <div className="modal-wrapper">
            <div className="modal-contents">
              <button className="modal-close" onClick={handleModalClose}>X</button>
              <iframe className="modal-iframe" src="https://www.youtube.com/embed/97cm0gYLttg" allowFullScreen></iframe>
            </div>
          </div>
          <div className='main-logo'>
            <img className='main-logo-img' src={logos[logoIndex].src} alt={logos[logoIndex].alt} />
          </div>
        </>
      ) : (
        <div className='main-logo'>
          <img className='main-logo-img' src={logos[logoIndex].src} alt={logos[logoIndex].alt} />
        </div>
      )}



      <div className="card-container">
        <section className="card-wrap">
          <div className="menu">
            <button className={activeMenu === 'board' ? 'menu-btn active' : 'menu-btn'} onClick={() => handleMenuClick('board')}>
              게시판
            </button>
            <button className={activeMenu === 'chat' ? 'menu-btn active' : 'menu-btn'} onClick={() => handleMenuClick('chat')}>
              채팅창
            </button>
            <button className={activeMenu === 'hallOfFame' ? 'menu-btn active' : 'menu-btn'} onClick={() => handleMenuClick('hallOfFame')}>
              명예당
            </button>
          </div>
          <div className="menu-content">
          {activeMenu === 'board' ? (
            <div className='board-wrap'>
              <Board className="Board-container" server={props.server}></Board>
              </div>
          ) : null}
          {activeMenu === 'chat' ? (
            <div className='chat-wrap'>
              <Chat lobbyName={"MainPage"}/>
            </div>
          ) : null}
          {activeMenu === 'hallOfFame' ? (
              <h2>명예의 전당</h2>
          ) : null}
          </div>
        </section>
        <section className="card-wrap">
          <LobbyJH2 className="Lobby-container" CheckConnect={props.CheckConnect}></LobbyJH2>
        </section>
      </div>

    </div>
  );
}

export default MainPage;
