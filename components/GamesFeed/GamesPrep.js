import React, { useEffect, useState, useRef, useCallback } from 'react';
import GameRow from '../GameList/GameRow';
import GameMarker from '../GoogleMaps/GameMarker';
import GameCluster from '../GoogleMaps/GameCluster';
import dateTool from '../../lib/dateTool';
import GamesList from '../GameList/GameList';
import MapContainer from '../GoogleMaps/MapContainer';
import supercluster from 'points-cluster';
import MyGames from '../GameList/MyGames';

function GamesPrep(props) {
    let marker;
    const [games, setGames] = useState(props.games || [])
    const [hovered, setHovered] = useState(null);
    const [scroll, setScroll] = useState(false);
    const [scrollHeight, setScrollHeight] = useState(null);

    useEffect(() => {
        setGames(props.games)
    }, [props.games])

    useEffect(() => {
        props.subscribeToGames();
    }, [])

    const todayGames = [];
    const tomorrowGames = [];
    const thisWeekGames = [];
    const nextWeekGames = [];
    const laterGames = [];
    const gamesBySpots = [];
    const myGames = [];

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

    // For connecting Markers to Game Rows
    const getHovered = useCallback((id, fromMap) => {
        setHovered(id)
        if (fromMap) setScroll(true)
    })

    const clearHovered = useCallback(() => {
        setHovered(null)
        setScroll(false)
    })

    const scrollList = useCallback((height) => {
        setScrollHeight(height)
    })

    // Get clusters
    const markersData = [];
    games.map(g => {
        markersData.push({
            id: g.node.id,
            sport: g.node.sport,
            image: g.node.image,
            lat: g.node.location.coordinates[0],
            lng: g.node.location.coordinates[1]
        })
    });
    let clusters = supercluster(markersData, {
        minZoom: 0,
        maxZoom: 18,
        radius: 30,
    });
    clusters = clusters({
        bounds: { nw: { lat: props.bounds[0], lng: props.bounds[3] }, se: { lat: props.bounds[2], lng:props.bounds[1] } },
        zoom: props.zoom
    });

    // Set data map markers
    clusters.map(cluster => {
        if (cluster.numPoints === 1){
            marker = 
                <GameMarker
                    key={cluster.points[0].id}
                    id={cluster.points[0].id}
                    lat={cluster.wy}
                    lng={cluster.wx}
                    sport={cluster.points[0].sport}
                    image={cluster.points[0].image}
                    onMouseEnter={getHovered}
                    hovered={hovered === cluster.points[0].id}
                    clearHovered={clearHovered}
                />
        }
        else {
            marker =
                <GameCluster
                    key={cluster.points[0].id}
                    games={cluster.points}
                    lat={cluster.wy}
                    lng={cluster.wx}
                    hovered={cluster.points.some(p => p.id === hovered)}
                    clearHovered={clearHovered}
                />
        }
        
        markers.push(marker);
    })

    // Set data for games list
    games.map((game, index) => {
        let row;
        if (games.length === index + 1) {
            row = 
            <React.Fragment key={game.node.id}>
                <GameRow 
                    game={game.node}
                    onMouseEnter={getHovered}
                    hovered={hovered === game.node.id}
                    clearHovered={clearHovered}
                    getScrollHeight={scrollList}
                />
          
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
                    game={game.node}
                    onMouseEnter={getHovered}
                    hovered={hovered === game.node.id}
                    clearHovered={clearHovered}
                    getScrollHeight={scrollList}
                />
                    
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

    // Set data for my games
    props.myGames.map(game => {
        let row;
        row = 
            <React.Fragment key={game.node.id}>
                <GameRow 
                    game={game.node}
                    onMouseEnter={getHovered}
                    hovered={hovered === game.node.id}
                    clearHovered={clearHovered}
                    getScrollHeight={scrollList}
                    level={game.level}
                />
                    
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

        myGames.push(row);
    })

    return (
        <React.Fragment>
            <MapContainer 
                currentLoc={props.currentLoc}
                markers={markers}
                getMapBounds={props.getMapBounds}
                viewMode={props.viewMode}
            />
            <div className="lists">
                {myGames.length > 0 ?
                <MyGames 
                    myGames={myGames}
                    activeCount={props.activeCount}
                    hasMore={props.hasMore_myGames}
                    loadMore={props.loadMore_myGames}
                    viewMode={props.viewMode}
                />  
                :
                null}
                <GamesList 
                    todayGames={todayGames}
                    tomorrowGames={tomorrowGames}
                    thisWeekGames={thisWeekGames}
                    nextWeekGames={nextWeekGames}
                    laterGames={laterGames}
                    gamesBySpots={gamesBySpots}
                    scroll={scroll}
                    scrollTo={scrollHeight}
                    viewMode={props.viewMode}
                    myGames={props.activeCount}
                />
            </div>

            <style jsx>{`
                .lists {
                    vertical-align: top;
                    max-height: 86vh;
                    display: inline-block;
                    width: calc(80vw - 900px);
                    max-width: 850px;
                    height: max-content;
                    margin-bottom: 16px;
                    overflow-y: auto;
                    overflow-x: hidden;
                }

                /******************
                *  Laptop/Tablet  *
                *******************/
                @media only screen and (max-width: 1600px) {
                    .lists {
                        width: calc(80vw - 700px);
                    }
                }

                @media only screen and (max-width: 1300px) {
                    .lists {
                        width: calc(80vw - 600px);
                    }
                }

                @media only screen and (max-width: 1024px) {
                    .lists {
                        width: calc(100vw - 600px);
                    }
                }

                @media only screen and (max-width: 768px) {
                    .lists {
                        width: calc(100vw - 425px);
                    }
                }

                /******************
                *     Mobile      *
                *******************/
                @media only screen and (max-width: 600px), (max-height: 600px) {
                    .lists {
                        width: 90%;
                        margin: 0 5%;
                    }
                }
            `}</style>
        </React.Fragment>
    );
}

export default GamesPrep;