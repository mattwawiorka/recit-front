import Header from '../Header/Header';
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
                    <NotificationSource showLogout={props.showLogout}/>
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

                <BottomDockable show={props.showGamesButton} startGame={props.startGame} submitGame={props.submitGame} clickEvent={props.clickEvent} />

            </div>

            <style jsx>{`
                .container-two-parts {
                    width: 100vw;
                    height: 100vh;
                    display: grid;
                    grid-template-columns: 20vw 80vw;
                    grid-template-rows: 50px minmax(82vh, max-content);
                    grid-template-areas:
                        "header header header"
                        "sidebar1 main sidebar2";
                    overflow-y: hidden;
                    overflow-x: hidden; 
                    background-color: var(--greyapple);
                }

                .container-three-parts {
                    width: 100vw;
                    height: 100vh;
                    display: grid;
                    grid-template-columns: 20vw 60vw 20vw;
                    grid-template-rows: 50px minmax(82vh, max-content);
                    grid-template-areas:
                        "header header header"
                        "sidebar1 main sidebar2";
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

                /******************
                *  Laptop/tablet  *
                *******************/
                @media only screen and (max-width: 1024px) {
                    .container-two-parts {
                        grid-template-columns: 0vw 100vw;
                    }

                    .container-three-parts {
                        grid-template-columns: 10vw 80vw 10vw;
                    }
                }

                /******************
                *     Mobile      *
                *******************/
                @media only screen and (max-width: 600px) {
                    .container-three-parts {
                        grid-template-columns: 0 100vw 0;
                    }
                }

                /******************
                *    Landscape    *
                *******************/
                @media only screen and (max-height: 425px) {
                    .container-two-parts {
                        grid-template-columns: 0vw 100vw;
                    }
                }
            `}</style>
        </React.Fragment>
    );
}

export default GamesLayout;