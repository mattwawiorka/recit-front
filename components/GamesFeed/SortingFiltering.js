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

    const [showPanel, setShowPanel] = useState(); // Must be left undefined for animations to work
    const [category, setCategory] = useState("ALL");
    const [sport, setSport] = useState("ALL");
    const [showWriteIn, setShowWriteIn] = useState(false)
    const [startDate, setStartDate] = useState("ALL");
    const [openSpots, setOpenSpots] = useState("0");
    const [bounds, setBounds] = useState(initialBounds);
    const [zoom, setZoom] = useState(12);
    // For small viewports (mobile)
    const [viewMode, setViewMode] = useState(true); // True = show map, False = show list

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

    // For view select
    const mapSelect = classNames({
        "checked": viewMode,
        "unchecked": !viewMode
    })
    const listSelect = classNames({
        "checked": !viewMode,
        "unchecked": viewMode
    })

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
                    viewMode={viewMode}
                />
            </div>

            <div className="view-select-container">
                <label className={mapSelect}>
                    <input type="radio" name="View" value="MAP" 
                        className="view-button"
                        checked={viewMode}
                        onChange={() => setViewMode(true)} />
                    Map 
                </label>
                <label className={listSelect}>
                    <input type="radio" name="View" value="LIST" 
                        className="view-button"
                        checked={!viewMode}
                        onChange={() => setViewMode(false)} />
                    List
                </label>
            </div>
                
            <button onClick={() => setShowPanel(!showPanel)} className={btnClass}>
                <h1 style={{ writingMode: "vertical-rl" }}>+</h1>
            </button>

            <aside className={panelClass}>
                <form className='sorting-filtering'>
                    <div className="form-group">
                        <label className="header select-header">Category</label>
                        <Select 
                            onChange={category => setCategory(category.value)} 
                            options={CATEGORIES}
                            placeholder="All"
                            className="input-fields"
                        />
                    </div>
                    <div className="form-group">
                        {category === "SPORT" || category === "ALL" ?
                        <React.Fragment>
                            <label className="header select-header">Sport</label>
                            <Select 
                                onChange={(sport) => {
                                    setSport(sport.value)
                                    if (sport.value === "OTHER") {
                                        setShowWriteIn(true)
                                    }
                                }}
                                options={SPORT_SEARCH}
                                placeholder="All"
                                className="input-fields"
                            />
                        </React.Fragment>
                        :
                        null}
                        {category === "BOARD" ?
                        <React.Fragment>
                            <label className="header select-header">Game</label>
                            <Select 
                                onChange={(sport) => {
                                    setSport(sport.value)
                                    if (sport.value === "OTHER") {
                                        setShowWriteIn(true)
                                    }
                                }}
                                options={BOARD_SEARCH}
                                placeholder="All"
                                className="input-fields"
                            />
                        </React.Fragment>
                        :
                        null}
                        {category === "CARD" ?
                        <React.Fragment>
                            <label className="header select-header">Game</label>
                            <Select 
                                onChange={(sport) => {
                                    setSport(sport.value)
                                    if (sport.value === "OTHER") {
                                        setShowWriteIn(true)
                                    }
                                }}
                                options={CARD_SEARCH}
                                placeholder="All"
                                className="input-fields"
                            />
                        </React.Fragment>
                        :
                        null}
                        {category === "VIDEO" ?
                        <React.Fragment>
                            <label className="header select-header">Game</label>
                            <Select 
                                onChange={(sport) => {
                                    setSport(sport.value)
                                    if (sport.value === "OTHER") {
                                        setShowWriteIn(true)
                                    }
                                }}
                                options={VIDEO_SEARCH}
                                placeholder="All"
                                className="input-fields"
                            />
                        </React.Fragment>
                        :
                        null}
                        {showWriteIn ?
                        <input
                            onChange={(e) => setSport(e.target.value)} 
                            type="text" 
                            className="input-fields"
                            placeholder="What will you be playing"
                        />
                        :
                        null}
                    </div>

                    <div className="form-group half-group">
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

                    <div className="form-group half-group">
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
                    height: auto; 
                    padding: 1.2em 1.2em 0 0.5em;
                    overflow-x: hidden;
                }

                .view-select-container {
                    display: none;
                    box-sizing: border-box;
                    position: absolute;
                    z-index: 5;
                    transform: translate(-50%, -50%);
                    left: 50%;
                    top: 13%;
                }

                .view-button {
                    position: absolute;
                    left: -9999em;
                    top: -9999em;
                }

                .view-select-container > label {
                    display: inline-block;
                    font-size: 1em;
                    font-weight: bold;
                    text-align: center;
                    width: 75px;
                    cursor: pointer;
                    padding: 0.25em;
                    border: 2px solid var(--darkermatter);
                    margin-right: -1px;
                }
    
                .view-select-container > label:first-of-type {
                    border-radius: 4px 0 0 4px;
                }
    
                .view-select-container > label:last-of-type {
                    border-radius: 0 4px 4px 0;
                }

                .unchecked {
                    color: var(--darkermatter);
                    background-color: var(--greyapple);
                }
    
                .checked {
                    color: white;
                    background-color: var(--darkermatter);
                }

                .sort-toggle-button {
                    position: absolute;
                    transform: translate(0%, -50%);
                    top: 50%;
                    right: 0;
                    height: 300px;
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
                    z-index: 6;
                }

                .btn-left {
                    animation-duration: 1.5s;
                    animation-name: slide-left;
                    right: 395px;
                }

                .btn-right {
                    animation-duration: 1.5s;
                    animation-name: slide-right;
                }

                aside {
                    position: absolute;
                    // float: right;
                    right: 0;
                    top: 100px;
                    height: 80vh;
                    min-height: max-content;
                    width: 0px;
                    overflow: hidden;
                    z-index: 6;
                }

                .aside-in {
                    // right: -75%;
                    width: 400px;
                    // right: 0px;
                    animation-duration: 1.5s;
                    animation-name: slidein;   
                }

                .aside-out {
                    animation-duration: 1.5s;
                    animation-name: slideout;
                }

                @keyframes slide-left {
                    from {
                        right: 0;
                    } 
                    
                    to {
                        right: 395px;
                    }
                }

                @keyframes slide-right {
                    from {
                        right: 395px;
                    } 
                    
                    to {
                        right: 0;
                    }
                }

                @keyframes slidein {
                    from {
                        width: 0;
                    } 
                    
                    to {
                        width: 400px;
                    }
                }

                @keyframes slideout {
                    from {
                        width: 400px;
                    } 
                    
                    to {
                        width: 0;
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
                    word-break: keep-all;
                    white-space: nowrap;
                    overflow: hidden;
                }

                .form-group {
                    vertical-align: middle;
                    padding: 5px 0 5px 0;
                }

                .header {
                    display: block;
                    color: white;
                    text-align: center;
                    font-weight: 500;
                    font-weight: bold;
                }

                .select-header {
                    padding-bottom: 5px;
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
                    height: 38px;
                }

                @media only screen and (max-width: 768px) {
                    .game-feed-container {
                        padding: 20px 40px;
                        padding-right: 0;
                    }
                }

                @media only screen and (max-width: 600px) {
                    .game-feed-container {
                        padding: 0;
                        padding-right: 0;
                    }

                    .view-select-container {
                        display: block;
                    }

                    .sort-toggle-button {
                        height: 200px;
                    }

                    .btn-left {
                        right: 330px;
                    }

                    @keyframes slide-left {
                        from {
                            right: 0;
                        } 
                        
                        to {
                            right: 330px;
                        }
                    }
    
                    @keyframes slide-right {
                        from {
                            right: 330px;
                        } 
                        
                        to {
                            right: 0;
                        }
                    }

                    aside {
                        top: 60px;
                        height: 100%;
                    }

                    .aside-in {
                        width: 335px;
                    }

                    @keyframes slidein {
                        from {
                            width: 0;
                        } 
                        
                        to {
                            width: 335px;
                        }
                    }
    
                    @keyframes slideout {
                        from {
                            width: 335px;
                        } 
                        
                        to {
                            width: 0;
                        }
                    }
                }

                @media only screen and (max-width: 320px) {
                    .btn-left {
                        right: 285px;
                    }

                    @keyframes slide-left {
                        from {
                            right: 0;
                        } 
                        
                        to {
                            right: 285px;
                        }
                    }
    
                    @keyframes slide-right {
                        from {
                            right: 285px;
                        } 
                        
                        to {
                            right: 0;
                        }
                    }

                    aside {
                        top: 50px;
                    }

                    .aside-in {
                        width: 290px;
                    }

                    @keyframes slidein {
                        from {
                            width: 0;
                        } 
                        
                        to {
                            width: 290px;
                        }
                    }
    
                    @keyframes slideout {
                        from {
                            width: 290px;
                        } 
                        
                        to {
                            width: 0;
                        }
                    }
                }

                @media only screen and (min-height: 730px) {
                    .view-select-container {
                        top: 10%;
                    }
                }

                @media only screen and (max-height: 425px) {
                    .game-feed-container {
                        padding: 0;
                    }

                    .view-select-container {
                        display: block;
                        top: 20%;
                    }

                    .sort-toggle-button {
                        height: 150px;
                    }

                    .aside {
                        top: 10%;
                    }

                    .half-group {
                        display: inline-block;
                        width: 50%;
                        padding-right: 10px;
                    }
                }
            `}</style>
        </React.Fragment>
    );  
}

export default SortingFiltering;