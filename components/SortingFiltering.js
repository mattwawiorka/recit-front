import React, { useState, useCallback } from 'react';
import GameSource from './GameSource';

function SortingFiltering(props) {
    // const loggedIn = useContext(AuthContext)
    const [sport, setSport] = useState("All");
    const [startDate, setStartDate] = useState("All");
    const [bounds, setBounds] = useState([])

    const setMapBounds = useCallback((mapBounds) => {
        setBounds(mapBounds)
    })

    return (
        <React.Fragment>
            <div className="container">
                <GameSource 
                    loggedIn={props.loggedIn} 
                    sport={sport} 
                    startDate={startDate} 
                    currentLoc={props.currentLoc} 
                    getMapBounds={setMapBounds}
                    bounds={bounds}
                />

                <aside className='side-panel'>
                    <button onClick={props.toggleSortingFiltering} id="side-panel-toggle-button">
                        <h1 style={{ writingMode: "vertical-rl" }}>+</h1>
                    </button>

                    {props.showPanel ?
                    <form className='sorting-filtering'>
                        <div className="form-group">
                            <h2>Filter</h2>
                            <label className="header">Sport</label>
                            <select 
                                onChange={e => setSport(e.target.value)} 
                                className="input-fields"
                                value={sport}
                            >
                                <option value="All">All</option>
                                <option value="Tennis">Tennis</option>
                                <option value="Basketball" >Basketball</option>
                                <option value="Football">Football</option>
                                <option value="Volleyball" >Volleyball</option>
                                <option value="Softball">Softball</option>
                                <option value="Baseball">Baseball</option>
                                <option value="Field Hockey">Field Hockey</option>
                                <option value="Table Tennis">Table Tennis</option>
                                <option value="Soccer">Soccer</option>
                                <option value="Badminton">Badminton</option>
                                <option value="Golf">Golf</option>
                                <option value="Disc Golf">Disc Golf</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="header">Start Date</label>
                            <select 
                                onChange={e => setStartDate(e.target.value)} 
                                className="input-fields"
                                value={startDate}
                            >
                                <option value="All">All</option>
                                <option value="Today" >Today</option>
                                <option value="Tomorrow">Tomorrow</option>
                                <option value="LaterThisWeek">Later This Week</option>
                                <option value="NextWeek">Next Week</option>
                                <option value="Later">Later</option>
                            </select>
                        </div>

                        <h2>Sort</h2>
                        
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