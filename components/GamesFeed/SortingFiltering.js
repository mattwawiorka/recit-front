import React, { useState, useCallback } from 'react';
import GameSource from './GameSource';
import classNames from 'classnames';
import Select from 'react-select';
import { CATEGORIES, SPORT_SEARCH, BOARD_SEARCH, CARD_SEARCH, VIDEO_SEARCH } from '../../lib/lists';

function SortingFiltering(props) {

    const initialBounds = [
        props.currentLoc[0] + 0.08812489109,
        props.currentLoc[1] + 0.1095172763,
        props.currentLoc[0] - 0.08827372991,
        props.currentLoc[1] - 0.1095172763
    ];

    const [showPanel, setShowPanel] = useState();
    const [category, setCategory] = useState("ALL");
    const [sport, setSport] = useState("ALL");
    const [showWriteIn, setShowWriteIn] = useState(false)
    const [startDate, setStartDate] = useState("ALL");
    const [openSpots, setOpenSpots] = useState("0");
    const [bounds, setBounds] = useState(initialBounds);
    const [zoom, setZoom] = useState(12);

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
                    category={category}
                    sport={sport} 
                    startDate={startDate} 
                    openSpots={openSpots}
                    currentLoc={props.currentLoc} 
                    getMapBounds={setMapBounds}
                    bounds={bounds}
                    zoom={zoom}
                />
            </div>
                
            <button onClick={() => setShowPanel(!showPanel)} className={btnClass}>
                <h1 style={{ writingMode: "vertical-rl" }}>+</h1>
            </button>

            <aside className={panelClass}>
                <form className='sorting-filtering'>
                    <div className="form-group">
                        <label className="header">Category</label>
                        <Select 
                            onChange={category => setCategory(category.value)} 
                            options={CATEGORIES}
                            placeholder="All"
                        />
                    </div>
                    <div className="form-group">
                        {category === "SPORT" || category === "ALL" ?
                        <label className="header">
                            Sport
                            <Select 
                                onChange={(sport) => {
                                    setSport(sport.value)
                                    if (sport.value === "OTHER") {
                                        setShowWriteIn(true)
                                    }
                                }}
                                options={SPORT_SEARCH}
                                placeholder="All"
                            />
                        </label>
                        :
                        null}
                        {category === "BOARD" ?
                        <label className="header">
                            Game
                            <Select 
                                onChange={(sport) => {
                                    setSport(sport.value)
                                    if (sport.value === "OTHER") {
                                        setShowWriteIn(true)
                                    }
                                }}
                                options={BOARD_SEARCH}
                                placeholder="All"
                            />
                        </label>
                        :
                        null}
                        {category === "CARD" ?
                        <label className="header">
                            Game
                            <Select 
                                onChange={(sport) => {
                                    setSport(sport.value)
                                    if (sport.value === "OTHER") {
                                        setShowWriteIn(true)
                                    }
                                }}
                                options={CARD_SEARCH}
                                placeholder="All"
                            />
                        </label>
                        :
                        null}
                        {category === "VIDEO" ?
                        <label className="header">
                            Game
                            <Select 
                                onChange={(sport) => {
                                    setSport(sport.value)
                                    if (sport.value === "OTHER") {
                                        setShowWriteIn(true)
                                    }
                                }}
                                options={VIDEO_SEARCH}
                                placeholder="All"
                            />
                        </label>
                        :
                        null}
                        {showWriteIn ?
                        <label className="header">
                            What will you be playing
                            <input
                                onChange={(e) => setSport(e.target.value)} 
                                type="text" 
                                className="input-fields"
                                placeholder="What game will you be playing"
                            />
                        </label>
                        :
                        null}
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
                        <label className="header">Min Open Spots</label>
                        <input 
                            type="number"
                            className="input-fields"
                            value={openSpots}
                            onChange={e => setOpenSpots(e.target.value)} 
                            min="0"
                            max="31"
                        />
                    </div>
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