import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import './reset.css';

function Login(props) {
  const url = `http://${props.server}`;
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [animateLoginForm, setAnimateLoginForm] = useState(false);
  const [loginstatus, setLoginstatus] = useState(0);
  const navigate = useNavigate();

  const handleIdChange = (event) => {
    setId(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleNicknameChange = (event) => {
    setNickname(event.target.value);
  }

  const handleShowLoginForm = () => {
    setShowLoginForm(true);
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
    if (id === '' || password === '') {
      alert("아이디와 비밀번호를 입력해주세요.");
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
        name: "blank"
      })
    };

    fetch(`${url}${endpoint}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        setLoginstatus(data);

        if (data === 1 && endpoint === '/login') {
          sessionStorage.setItem('loginUserId', id);
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
      setLoginstatus("");
    } else if (loginstatus === -4) {
      alert("이미 존재하는 아이디입니다.");
      setId("");
      setPassword("");
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
                <h2 className='title'>로그인 / 회원가입</h2>
                <label htmlFor="notice" className='font'>아직 아이디가 없으시다면 사용할 아이디와 비밀번호를 입력해주세요</label>
                <div className="form-group">
                  <input type="email" className="form-control" id="id" placeholder="아이디" value={id} onChange={handleIdChange} required />
                </div>
                <div className="form-group">
                  <input type="password" className="form-control" id="password" placeholder="비밀번호" value={password} onChange={handlePasswordChange} />
                </div>
                {/* <div className="form-group">
                  <input type="nickname" className="form-control" id="nickname" placeholder="사용할 일회성 닉네임" value={nickname} onChange={handleNicknameChange} />
                </div> */}
                <button type="button" className="btn btn-primary" onClick={handleLogin}>게임 하러 가기 (로그인)</button>
                <button type="button" className="btn btn-secondary" onClick={handleSignUp}>회원가입</button>
              </form>
            </div>
          </>
        )}
      </div>
      {!showLoginForm && (
        <button className='btn-popUp-login' onClick={handleShowLoginForm}><p>로그인 창</p><p>띄우기</p></button>
      )}
    </>
  );
}

export default Login;
