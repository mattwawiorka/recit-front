import Header from '../Header/Header';
import BottomDockable from '../BottomDockable/BottomDockable';
import Meta from '../Meta';
import classNames from 'classnames';
import NotificationSource from '../Navigation/NotificationSource';

function GamesLayout(props) {

    let containerClass = classNames({
        'container': true,
        'home': props.main,
        'page': !props.main,
        'three-part': props.threeway,
        'simple': props.simple
    })

    return (
        <React.Fragment>
            <Header />
            <Meta />
            <div className={containerClass}>
                <header>
                    <NotificationSource showLogout={props.showLogout}/>
                </header>
                <aside>
                    {props.children[0]}
                </aside>
                <main>
                    {props.children[1]}
                </main>
                {
                props.threeway ?
                <aside>
                    {props.children[2]}
                </aside>
                :
                null
                }

                <BottomDockable show={props.showGamesButton} startGame={props.startGame} submitGame={props.submitGame} clickEvent={props.clickEvent} />
            </div>

            <style jsx="true">{`
                .container {
                    width: 100vw;
                    height: 100vh;
                    display: grid;
                    grid-template-columns: 20vw 80vw;
                    grid-template-rows: 50px max-content;
                    grid-template-areas:
                        "header header"
                        "sidebar1 main";
                    overflow-x: hidden; 
                    background-color: var(--greyapple);
                }

                .home {
                    overflow-y: hidden;
                }

                .page {
                    overflow-y: auto;
                }

                .three-part {
                    grid-template-columns: 20vw 60vw 20vw;
                    grid-template-areas:
                        "header header header"
                        "sidebar1 main sidebar2";
                }

                .simple {
                    grid-template-columns: 100vw;
                    grid-template-areas:
                        "header"
                        "main";
                }

                header {
                    grid-area: header;
                    background-color: var(--greenapple);
                    position: sticky;
                    z-index: 9;
                    top: 0;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, .2);
                }

                aside:nth-of-type(1) {
                    grid-area: sidebar1;
                    background-color: var(--greyapple);
                }

                main {
                    grid-area: main;
                    justify-items: center;
                    align-items: center;
                    background-color: var(--greyapple);
                }

                aside:nth-of-type(2) {
                    grid-area: sidebar2;
                    background-color: var(--greyapple);
                }

                /******************
                *     Laptop      *
                *******************/
                @media only screen and (max-width: 1440px) {
                    .three-part {
                        grid-template-columns: 20vw 80vw 0;
                    }
                }

                /******************
                *  Laptop/tablet  *
                *******************/
                @media only screen and (max-width: 1024px) {
                    .container {
                        grid-template-columns: 0vw 100vw;
                    }

                    .simple {
                        grid-template-columns: 100vw;
                        grid-template-areas:
                            "header"
                            "main";
                    }
                }

                /******************
                *     Mobile      *
                *******************/
                @media only screen and (max-width: 600px), (max-height: 600px) {
                    .three-part {
                        grid-template-columns: 0 100vw 0;
                    }

                    .home {
                        grid-template-columns: 0vw 100vw;
                    }
                }

                /******************
                *    Landscape    *
                *******************/
                @media only screen and (max-height: 425px) {
                    .home {
                        grid-template-columns: 0vw 100vw;
                    }
                }
            `}</style>
        </React.Fragment>
    );
}

export default GamesLayout;