import Header from '../Header/Header';
import Navigation from '../Navigation/Navigation';
import Meta from '../Meta';

const Layout = (props) => (
    <div>
        <Header />
        <div>
            <Meta />
            <Navigation />
            <div style={{ paddingTop: '25px', marginLeft: '50px', marginRight: '50px'}}>
                {props.children}
            </div>
        </div>
    </div>
);

export default Layout;