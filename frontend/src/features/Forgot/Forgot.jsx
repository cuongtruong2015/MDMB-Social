import LogoImg from 'assets/images/logos/logo2.jpg';
import styled from 'styled-components';
import { useNavigate } from '../../../node_modules/react-router-dom/index';
import userApi from 'apis/userApi';
import authApi from 'apis/authApi';
import Swal from 'sweetalert2';
import { useEffect, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 0;
`;
const WrapperContent = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: flex-start;
  width: 100%;
  align-items: center;
`;
const Logo = styled.img`
  cursor: pointer;
  margin: 50px 0 20px 0;
  content: url(${LogoImg});
  width: 4rem;
  padding: 0;
  height: 4rem;
  border-radius: 50%;
  transition: all 0.3s ease-in-out;
  :hover {
    transform: scale(1.1);
  }
`;
const Header = styled.div`
  font-size: 24px;
  font-weight: 300;
  letter-spacing: -0.5px;
  margin: 20px;
`;
const Box = styled.div`
  display: flex;
  flex-direction: column;
  background-color: aliceblue;
  border-radius: 10px;
  padding: 10px;
  margin: 0 16px 16px 16px;
  font-size: 14px;
  border: 1 px solid #f6f8fa;
`;
const Text = styled.div`
  text-align: left;
  margin-bottom: 10px;
  font-weight: 600;
`;
const Text2 = styled.div`
  text-align: left;
  margin-top: 10px;
  white-space: nowrap;
`;
const Text3 = styled.div`
  text-align: left;
  margin-top: 10px;
  font-weight: 600;
  white-space: nowrap;
  color: purple;
  cursor: pointer;
  &:hover {
    color: #0d6efd;
  }
`;
const EmailInput = styled.input`
  all: initial;
  background-color: #fff;
  display: block;
  margin: 20px;
  width: 90%;
  font-size: 14px;
  padding: 5px;
  border-radius: 10px;
  margin: auto;
  border: 1px solid lightblue;
  &:focus {
    box-shadow: 0px 0px 5px #c0bfbf;
  }
`;
const Button = styled.button`
  width: fit-content;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid lightblue;
  margin-right: 20px;
  margin-left: auto;
  margin-top: 10px;
`;
const WrapperSumbit = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;
const RegisterNow = styled.div`
  width: 50%;
  display: flex;
  justify-content: space-between;
`;
const Notification = styled.div`
  text-align: center;
  margin-top: 10px;
  color: red;
  white-space: nowrap;
`;
const CapchaWrapper = styled.div`
  justify-content: center;
  display: flex;
`;
export default function Forgot() {
  const navigate = useNavigate();
  const refRecapCha = useRef();
  const handleRegister = () => {
    navigate('/register');
  };
  const handleLogoClick = () => {
    navigate('/');
  };
  const [email, setEmail] = useState(
    document.getElementById('email-input')?.value.toLowerCase().trim()
  );
  const [notification, setNotification] = useState('');
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const handleCheckEmail = async () => {
    const response = refRecapCha.current.getValue();
    if (response) {
      const data = await authApi.verifyCaptcha(response);
      if (data.result === 'success') {
        const check = emailRegex.test(email);
        if (!check) setNotification('Email invalid');
        else {
          const res = await userApi.checkAccountExisted(email);
          if (!res.result) setNotification('Email not existed');
          else {
            const data = await userApi.sentEmailForgotPassword(
              email,
              res.token
            );
            if (data.result)
              Swal.fire({
                title: 'Awaiting confirmation',
                icon: 'success',
                html: `<div>Please Check your email spam folder, If you haven't received our email in 3 hours, please try again.</div>`,
                preConfirm: () => {
                  navigate(
                    '/change-password?email=fangsilver1412@gmail.com&type=pin'
                  );
                },
              });
            else Swal.fire({ title: 'Error', icon: 'error' });
          }
        }
      }
    } else setNotification('Please verify captcha');
    refRecapCha.current?.reset();
  };
  const onSubmitClick = () => {
    handleCheckEmail();
  };
  useEffect(() => {
    const Timer = setTimeout(() => {
      setNotification('');
    }, 5000);
    return () => {
      clearTimeout(Timer);
    };
  }, [notification]);
  return (
    <Wrapper>
      <WrapperContent>
        <Logo onClick={handleLogoClick} />
        <Header>Reset your password</Header>
        <Box>
          <Text>
            Enter your user account's verified email address and we will send
            you a password reset link.
          </Text>
          <EmailInput
            type={'email'}
            id="email-input"
            onKeyPress={(e) => e.key === 'Enter' && onSubmitClick()}
            onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
          />
          <WrapperSumbit>
            <RegisterNow>
              <Text2>Don't have an account? </Text2>
              <Text3 onClick={handleRegister}>Register now</Text3>
            </RegisterNow>
            <Button onClick={onSubmitClick}>Submit</Button>
          </WrapperSumbit>
          <CapchaWrapper>
            <ReCAPTCHA
              ref={refRecapCha}
              sitekey={process.env.REACT_APP_GOOGLE_SITE_KEY}
              onExpired={() => {
                refRecapCha.current?.reset();
              }}
            />
          </CapchaWrapper>
        </Box>
        {notification !== '' && <Notification>{notification}</Notification>}
      </WrapperContent>
    </Wrapper>
  );
}
