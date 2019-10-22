import Header from '../Header/Header';
import Navigation from '../Navigation/Navigation';

const GamesLayout = (props) => (
    <div>
        <Header />
        <Navigation />
        <div>
            {props.children}
        </div>
    </div>
);

export default GamesLayout;