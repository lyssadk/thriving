import Header from '../components/Header';
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

export default function Register() {
    return (
        <Layout>
        
        <div style={css} >
            <h1>Register Account</h1>
            <form style={{display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '300px', boxShadow: '1px 5px 10px grey', padding: '50px', borderRadius:'10px'}}>
                
                    <label htmlFor="username">Username</label>
                    <input id="username" type="text" placeholder="Username" />
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" placeholder="Password" />
                    <label htmlFor="email">Email</label>
                    <input id="email" type='email' placeholder='Email' />
                    <label htmlFor="fullName">Full Name</label>
                    <input id="fullName" type='text' placeholder='Full Name' />
                
                <button style={{width:'200px', margin:'0 auto'}}type="submit">Register</button>
            </form>
            <Link href="/login">Already have an account? Login</Link>
        </div></Layout>
    )
}