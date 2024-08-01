import { Outlet, ScrollRestoration } from 'react-router-dom';
import Footer from './components/common/Footer';
import Navbar from './components/common/Navbar';


function Root() {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
            <ScrollRestoration />
        </>
    );
}

export default Root;
