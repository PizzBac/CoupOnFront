import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import './reset.css';

function Login(props) {
  const url = `http://${props.server}`;
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [animateLoginForm, setAnimateLoginForm] = useState(false);
  const [loginstatus, setLoginstatus] = useState(0);
  const navigate = useNavigate();

  const handleIdChange = (event) => {
    setId(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  }

  const handleNicknameChange = (event) => {
    setNickname(event.target.value);
  }

  const handleShowLoginForm = () => {
    setShowLoginForm(true);
  }

  const handleShowSignUpForm = () => {
    setShowLoginForm(false);
    setShowSignUpForm(true);
  }

  const handleBackToLoginForm = () => {
    setShowLoginForm(true);
    setShowSignUpForm(false);
    setId("");
    setPassword("");
    setConfirmPassword("");
    setNickname("");
  }

  const handleLogin = (event) => {
    event.preventDefault();
    console.log(`id: ${id}, password: ${password}`);
    // setAnimateLoginForm(true);
    if (id === '' || password === '') {
      alert("아이디와 비밀번호를 입력해주세요.");
    } else {
      serverAccess('/login', id, password);
    }
  }

  const handleSignUp = (event) => {
    event.preventDefault();
    if (id === '' || password === '' || confirmPassword === '' || nickname === '') {
      alert("모든 정보를 입력해주세요.");
    } else if (password !== confirmPassword) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
    } else {
      const result = window.confirm("이 정보로 회원가입 하시겠습니까?");
      if (result) {
        serverAccess('/signUp', id, password);
      }
    }
  }

  function serverAccess(endpoint, id, password) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: id,
        password: password,
        nickname: endpoint === '/signUp' ? nickname : '',
      })
    };

    fetch(`${url}${endpoint}`, requestOptions)
      .then(response => response.text())
      .then(data => {
        const dataArray = data.split(',');
        const loginStatus = parseInt(dataArray[0]);

        setLoginstatus(loginStatus);

        if (loginStatus === 1 && endpoint === '/login') {
          sessionStorage.setItem('loginUserId', dataArray[1]);
          sessionStorage.setItem('loginUserNickname', dataArray[2]);
        }
      })
      .catch(error => console.error(error));
  }

  function loginStatusCheck(loginstatus) {
    if (loginstatus === 1) {
      setTimeout(() => {
        navigate('/main');
      }, 500);
    } else if (loginstatus === -1) {
      alert("아이디가 존재하지 않습니다.\n먼저 회원가입을 해주세요.");
      setId("");
      setPassword("");
      setLoginstatus("");
    } else if (loginstatus === -2) {
      alert("비밀번호가 틀립니다.");
      setPassword("");
      setLoginstatus("");
    } else if (loginstatus === -3) {
      alert("회원가입이 성공했습니다.\n로그인을 해주세요.");
      setId("");
      setPassword("");
      setNickname("");
      setLoginstatus("");
      setShowLoginForm(true);
      setShowSignUpForm(false);
    } else if (loginstatus === -4) {
      alert("이미 존재하는 아이디입니다.");
      setId("");
      setPassword("");
      setNickname("");
      setLoginstatus("");
    }
  }

  useEffect(() => {
    loginStatusCheck(loginstatus);
  }, [loginstatus]);

  return (
    <>
      <div className="background">
        {showLoginForm && (
          <>
            <div className={`login-container ${animateLoginForm ? 'animate' : ''}`}>
              <form className="login-form">
                <h2 className='title'>로그인</h2>
                <label htmlFor="notice" className='font'>아직 아이디가 없다면 먼저 회원가입을 해주세요.</label>
                <div className="form-group">
                  <input type="email" className="form-control" id="id" placeholder="아이디" value={id} onChange={handleIdChange} required />
                </div>
                <div className="form-group">
                  <input type="password" className="form-control" id="password" placeholder="비밀번호" value={password} onChange={handlePasswordChange} />
                </div>
                <button type="button" className="btn btn-primary" onClick={handleLogin}>게임하러 가기</button>
                <button type="button" className="btn btn-secondary" onClick={handleShowSignUpForm}>회원가입하러 가기</button>
              </form>
            </div>
          </>
        )}
        {showSignUpForm && (
          <div className="signup-container">
            <form className="signup-form">
              <h2 className="title">회원가입</h2>
              <div className="form-group">
                <input type="email" className="form-control" id="id" placeholder="아이디" value={id} onChange={handleIdChange} required />
              </div>
              <div className="form-group">
                <input type="password" className="form-control" id="password" placeholder="비밀번호" value={password} onChange={handlePasswordChange} />
              </div>
              <div className="form-group">
                <input type="password" className="form-control" id="confirmPassword" placeholder="비밀번호 확인" value={confirmPassword} onChange={handleConfirmPasswordChange} />
              </div>
              <div className="form-group">
                <input type="text" className="form-control" id="nickname" placeholder="닉네임" value={nickname} onChange={handleNicknameChange} />
              </div>
              <button type="button" className="btn btn-primary" onClick={handleSignUp}>가입하기</button>
              <button type="button" className="btn btn-secondary" onClick={handleBackToLoginForm}>뒤로가기</button>
            </form>
          </div>
        )}
      </div>

      {!showLoginForm & !showSignUpForm && (
        <button className='btn-popUp-login' onClick={handleShowLoginForm}><p>로그인 창</p><p>띄우기</p></button>
      )}
    </>
  );
}

export default Login;
