import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import './reset.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [animateLoginForm, setAnimateLoginForm] = useState(false);
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleNicknameChange = (event) => {
    setNickname(event.target.value);
  }

  const handleLogin = (event) => {
    event.preventDefault();
    console.log(`username: ${username}, password: ${password}`);
    setAnimateLoginForm(true);
    setTimeout(() => {
      navigate('/main');
    }, 500);
  }

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowLoginForm(true);
  //   }, 500);
  //   return () => clearTimeout(timer);
  // }, []);

  const handleShowLoginForm = () => {
    setShowLoginForm(true);
    console.log("hihi")
  }

  return (
    <>
      <div className="background">
        {showLoginForm && (
          <div className={`login-container ${animateLoginForm ? 'animate' : ''}`}>
            <form className="login-form" onSubmit={handleLogin}>
              <h2 className='title'>로그인</h2>
              <label htmlFor="notice" className='font'>아이디가 없다면 자동 회원가입 됩니다.</label>
              <div className="form-group">
                <input type="text" className="form-control" id="username" placeholder="아이디" value={username} onChange={handleUsernameChange} />
              </div>
              <div className="form-group">
                <input type="password" className="form-control" id="password" placeholder="비밀번호" value={password} onChange={handlePasswordChange} />
              </div>
              <div className="form-group">
                <input type="nickname" className="form-control" id="nickname" placeholder="사용할 일회성 닉네임" value={nickname} onChange={handleNicknameChange} />
              </div>
              <button type="submit" className="btn btn-primary">게임 하러 가기 (로그인)</button>
            </form>
          </div>
        )}
      </div>
      {!showLoginForm && (
        <button className='btn-popUp-login' onClick={handleShowLoginForm}><p>로그인 창</p><p>띄우기</p></button>
      )}
    </>
  );
}

export default Login;
