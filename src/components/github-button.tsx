import { GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import styled from 'styled-components';
import { auth } from '../firebase';
import { FirebaseError } from 'firebase/app';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Button = styled.span`
  background-color: white;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 50px;
  border: 0;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: black;
  margin-top: 50px;
  cursor: pointer;
`;

const Logo = styled.img`
  height: 25px;
`;

const Err = styled.div`
  color: #f26b6b;
  font-size: 13px;
  margin-top: 10px;
`;

export default function GithubButton() {
  const [error, seterror] = useState('');
  const navigate = useNavigate();

  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err) {
      if (err instanceof FirebaseError) {
        seterror(err.message);
      }
    }
  };
  return (
    <>
      <Button onClick={onClick}>
        <Logo src="/github-logo.svg" />
        continue github
      </Button>

      {error ? <Err>{error}</Err> : null}
    </>
  );
}
