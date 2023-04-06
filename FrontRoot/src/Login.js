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

  const handleLogin = (event) => {
    event.preventDefault();
    console.log(`id: ${id}, password: ${password}`);
    setAnimateLoginForm(true);
    ServerAccess(id, password);
    // setTimeout(() => {
    //   navigate('/main');
    // }, 500);

    // LoginStatusCheck(loginstatus);
  }

  useEffect(() => {
    LoginStatusCheck(loginstatus);
  }, [loginstatus]);

  const handleShowLoginForm = () => {
    setShowLoginForm(true);
  }

  function ServerAccess(id, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id:id,
            password: password,
            name: "blank"
        })
    };

    fetch(`${url}/login`, requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setLoginstatus(data);
        })
        .catch(error => console.error(error));
  }

  function LoginStatusCheck(loginstatus) {
    console.log(loginstatus);
    if (loginstatus === 1) {
      console.log("ServerAccess");
      setTimeout(() => {
        navigate('/main');
      }, 500);
    } else if (loginstatus === -1) {
      const result = window.confirm("아직 회원이 아닙니다. 이 정보로 회원가입 하시겠습니까?");
      if (result) {
        ServerAccess(id, password);
        alert("회원가입되었습니다. 로그인해주세요.");
        setId(id);
        setPassword(password);
        window.location.reload();
      }
    } else if (loginstatus === -2) {
      alert("비밀번호가 틀립니다.");
      setPassword("");
      window.location.reload();
    }
  }
  


  return (
    <>
      <div className="background">
        {showLoginForm && (
          <>
          <div className={`login-container ${animateLoginForm ? 'animate' : ''}`}>
            <form className="login-form" onSubmit={handleLogin}>
              <h2 className='title'>로그인</h2>
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
              <button type="submit" className="btn btn-primary">게임 하러 가기 (로그인)</button>
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
