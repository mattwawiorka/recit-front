import Header from '../Header/Header';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import BottomDockable from '../BottomDockable/BottomDockable';
import Meta from '../Meta';

const GamesLayout = (props) => (

    <React.Fragment>
        <Header />
        <Meta />
        <div className="container">
            <header>
                <Navigation />
            </header>
            {/* <div style={{ paddingTop: '25px', marginLeft: '50px', marginRight: '50px'}}>
                {props.children}
            </div> */}
            <aside>
                {props.children[0]}
            </aside>
            <main>
                {props.children[1]}
            </main>
            <aside>
                {props.children[2]}
            </aside>
            <footer>
                <Footer />
                <BottomDockable startGame={props.startGame} submitGame={props.submitGame} clickEvent={props.clickEvent} />
            </footer>
        </div>

        <style jsx>{`
            .container {
                width: 100vw;
                height: 100vh;
                display: grid;
                grid-template-columns: 20vw 60vw 20vw;
                grid-template-rows: minmax(min-content, min-content) 82vh 8vh;
                grid-template-areas:
                    "header header header"
                    "sidebar1 main sidebar2"
                    "footer footer footer";
                overflow-x: hidden;
            }

            header {
                grid-area: header;
                background-color: var(--greenapple);
            }

            aside:nth-of-type(1) {
                grid-area: sidebar1;
                background-color: var(--greyapple);
                //overflow: hidden;
            }

            main {
                grid-area: main;
                overflow: auto;
                justify-items: center;
                align-items: center;
                background-color: var(--greyapple);
            }

            aside:nth-of-type(2) {
                grid-area: sidebar2;
                background-color: var(--greyapple);
                //overflow: hidden;
            }

            footer {
                grid-area: footer;
                background-color: var(--greyapple);
            }
        `}</style>
    </React.Fragment>
);

export default GamesLayout;