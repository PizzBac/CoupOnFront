import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import './reset.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleLogin = (event) => {
    event.preventDefault();
    console.log(`username: ${username}, password: ${password}`);
    navigate('/main');
  }

  return (
    <div className="background">
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>로그인</h2>
          <label htmlFor="notice">아이디가 없다면 자동 회원가입 됩니다.</label>
          <div className="form-group">
            {/* <label htmlFor="username">아이디</label> */}
            <input type="text" className="form-control" id="username" placeholder="아이디" value={username} onChange={handleUsernameChange} />
          </div>
          <div className="form-group">
            {/* <label htmlFor="password">비밀번호</label> */}
            <input type="password" className="form-control" id="password" placeholder="비밀번호" value={password} onChange={handlePasswordChange} />
          </div>
          <button type="submit" className="btn btn-primary">게임 하러 가기 (로그인)</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
