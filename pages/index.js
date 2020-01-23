import React, { Component, useState, useEffect } from 'react';
import SortingFiltering from '../components/GamesFeed/SortingFiltering';
import Layout from '../components/Layout/Layout';
import CreateGameForm from '../components/CreateGame/CreateGameForm';
import Announcements from '../components/Announcements/Announcements';
import { withApollo } from '../lib/apollo';
import withAuth from '../lib/withAuth';
import Loading from '../components/Loading/Loading';

function Index(props) {

    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(props.auth.loggedIn());
    const [currentLoc, setCurrentLoc] = useState([47.7169839910907, -122.32040939782564]);
    const [createGame, setCreateGame] = useState(false);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setCurrentLoc([position.coords.latitude, position.coords.longitude]);
        });

        setLoading(false);
    }, [])

    if (loading) return <Loading />

    return (
        <React.Fragment>
            {createGame ? <div className="overlay"></div> : null}
            <Layout 
                main={true} 
                showGamesButton={true} 
                startGame={!createGame} 
                clickEvent={() => setCreateGame(!createGame)} 
            >
                <Announcements />
                <React.Fragment>
                    {createGame ? 
                        <CreateGameForm 
                            exitFunc={() => setCreateGame(!createGame)}
                        />
                    :
                    null 
                    }
                    <SortingFiltering 
                        loggedIn={loggedIn}  
                        currentLoc={currentLoc}
                        faded={createGame}
                    />
                </React.Fragment>
            </Layout>

            <style jsx>{`
                .overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 100%;
                    background-color: rgba(0,0,0,0.5);
                    z-index: 10;
                    animation-duration: .75s;
                    animation-name: fadein;
                }
                @keyframes fadein {
                    from {
                        opacity: 0;
                    } 
                    
                    to {
                        opacity: 1;
                    }
                }
            `}</style>
        </React.Fragment>
    );   
}

export default withApollo(withAuth(Index));