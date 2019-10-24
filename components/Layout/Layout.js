import Header from '../Header/Header';
import Navigation from '../Navigation/Navigation';
import Meta from '../Meta';

const Layout = (props) => (
    <div>
        <Header />
        <div>
            <Meta />
            <Navigation />
            {props.children}
        </div>
    </div>
);

export default Layout;