import Header from '../Header/Header';
import NavigationSource from '../Navigation/NotificationSource';
import BottomDockable from '../BottomDockable/BottomDockable';
import Meta from '../Meta';
import classNames from 'classnames';
import NotificationSource from '../Navigation/NotificationSource';

function GamesLayout(props) {

    let containerClass = classNames({
        'container-two-parts': props.main,
        'container-three-parts': !props.main
    })

    return (
    <React.Fragment>
        <Header />
        <Meta />
        <div className={containerClass}>
            <header>
                <NotificationSource />
            </header>
            <aside>
                {props.children[0]}
            </aside>
            <main>
                {props.children[1]}
            </main>
            {
            props.main ?
            null
            :
            <aside>
                {props.children[2]}
            </aside>
            }
            <footer>
                <BottomDockable show={props.showGamesButton} startGame={props.startGame} submitGame={props.submitGame} clickEvent={props.clickEvent} />
            </footer>
        </div>

        <style jsx>{`
            .container-two-parts {
                width: 100vw;
                height: 100vh;
                display: grid;
                grid-template-columns: 20vw 80vw;
                grid-template-rows: minmax(min-content, min-content) minmax(82vh, max-content) minmax(min-content, min-content);
                grid-template-areas:
                    "header header header"
                    "sidebar1 main sidebar2"
                    "footer footer footer";
                overflow-y: hidden;
                overflow-x: hidden; 
                background-color: var(--greyapple);
            }

            .container-three-parts {
                width: 100vw;
                height: 100vh;
                display: grid;
                grid-template-columns: 20vw 60vw 20vw;
                grid-template-rows: minmax(min-content, min-content) minmax(82vh, max-content) minmax(min-content, min-content);
                grid-template-areas:
                    "header header header"
                    "sidebar1 main sidebar2"
                    "footer footer footer";
                overflow-y: auto;
                overflow-x: hidden; 
                background-color: var(--greyapple);
            }

            header {
                grid-area: header;
                background-color: var(--greenapple);
                overflow: hidden;
            }

            aside:nth-of-type(1) {
                grid-area: sidebar1;
                background-color: var(--greyapple);
                // overflow: auto;
            }

            main {
                grid-area: main;
                justify-items: center;
                align-items: center;
                background-color: var(--greyapple);
                // overflow: auto;
            }

            aside:nth-of-type(2) {
                grid-area: sidebar2;
                background-color: var(--greyapple);
                // overflow: auto;
            }

            footer {
                grid-area: footer;
                margin-top: 4.5em;
                background-color: var(--greyapple);
                overflow-x: hidden;
            }
        `}</style>
    </React.Fragment>
    );
}

export default GamesLayout;