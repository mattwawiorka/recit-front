import React, { useState, useContext } from 'react';
import GameSource from './GameSource';

function SortingFiltering(props) {
    // const loggedIn = useContext(AuthContext)
    const [sport, setSport] = useState("All");
    const [startDate, setStartDate] = useState("All");

    // let footballSelected;
    // sport === "Football" ? footballSelected="selected" : footballSelected=null;

    return (
        <React.Fragment>
            <div className="container">
                <GameSource loggedIn={props.loggedIn} sport={sport} startDate={startDate} />

                <aside id="sorting-panel">
                    <button onClick={props.toggleSortingFiltering} id="sort-toggle-button">
                        <h1 style={{ writingMode: "vertical-rl" }}>Search</h1>
                    </button>

                    {props.showPanel ?
                    <form id="sorting-filtering">
                        <div className="form-group">
                            <h2>Filter</h2>
                            <label className="header">Sport</label>
                            <select 
                                onChange={e => setSport(e.target.value)} 
                                className="input-fields"
                            >
                                <option value="All">All</option>
                                <option value="Tennis" selected={sport === "Tennis" ? true : false}>Tennis</option>
                                <option value="Basketball" selected={sport === "Basketball" ? true : false}>Basketball</option>
                                <option value="Football" selected={sport === "Football" ? true : false}>Football</option>
                                <option value="Volleyball" selected={sport === "Volleyball" ? true : false}>Volleyball</option>
                                <option value="Softball" selected={sport === "Softball" ? true : false}>Softball</option>
                                <option value="Baseball" selected={sport === "Baseball" ? true : false}>Baseball</option>
                                <option value="Field Hockey" selected={sport === "Field Hockey" ? true : false}>Field Hockey</option>
                                <option value="Table Tennis" selected={sport === "Table Tennis" ? true : false}>Table Tennis</option>
                                <option value="Soccer" selected={sport === "Soccer" ? true : false}>Soccer</option>
                                <option value="Badminton" selected={sport === "Badminton" ? true : false}>Badminton</option>
                                <option value="Golf" selected={sport === "Golf" ? true : false}>Golf</option>
                                <option value="Disc Golf" selected={sport === "Disc Golf" ? true : false}>Disc Golf</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="header">Start Date</label>
                            <select 
                                onChange={e => setStartDate(e.target.value)} 
                                className="input-fields"
                            >
                                <option value="All">All</option>
                                <option value="Today">Today</option>
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

                #sorting-panel {
                    display: flex;
                    position: sticky;
                    padding-left: 1em;
                    top: 50%;
                    left: 100%;
                }

                #sort-toggle-button {
                    position: sticky;
                    top: 50%;
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

                #sorting-filtering {
                    display: block;
                    width: 100%;
                    padding: 1em;
                    background-color: var(--greenapple);
                    border-radius: 15px;
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