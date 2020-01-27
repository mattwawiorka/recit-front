import React, { useState, useCallback } from 'react';
import GameSource from './GameSource';
import classNames from 'classnames';

function SortingFiltering(props) {

    const initialBounds = [
        props.currentLoc[0] + 0.08812489109,
        props.currentLoc[1] + 0.1095172763,
        props.currentLoc[0] - 0.08827372991,
        props.currentLoc[1] - 0.1095172763
    ];

    // const loggedIn = useContext(AuthContext)
    const [showPanel, setShowPanel] = useState();
    const [sport, setSport] = useState("ALL");
    const [startDate, setStartDate] = useState("ALL");
    const [openSpots, setOpenSpots] = useState("0");
    const [bounds, setBounds] = useState(initialBounds);
    const [zoom, setZoom] = useState(12);
    const [sortOrder, setSortOrder] = useState("DATE");

    const setMapBounds = useCallback((mapBounds, mapZoom) => {
        setBounds(mapBounds);
        if (mapZoom) setZoom(mapZoom);
    })

    const panelClass = classNames({
        'aside': true,
        'aside-in': showPanel === true,
        'aside-out': showPanel === false
    });

    const btnClass = classNames({
        'sort-toggle-button': true,
        'btn-left': showPanel === true,
        'btn-right': showPanel === false
    });

    return (
        <React.Fragment>
            <div className="game-feed-container">
                <GameSource 
                    loggedIn={props.loggedIn} 
                    sport={sport} 
                    startDate={startDate} 
                    openSpots={openSpots}
                    currentLoc={props.currentLoc} 
                    getMapBounds={setMapBounds}
                    bounds={bounds}
                    zoom={zoom}
                    sortOrder={sortOrder}
                />
            </div>
                
            <button onClick={() => setShowPanel(!showPanel)} className={btnClass}>
                <h1 style={{ writingMode: "vertical-rl" }}>+</h1>
            </button>

            <aside className={panelClass}>
                <form className='sorting-filtering'>
                    <div className="form-group">
                        <label className="header">Sport</label>
                        <select 
                            onChange={e => setSport(e.target.value)} 
                            className="input-fields"
                            value={sport}
                        >
                            <option value="ALL">All</option>
                            <option value="TENNIS">Tennis</option>
                            <option value="BASKETBALL" >Basketball</option>
                            <option value="FOOTBALL">Football</option>
                            <option value="VOLLEYBALL" >Volleyball</option>
                            <option value="SOFTBALL">Softball</option>
                            <option value="BASEBALL">Baseball</option>
                            <option value="FIELD HOCKEY">Field Hockey</option>
                            <option value="TABLE TENNIS">Table Tennis</option>
                            <option value="SOCCER">Soccer</option>
                            <option value="BADMINTON">Badminton</option>
                            <option value="GOLF">Golf</option>
                            <option value="DISC GOLF">Disc Golf</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="header">Starting Date</label>
                        <select 
                            onChange={e => setStartDate(e.target.value)} 
                            className="input-fields"
                            value={startDate}
                        >
                            <option value="ALL">All</option>
                            <option value="TODAY" >Today</option>
                            <option value="TOMORROW">Tomorrow</option>
                            <option value="LATERTHISWEEK">Later This Week</option>
                            <option value="NEXTWEEK">Next Week</option>
                            <option value="LATER">Later</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="header">Open Spots</label>
                        <select 
                            onChange={e => setOpenSpots(e.target.value)} 
                            className="input-fields"
                            value={openSpots}
                        >
                            <option value={0}>Show Full</option>
                            <option value={1}>1+</option>
                            <option value={2}>2+</option>
                            <option value={3}>3+</option>
                            <option value={4}>4+</option>
                        </select>
                    </div>

                    
                    {/* Disable sorting by open spots, at least for now
                    <div className="form-group">
                        <label className="header">Sort Order</label>
                        <select 
                            onChange={e => setSortOrder(e.target.value)} 
                            className="input-fields"
                            value={sortOrder}
                        >
                            <option value="DATE">Date</option>
                            <option value="SPOTS" >Open Spots</option>
                        </select>
                    </div> 
                    */}
                    
                </form>
            </aside>

            <style jsx>{`
                .game-feed-container {
                    display: flex;
                    width: 100%;
                    padding-right: 
                    height: auto; 
                    padding: 1.2em 1.2em 0 0.5em;
                    overflow: hidden;
                }

                .sort-toggle-button {
                    position: absolute;
                    top: 35%;
                    right: 0%;
                    height: 15em;
                    background-color: var(--greenapple);
                    color: white;
                    text-align: center;
                    font-size: 1em;
                    text-orientation: upright;
                    border-top-left-radius: 35px; 
                    border-bottom-left-radius: 35px;
                    border-bottom: 0;
                    border-style: none;
                    cursor: pointer;
                    outline: none;
                }

                .btn-left {
                    animation-duration: 1.5s;
                    animation-name: slide-left;
                    right: 20%;
                }

                .btn-right {
                    animation-duration: 1.5s;
                    animation-name: slide-right;
                }

                aside {
                    position: relative;
                    top: -97%;
                    right: -100%;
                    // height: auto;
                    height: 80vh;
                    width: 20vw;
                    overflow: hidden;
                }

                .aside-in {
                    right: -75%;
                    animation-duration: 1.5s;
                    animation-name: slidein;   
                }

                .aside-out {
                    animation-duration: 1.5s;
                    animation-name: slideout;
                }

                @keyframes slide-left {
                    from {
                        right: 0%;
                    } 
                    
                    to {
                        right: 20%;
                    }
                }

                @keyframes slide-right {
                    from {
                        right: 20%;
                    } 
                    
                    to {
                        right: 0%;
                    }
                }

                @keyframes slidein {
                    from {
                        right: -100%;
                    } 
                    
                    to {
                        right: -75%;
                    }
                }

                @keyframes slideout {
                    from {
                        right: -75%;
                    } 
                    
                    to {
                        right: -100%;
                    }
                }

                .sorting-filtering {
                    display: block;
                    width: 100%;
                    height: 100%;
                    padding: 1em;
                    background-color: var(--greenapple);
                    border-top-left-radius: 15px;
                    border-bottom-left-radius: 15px;
                }

                .form-group {
                    vertical-align: middle;
                    padding: 5px 0 5px 0;
                }

                h2 {
                    text-align: center;
                    color: white;
                    text-decoration: underline;
                    margin-bottom: 0.75em;
                    margin-top: 0.75em;
                }

                .header {
                    display: block;
                    color: white;
                    text-align: center;
                    font-weight: 500;
                    font-weight: bold;
                }

                .input-fields {
                    display: block;
                    background-color: white;
                    margin : 0 auto;
                    width: 100%;
                    padding: 12px 20px;
                    margin: 8px 0;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-sizing: border-box;
                }

            `}</style>
        </React.Fragment>
    );  
}

export default SortingFiltering;