// pages/index.tsx
import Link from 'next/link';

const LandingPage = () => {
  return (
    <div>
      <h1>Welcome to the Landing Page</h1>
      <Link href="/login">Login</Link>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/register">Register</Link>
    </div>
  );
};

export default LandingPage;
