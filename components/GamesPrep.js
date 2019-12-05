import React, { useEffect, useState, useRef, useCallback } from 'react';
import GameRow from './GameList/GameRow';
import GameMarker from './GoogleMaps/GameMarker';
import dateTool from '../lib/dateTool';
import GamesList from './GameList/GameList';
import MapContainer from './GoogleMaps/MapContainer';

function GamesPrep(props) {

    const [games, setGames] = useState(props.games || [])

    useEffect(() => {
        props.subscribeToGames();
        setGames(props.games)
    }, [props.games])

    const todayGames = [];
    const tomorrowGames = [];
    const thisWeekGames = [];
    const nextWeekGames = [];
    const laterGames = [];

    const markers = [];

    const observer = useRef();
    const lastGameRef = useCallback(node => {
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {    
                observer.current.disconnect();
                if (props.hasMore) {
                    props.loadMore();
                } 
            }
        })
        if (node) observer.current.observe(node)
    },[props.games, props.hasMore])
    
    games.forEach((game, index) => {
        let image;

        if (game.node.sport === 'TENNIS') {
            image = "/tennis-ball.svg";
        } 
        else if (game.node.sport === 'BASKETBALL') {
            image = "/basketball.svg";
        }
        else if (game.node.sport === 'FOOTBALL') {
            image = "/american-football.svg";
        } 
        else {
            image = "rec-it.png";
        }

        let marker = 
            <GameMarker
                id={game.node.id}
                key={game.node.id}
                lat={game.node.location.coordinates[0]}
                lng={game.node.location.coordinates[1]}
                text={game.node.title}
                title={game.node.title}
                sport={game.node.sport}
                image={image}
            />

        markers.push(marker)

        let row;
        if (games.length === index + 1) {
            row = 
            <React.Fragment key={game.node.id}>
                <GameRow 
                    id={game.node.id}
                    title={game.node.title}
                    sport={game.node.sport}
                    image={image}
                    venue={game.node.venue}
                    dateTime={game.node.dateTime} 
                    loggedIn={props.loggedIn} />
                    <div id="customBorder" ref={lastGameRef}></div>

                    <style jsx>{`
                    #customBorder {
                        border-bottom-style: groove;
                        border-width: thin;
                        width: 85%;
                        margin: 0 auto;
                    }
                    `}</style>
            </React.Fragment>
        } else {
            row = 
            <React.Fragment key={game.node.id}>
                <GameRow 
                    id={game.node.id}
                    title={game.node.title}
                    sport={game.node.sport}
                    image={image}
                    venue={game.node.venue}
                    dateTime={game.node.dateTime} 
                    loggedIn={props.loggedIn} />
                    <div id="customBorder"></div>

                    <style jsx>{`
                    #customBorder {
                        border-bottom-style: groove;
                        border-width: thin;
                        width: 85%;
                        margin: 0 auto;
                    }
                    `}</style>
            </React.Fragment>
        }
        if (parseInt(game.node.dateTime) < dateTool.getTomorrow().valueOf()) {
            todayGames.push(row);
        } 
        else if (parseInt(game.node.dateTime) < dateTool.getDayAfterTomorrow().valueOf()) {
            tomorrowGames.push(row);
        }
        else if (parseInt(game.node.dateTime) < dateTool.getEndOfWeek().valueOf()) {
            thisWeekGames.push(row);
        }
        else if (parseInt(game.node.dateTime) < dateTool.getEndOfNextWeek().valueOf()) {
            nextWeekGames.push(row);
        }
        else {
            laterGames.push(row);
        }
    });

    return (
        <>
            <MapContainer 
                currentLoc={props.currentLoc}
                markers={markers}
            />
            <GamesList 
                loggedIn={props.loggedIn}
                todayGames={todayGames}
                tomorrowGames={tomorrowGames}
                thisWeekGames={thisWeekGames}
                nextWeekGames={nextWeekGames}
                laterGames={laterGames}
            />
        </>
    )

}

export default GamesPrep;