 
import Header from '../Header/Header';
import Navigation from '../Navigation/Navigation';
import Meta from '../Meta';

const Layout = (props) => (
    <div>
        <Header />
        <div>
            <Meta />
            <header>
                <Navigation />
            </header>
            
            <div style={{ paddingTop: '25px', marginLeft: '50px', marginRight: '50px'}}>
                {props.children}
            </div>
            
            <style jsx>{`
                header {
                    grid-area: header;
                    background-color: var(--greenapple);
                }
            `}</style>
        </div>
    </div>
);

export default Layout;