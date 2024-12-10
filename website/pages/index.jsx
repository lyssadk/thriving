// pages/index.tsx
import Layout from '../components/Layout';
import lemons from '../images/lemons.webp';
import Image from 'next/image';


const LandingPage = () => {
  return (
    <Layout>
      <div style={{ minWidth: '100%', minHeight: "800px", margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 1fr' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft:'25%' }}>
          <h1>Welcome to Thriving Cells</h1>
          <p>We are here to help you find the root cause of any health issue. We strive to help you thrive.</p>
          <button style={{width:'40%', padding:"10px",marginTop:"10px"}}>Sign up to see our inventory</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center',}}>
          <Image
            src={lemons} // path to your image file
            width={1000} // required
          />
        </div>
      </div>
    </Layout>
  );
};

export default LandingPage;
