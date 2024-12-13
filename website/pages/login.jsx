// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
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
      <h1>Login Page</h1>
      <div>
      <button onClick={() => signIn('google')}>Sign in with Google</button>
      </div>
      <form style={{display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '300px', boxShadow: '1px 5px 10px grey', padding: '50px', borderRadius:'10px'}} onSubmit={handleLogin}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit">Login</button>
      </form>
      <Link href='/register'>Don't have an account? Register</Link>
    </div>
    </Layout>
  );
};

export default LoginPage;
