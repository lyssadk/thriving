// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import Layout from '../components/Layout';

const css = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  gap: '1rem',
}

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Dummy login check, replace with actual auth logic
    if (username === 'alyssa' && password === 'test') {
      router.push('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <Layout>
    <div style={css}>
      <button onClick={() => signIn('google')}>Sign in with Google</button>
    </div>
    </Layout>
  );
};

export default LoginPage;
