import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

export default function Home() {
  const navigate = useNavigate();

  const logOut = function () {
    auth.signOut();
    navigate('/login');
  };

  return <button onClick={logOut}>logout</button>;
}
