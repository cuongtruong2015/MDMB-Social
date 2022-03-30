import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowNarrowRight, Eye, EyeOff } from '@styled-icons/heroicons-solid';
import { registerUser, resetRegister } from 'app/actions/register';
import {
  getErrorRegister,
  getFetchingRegister,
  getFillToRegister,
  getMessageRegister,
  getSuccessRegister,
  getTypeRegister,
} from 'app/selectors/register';
import React from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  FormControl,
  InputGroup,
  Row,
  Spinner,
} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import './register.scss';

const IconEye = styled(Eye)`
  width: 1.2rem;
`;

const IconEyeOff = styled(EyeOff)`
  width: 1.2rem;
`;

const IconArrowNarrowRight = styled(ArrowNarrowRight)`
  width: 1.2rem;
  height: 100%;
`;

const ButtonCreateAccount = styled(Button)`
  position: relative;
  overflow: hidden;
  padding-right: 0;
  vertical-align: middle;
  z-index: 1;
  cursor: pointer;
  transition: opacity 0.1s ease, background-color 0.1s ease, color 0.1s ease,
    box-shadow 0.1s ease, background 0.1s ease, -webkit-box-shadow 0.1s ease;
`;

const ButtonContent = styled.div`
  left: auto;
  right: 0;
  position: relative;
  margin-right: 1.5em;
  transition: right 0.3s ease 0s;
  will-change: transform, opacity;

  ${ButtonCreateAccount}:hover & {
    left: auto;
    right: 200%;
  }
`;

const IconInner = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 25%;
  left: auto;
  right: -70%;
  margin-top: -0.5em;
  transition: right 0.3s ease 0s;
  ${ButtonCreateAccount}:hover & {
    left: auto;
    right: 0;
  }
`;
const schema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(45, 'Name must be less than 50 characters')
    .required('This field is required')
    .matches(
      /^((?![0-9\\~\\!\\@\\#\\$\\%\\^\\&\\*\\(\\)\\_\\+\\=\\-\\[\]\\{\\}\\;\\:\\"\\\\/\\<\\>\\?]).){2,45}/,
      'Name is not contain special characters'
    ),
  email: yup
    .string()
    .required('This field is required')
    .email('Email is invalid'),
  phone: yup
    .string()
    .required('This field is required')
    .min(10, 'Phone is invalid')
    .max(10, 'Phone is invalid')
    .matches(
      /([+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/,
      'Phone is invalid'
    ),
  password: yup
    .string()
    .min(
      6,
      'Passwords must contain 6 characters, one uppercase, one lowercase and one number'
    )
    .max(60, 'Passwords must be less than 60 characters in length')
    .required('This field is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{6,60}$/,
      'Passwords must be at least 6 characters, one uppercase, one lowercase and one number'
    ),
  confirmPassword: yup
    .string()
    .min(6, 'Passwords must be at least 6 characters in length')
    .max(60, 'Passwords must be less than 60 characters in length')
    .required('This field is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

function Register() {
  const [showPassword, setShowPassword] = React.useState(false);
  const messageRegister = useSelector(getMessageRegister);
  const hasError = useSelector(getErrorRegister);
  const hasSuccess = useSelector(getSuccessRegister);
  const isLocalType = useSelector(getTypeRegister)?.local;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dataFill = useSelector(getFillToRegister);
  const isFetching = useSelector(getFetchingRegister);

  window.onbeforeunload = (event) => {
    event.preventDefault();
    dispatch(resetRegister());
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: dataFill?.email || '',
      name: dataFill?.name || '',
      password: dataFill?.password || '',
      confirmPassword: dataFill?.password || '',
    },
    resolver: yupResolver(schema),
  });

  const onRegisterHandler = (data, e) => {
    e.preventDefault();
    if (dataFill?.email) {
      data['google'] = true;
    }
    dispatch(registerUser(data));
    reset();
  };

  hasSuccess &&
    Swal.fire({
      icon: 'success',
      allowOutsideClick: false,
      title: isLocalType ? 'Awaiting Confirmation' : 'Welcome to our app',
      text: isLocalType
        ? "If you haven't received our email in 3 hours, please check your spam folder."
        : messageRegister,
    }).then((result) => {
      if (result.value) {
        dispatch(resetRegister());
        navigate('/login');
      }
    });

  let priorityError = 0;
  if (errors.name?.message) {
    priorityError = 1;
  } else if (errors.email?.message) {
    priorityError = 2;
  } else if (errors.phone?.message) {
    priorityError = 3;
  } else if (errors.password?.message) {
    priorityError = 4;
  } else if (errors.confirmPassword?.message) {
    priorityError = 5;
  } else if (hasError) {
    priorityError = 6;
  } else priorityError = 0;

  return (
    <div className="register">
      <Row className="h-100">
        <Col lg={7} className="register__col">
          <div className="register__hero"></div>
        </Col>

        <Col lg={5} className="register__col">
          <div className="form__inner">
            <Card>
              <div className="card__body">
                <Card.Body>
                  <div className="card__header">
                    <Card.Title>Register</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted title">
                      {dataFill
                        ? ' Update your profile to complete your registration.'
                        : "Let's create your account!"}
                    </Card.Subtitle>
                  </div>
                  <Form onSubmit={handleSubmit(onRegisterHandler)}>
                    <Row>
                      <Col lg={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            type="text"
                            {...register('name', { required: true })}
                            placeholder="Enter your name"
                          />
                          <Form.Text className="text-danger">
                            {priorityError === 1 && errors.name?.message
                              ? errors.name?.message
                              : ''}
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            {...register('email', {
                              required: true,
                            })}
                            disabled={dataFill?.email}
                            placeholder="Enter your email"
                          />
                          <Form.Text className="text-danger">
                            {priorityError === 2 && errors.email?.message
                              ? errors.email?.message
                              : null}
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone</Form.Label>
                          <Form.Control
                            type="string"
                            {...register('phone')}
                            placeholder="Enter your phone"
                          />
                          {priorityError === 3 && errors.phone?.message ? (
                            <Form.Text className="text-danger">
                              {errors.phone?.message}
                            </Form.Text>
                          ) : null}
                        </Form.Group>
                      </Col>
                    </Row>
                    {!dataFill?.email && (
                      <Row>
                        <Col lg={6}>
                          <Form.Label>Password</Form.Label>
                          <InputGroup>
                            <FormControl
                              type={showPassword ? 'text' : 'password'}
                              {...register('password')}
                              placeholder="Enter your password"
                            />
                            <InputGroup.Text
                              style={{
                                cursor: 'pointer',
                              }}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <IconEye /> : <IconEyeOff />}
                            </InputGroup.Text>
                          </InputGroup>
                        </Col>
                        <Col lg={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <InputGroup>
                              <Form.Control
                                type={showPassword ? 'text' : 'password'}
                                {...register('confirmPassword')}
                                placeholder="Confirm Password"
                              />

                              <InputGroup.Text
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                  cursor: 'pointer',
                                }}
                              >
                                {showPassword ? <IconEye /> : <IconEyeOff />}
                              </InputGroup.Text>
                            </InputGroup>
                          </Form.Group>
                        </Col>
                      </Row>
                    )}
                    <Row
                      style={{
                        marginBottom: '15px',
                      }}
                    >
                      <Col lg={12}>
                        {priorityError === 4 && errors.password?.message ? (
                          <Form.Text className="text-danger">
                            {errors.password?.message}
                          </Form.Text>
                        ) : priorityError === 5 &&
                          errors.confirmPassword?.message ? (
                          <Form.Text className="text-danger">
                            {errors.confirmPassword?.message}
                          </Form.Text>
                        ) : priorityError === 6 && hasError ? (
                          <Form.Text className="text-danger">
                            {messageRegister}
                          </Form.Text>
                        ) : null}
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={5}>
                        <ButtonCreateAccount
                          type="submit"
                          variant="primary"
                          className="w-100"
                          disabled={isFetching}
                        >
                          <ButtonContent>
                            {isFetching && (
                              <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                            )}
                            Create Account
                          </ButtonContent>
                          <IconInner>
                            <IconArrowNarrowRight />
                          </IconInner>
                        </ButtonCreateAccount>
                      </Col>
                    </Row>
                    <Row className="pt-3">
                      <Col>
                        <p className="text-login">
                          Already have an account? <Link to="/">Login</Link>
                        </p>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Register;
