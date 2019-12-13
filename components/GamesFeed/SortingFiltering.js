import React, { useState, useCallback } from 'react';
import GameSource from './GameSource';

function SortingFiltering(props) {
    // const loggedIn = useContext(AuthContext)
    const [sport, setSport] = useState("ALL");
    const [startDate, setStartDate] = useState("ALL");
    const [openSpots, setOpenSpots] = useState("0");
    const [bounds, setBounds] = useState([]);
    const [zoom, setZoom] = useState(12);
    const [sortOrder, setSortOrder] = useState("DATE");

    const setMapBounds = useCallback((mapBounds, mapZoom) => {
        setBounds(mapBounds);
        if (mapZoom) setZoom(mapZoom);
    })

    return (
        <React.Fragment>
            <div className="container">
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

                <aside className='side-panel'>
                    <button onClick={props.toggleSortingFiltering} id="side-panel-toggle-button">
                        <h1 style={{ writingMode: "vertical-rl" }}>+</h1>
                    </button>

                    {props.showPanel ?
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
                                <option value={0}>Show Full Games</option>
                                <option value={1}>1+</option>
                                <option value={2}>2+</option>
                                <option value={3}>3+</option>
                                <option value={4}>4+</option>
                            </select>
                        </div>

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
                        
                    </form>
                    :
                    null}
                </aside>
            </div>

            <style jsx>{`
                .container {
                    display: flex;
                }
                aside {
                    display: flex;
                    position: sticky;
                    padding-left: 1em;
                    left: 100%;
                    height: 85vh;
                    // transition: 1s;
                }
                #side-panel-toggle-button {
                    position: sticky;
                    right: 0;
                    top: 40%;
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
                    // transition: 1s;
                }
                .sorting-filtering {
                    position: sticky;
                    display: block;
                    width: 100%;
                    height: 100%;
                    padding: 1em;
                    background-color: var(--greenapple);
                    border-radius: 15px;
                    // transition: 1s;
                }
                .form-group {
                    vertical-align: middle;
                    padding-top: 5px;
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