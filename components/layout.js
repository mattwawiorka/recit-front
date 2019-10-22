import Head from 'next/head';
import Navbar from './navbar';
import Meta from './Meta';

const Layout = (props) => (
    <div>
        <Head>
            <title>Recit</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta httpEquiv="X-UA-Compatiable" content="ie=edge" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            <meta charSet="utf-8" />
        </Head>
        <div>
            <Meta />
            <Navbar />
            {props.children}
        </div>
    </div>
);

export default Layout;