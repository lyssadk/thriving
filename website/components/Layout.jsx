import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main> {/* This is where your page content will go */}
      <Footer />
    </div>
  );
};

export default Layout;