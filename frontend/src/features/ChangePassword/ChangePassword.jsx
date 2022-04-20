import { useSearchParams } from 'react-router-dom';
import LogoImg from 'assets/images/logos/logo2.jpg';
import styled from 'styled-components';
import userApi from 'apis/userApi';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from '../../../node_modules/react-router-dom/index';
const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  flex-direction: column;
`;
const Border = styled.div`
  border: 1px solid #e1e1e1;
  border-radius: 10px;
  width: 500px;
`;
const FormWrapper = styled.div`
  margin: 20px;
`;
const Header = styled.div`
  font-size: 25px;
  font-weight: 600;
  background-color: #f5f5f5;
  padding: 10px;
  text-align: center;
`;
const LabelInput = styled.div`
  margin-top: 10px;
`;
const Input = styled.input`
  border-radius: 10px;
  border: 1px solid #e1e1e1;
  :focus {
    border-color: red;
  }
`;
const SaveButton = styled.button`
  margin-top: 20px;
  margin-left: auto;
  padding: 10px;
  margin-left: 80%;
  border-radius: 10px;
  background-color: #5bb55b;
  border: 1px solid #e1e1e1;
  &:hover {
    filter: brightness(0.8);
  }
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
const Notification = styled.div`
  color: red;
`;
export default function ChangePassword() {
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  const [type, setType] = useState(searchParams.get('type'));
  const [token, setToken] = useState(searchParams.get('token'));
  const [email, setEmail] = useState(searchParams.get('email'));
  const [code, setTempCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAuthen, setIsAuthen] = useState(false);
  const [noti, setNoti] = useState('');
  useEffect(async () => {
    const rs = await userApi.checkTempToken(email, token, code);
    if (rs.result) setIsAuthen(true);
  }, []);
  const checkAuthen = async () => {
    const rs = await userApi.checkTempToken(email, token, code);
    if (rs.result) setIsAuthen(true);
  };
  if (isAuthen && type !== 'alreadyAuthenticated')
    setType('alreadyAuthenticated');
  const changePassword = async () => {
    if (isAuthen) {
      let regPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{6,60}$/;
      if (newPassword !== confirmPassword) setNoti('Password not match');
      else if (!regPass.test(newPassword))
        setNoti(
          'Password must be at least 6 characters and contain at least one number, one uppercase letter and one lowercase letter'
        );
      else {
        const rs = await userApi.changePassword(
          email,
          token,
          code,
          newPassword
        );
        console.log(rs);
        if (rs.result) {
          Swal.fire({
            title: 'Change password successfully, please login again',
          });
          navigate('/');
        } else
          Swal.fire({
            title: 'Change password failed',
          });
      }
    }
  };
  useEffect(() => {
    const Timer = setTimeout(() => {
      setNoti('');
    }, 8000);
    return () => clearTimeout(Timer);
  }, [noti]);
  return (
    <Wrapper>
      <Logo onClick={() => navigate('/')} />
      <Border>
        <Header>Reset your password</Header>
        <FormWrapper>
          {isAuthen ? (
            <>
              <LabelInput>New password</LabelInput>
              <Input
                type="password"
                onKeyPress={(e) => e.key === 'Enter' && changePassword()}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
              />
              <LabelInput>Confirm password</LabelInput>
              <Input
                type="password"
                onKeyPress={(e) => e.key === 'Enter' && changePassword()}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
              />
              <SaveButton>Save</SaveButton>
            </>
          ) : (
            <>
              <LabelInput>Enter your pin</LabelInput>
              <Input
                onChange={(e) => setTempCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkAuthen()}
                type="text"
              />
              <SaveButton onClick={changePassword}>Sumbit</SaveButton>
            </>
          )}
        </FormWrapper>
      </Border>
      {noti && <Notification>{noti}</Notification>}
    </Wrapper>
  );
}
