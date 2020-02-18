import React, { useState, useEffect, useRef, useCallback } from 'react';
import Select from 'react-select';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';
import PlaceSearch from '../GoogleMaps/PlaceSearch';
import classNames from 'classnames';
import dateTool from '../../lib/dateTool';
import { SPORT, BOARD, CARD, VIDEO } from '../../lib/lists';
import CategorySelect from './CategorySelect';
// import SportSelect from './SportSelect';

const CREATE_GAME = gql`
    mutation CreateGame($gameInput: gameInput) {
        createGame(gameInput: $gameInput) 
        {
            id
        }
    }
`;

const UPDATE_GAME = gql`
    mutation UpdateGame($id: ID!, $gameInput: gameInput) {
        updateGame(id: $id, gameInput: $gameInput) 
        {
            id
        }
    }
`;

function CreateGameForm(props) {
    

    const [title, setTitle] = useState(props.title || "");
    const [isPublic, setIsPublic] = useState(props.isPublic === false ? false : true);
    const [date, setDate] = useState(props.date || "");
    const [time, setTime] = useState(props.time || "");
    const [endDate, setEndDate] = useState(props.endDate || "");
    const [endTime, setEndTime] = useState(props.endTime || "");
    const [category, setCategory] = useState(props.category || "SPORT");
    const [showWriteIn, setShowWriteIn] = useState(false)
    const [sport, setSport] = useState(props.sport || "");
    const [spots, setSpots] = useState(props.spots || 4);
    const [spotsReserved, setSpotsReserved] = useState(props.spotsReserved || 0);
    const [venue, setVenue] = useState(props.venue || "");
    const [address, setAddress] = useState(props.address || "");
    const [coords, setCoords] = useState(props.coords || []);
    const [description, setDescription] = useState(props.description || "Let's play!");
    const [errors, setErrors] = useState([]);
    const [showEnd, setShowEnd] = useState(false);
    const [loading, setLoading] = useState(true);

    const descriptionInput = useRef(null);
    const endInput = useRef(null);

    useEffect(() => {
        if (!props.id) {
            const defaultStart = dateTool.generateStartTime();
            setDate(defaultStart[0]);
            setTime(defaultStart[1]);
            setEndDate(defaultStart[0]);
            setEndTime(defaultStart[2]);
        }

        descriptionInput.current.innerText = new String(description);

        descriptionInput.current.addEventListener("input", e => {
            setDescription(e.target.innerText)
        });

        setLoading(false);

    }, [])


    const errorsDisplay = [];
    errors.map( (error, index) => {
        if (!needsInput) needsInput = error.message === "Please fill in all fields";
        if (!invalidAddress) invalidAddress = error.field === "address";
        if (!invalidSpots) invalidSpots = error.field === "spots";
        if (!invalidDescrip) invalidDescrip = error.field === "description";
        if (!invalidDate) invalidDate = error.field === "date";
        if (!invalidEnd) invalidEnd = error.field === "endDate";
        
        if (error.data) {
            error.data.map( (error, index) => {
                errorsDisplay.push(
                    <li key={index} className="error">
                        {error.message}
                    </li>
                );
            })
        } else {
            errorsDisplay.push(
                <li key={index} className="error">
                    {error.message}
                </li>
            );
        }
    });


    const handleGooglePlace = useCallback((place) => {
        if (place.formatted_address) {
            setAddress(place.formatted_address);
            setCoords([place.geometry.location.lat(), place.geometry.location.lng()]);
            setVenue(place.name)
        } else {
            setErrors([{ message: "Please select a valid address" }]);
        }
    });

    const dateTime = new Date(date + "T" + time);
    let needsInput, invalidAddress, invalidSpots, invalidDescrip, invalidDate, invalidEnd;
    needsInput = invalidAddress = invalidSpots = invalidDescrip = invalidDate = invalidEnd = false;

    const endDateTime = new Date(endDate + "T" + endTime);

    // Need to have at least 1 public spot open in public game 
    const maxReservable = Math.max(spots - (props.playersCount ? props.playersCount : 1) - 1, 0);

    

    const publicBtnClass = classNames({
        "btn-public": true,
        "private": !isPublic
    })
    const containerClass = classNames({
        "create-game-container": true,
        "create": typeof props.id === 'undefined',
        "update": !(typeof props.id === 'undefined')
    })
    const titleClass = classNames({
        "input-fields": true,
        "needs-input": needsInput && title == ""
    })
    const sportClass = classNames({
        "input-fields": true,
        "needs-input": needsInput && sport == ""
    })
    const playersClass = classNames({
        "input-fields": true,
        "needs-input": needsInput && spots == "" || invalidSpots
    })
    const descriptionClass = classNames({
        "input-fields": true,
        "description": true,
        "needs-input": needsInput && description == "" || invalidDescrip
    })
    const dateClass = classNames({
        "input-fields": true,
        "needs-input": needsInput && date == "" || invalidDate
    })
    const endClass = classNames({
        "input-fields": true,
        "needs-input": invalidEnd
    })
    const timeClass = classNames({
        "input-fields": true,
        "needs-input": needsInput && time == ""
    })
    const endDateTimeClass = classNames({
        "endDateTime": true,
        "show": showEnd
    })

    const [createGame] = useMutation(props.id ? UPDATE_GAME : CREATE_GAME);

    return (
        <React.Fragment>
        <div className={containerClass}>
            <span 
                className="alert"
            >
                {errorsDisplay}
            </span>

            <button onClick={props.exitFunc} className="exit-btn" type="button">X</button>

            <div className="form">
            <article>
                <div className="form-group title">
                    <label>Title</label>
                    <input
                        onChange={(e) => setTitle(e.target.value)} 
                        type="text" 
                        className={titleClass}
                        value={title}
                        minLength="4"
                        maxLength="50"
                        placeholder="Give your game a unique title"
                        autoComplete="off" 
                    />
                </div>
                <div className="form-group public">
                    <button type="button" className={publicBtnClass}
                        onClick={(e) => {
                            e.preventDefault();
                            setIsPublic(!isPublic);
                        }} 
                    >{isPublic ? "Public" : "Private"}
                    </button>
                </div>
            </article>

            <article className="sidebar">
                <div className="form-group category-select">
                    <CategorySelect 
                        currentSelection={category}
                        makeSelection={(selection) => {
                            setSport("");
                            setCategory(selection)
                        }}
                    />
                </div>
            </article>

            <article className="sidebar sport-spots">
                <div className="form-group sport-select">
                    {category === "SPORT" ?
                    <React.Fragment>
                        <label className="header sport-header">Sport</label>
                        <Select className={sportClass}
                            onChange={(sport) => {
                                setSport(sport.value)
                                if (sport.value === "OTHER") {
                                    setShowWriteIn(true)
                                }
                            }}
                            options={SPORT}
                            placeholder="Select sport"
                            defaultInputValue={sport}
                        />
                    </React.Fragment>
                    :
                    null}

                    {category === "BOARD" ?
                    <React.Fragment>
                    <label className="header sport-header">Game</label>
                        <Select className={sportClass}
                            onChange={(sport) => {
                                setSport(sport.value)
                                if (sport.value === "OTHER") {
                                    setShowWriteIn(true)
                                }
                            }}
                            options={BOARD}
                            placeholder="Select sport"
                            defaultInputValue={sport}
                        />
                    </React.Fragment>
                    :
                    null}

                    {category === "CARD" ?
                    <React.Fragment>
                    <label className="header sport-header">Game</label>
                        <Select className={sportClass}
                            onChange={(sport) => {
                                setSport(sport.value)
                                if (sport.value === "OTHER") {
                                    setShowWriteIn(true)
                                } 
                            }}
                            options={CARD}
                            placeholder="Select sport"
                            defaultInputValue={sport}
                        />
                    </React.Fragment>
                    :
                    null}

                    {category === "VIDEO" ?
                    <React.Fragment>
                    <label className="header sport-header">Game</label>
                        <Select className={sportClass}
                            onChange={(sport) => {
                                setSport(sport.value)
                                if (sport.value === "OTHER") {
                                    setShowWriteIn(true)
                                }
                            }}
                            options={VIDEO}
                            placeholder="Select sport"
                            defaultInputValue={sport}
                        />
                    </React.Fragment>
                    :
                    null}

                    {showWriteIn ?
                    <input
                        onChange={(e) => setSport(e.target.value)} 
                        type="text" 
                        className={sportClass}
                        placeholder="What will you be playing"
                    />
                    :
                    null} 
                </div>

                <div className="form-group spots">
                    <label >Players</label>
                    <input
                        className={playersClass}
                        onChange={(e) => {
                            setSpots(e.target.value);
                            setSpotsReserved(0);
                        }}
                        type="number"
                        autoComplete="off"
                        min={props.playersCount > 1 ? props.playersCount : 2}
                        max="32"
                        value={spots}
                    />
                </div>

                {isPublic ? 
                <div className="form-group spots">
                    <label >Reserved</label>
                    <input
                        className={playersClass}
                        onChange={(e) => setSpotsReserved(e.target.value)}
                        type="number"
                        autoComplete="off"
                        min="0"
                        max={maxReservable}
                        value={spotsReserved}
                    />
                </div>
                :
                null}
            </article>

            <article>
                <div className="form-group description">
                    <label >Description</label>
                    <div
                        ref={descriptionInput}
                        className={descriptionClass}
                        contentEditable="true" 
                        placeholder="Let's play!"                 
                        autoComplete="off"
                    />
                </div>
            </article>

            <article>
                <i className="material-icons">public</i>
                <div className="form-group address">
                    <label >Address</label>
                    <PlaceSearch
                        onChangeFunc={handleGooglePlace}
                        prevPlace={props.address}
                        needsInput={needsInput && address == "" || invalidAddress}
                    />
                </div>
            </article>
            
            <article>
                <i className="material-icons">calendar_today</i>
    
                <div className="form-group datetime">
                <label>Date/Time</label>
                    <input 
                        onChange={(e) => {
                            setDate(e.target.value);
                            setEndDate(e.target.value);
                        }} 
                        type="date" 
                        className={dateClass}
                        value={date} 
                        autoComplete="off"
                    />
                </div>
                <div className="form-group time datetime">
                    <input 
                        onChange={(e) => {
                            setTime(e.target.value);
                            let d = new Date();
                            d.setHours(parseInt(e.target.value.split(":")[0]) + 2)
                            d.setMinutes(parseInt(e.target.value.split(":")[1]))
                            let endTime = (d.getHours() < 10 ? '0' + d.getHours().toString() : d.getHours().toString()) + ":" + (d.getMinutes() < 10 ? '0' + d.getMinutes().toString() : d.getMinutes().toString());
                            setEndTime(endTime);
                        }} 
                        type="time" 
                        className={timeClass}
                        value={time} 
                        autoComplete="off"
                    />
                </div>

                <a 
                    className="toggle-endtime"
                    href="#" 
                    onClick={() => setShowEnd(!showEnd)}
                >+</a>

                <div className={endDateTimeClass} ref={endInput}>
                    <div className="form-group datetime">
                        <label >End Date</label>
                        <input 
                            onChange={(e) => setEndDate(e.target.value)} 
                            type="date" 
                            className={endClass}
                            value={endDate} 
                        />
                    </div>
                    <div className="form-group datetime">
                        <label >End Time</label>
                        <input 
                            onChange={(e) => setEndTime(e.target.value)} 
                            type="time" 
                            className={endClass}
                            value={endTime} 
                        />
                    </div>
                </div>
            </article>
            </div>

            {(!props.id && title && sport && spots && description && address && date && time && endDate && endTime) ||
             (props.id && (title != props.title || isPublic != props.isPublic || category != props.category || sport != props.sport || spots != props.spots || spotsReserved != props.spotsReserved || description != props.description || address != props.address || date != props.date || time != props.time || endDate != props.endDate || endTime != props.endTime)) ?
            <button className="btn-submit-game"
                onClick={() => {
                    let gameInput = {
                        title: title,
                        dateTime: dateTime,
                        endDateTime: endDateTime,
                        venue: venue,
                        address: address,
                        coords: coords,
                        category: category,
                        sport: sport.toUpperCase().trim(),
                        description: description,
                        spots: parseInt(spots),
                        spotsReserved: parseInt(spotsReserved),
                        public: isPublic
                    }
                
                    let variables = props.id ? { id: props.id, gameInput: gameInput } : { gameInput: gameInput }

                    createGame({ variables: variables })
                    .then(response => {
                        if (response.errors) {
                            setErrors(response.errors)
                            return;
                        }
                        if (!props.id) {
                            location.reload();
                            props.exitFunc(); 
                        }
                        else {
                            props.refetch(); 
                            props.exitFunc(); 
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    }); 
                }}
            >{props.id ? "Update Game" : "Create Game!"}
            </button>
            :
            <button className="btn-submit-game incomplete" 
                onClick={() => {
                    if (props.id) {
                        setErrors([{ message: "Make a change to update game" }])
                    } else {
                        setErrors([{ message: "Please fill in all required fields" }])
                    }
                }}
            >{props.id ? "Update Game" : "Create Game!"}</button>}
        </div>
        <style jsx>{`
            .create-game-container {
                z-index: 11;
                display: block;
                position: relative;
                overflow-x: hidden;
                background-color: white;
                border-radius: 10px;
                animation-duration: 1.5s;
                animation-name: fadein;
            }

            .create {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 700px;
                box-shadow: 0 2px 26px rgba(0, 0, 0, .3), 0 0 0 1px rgba(0, 0, 0, .1);
            }

            .update {
                display: block;
                margin-top: 2em;
                width: 40vw;
            }

            .form {
                padding: 10px 20px;
            }

            article {
                display: block;
                padding: 5px 0;
                width: 100%;
            }

            .form-group {
                display: inline-block;
                padding-right: 25px;
                // height: 75px;
                min-height: auto;
                vertical-align: top;
            }

            label {
                display: block;
                color: #4b4f56;
                font-weight: bold;
            }

            .input-fields {
                height: 38px;
                width: 100%;
                margin : 0 auto;
                padding: 12px 20px;
                margin: 8px 0;
                border: 1px solid #ccc;
                border-radius: 4px;
                box-sizing: border-box;
                outline: none;
            }

            .input-fields[placeholder]:empty:before {
                content: attr(placeholder);
                cursor: text;
                color: #555; 
                font-style: italic;
            }

            .needs-input {
                outline: solid;
                outline-color: var(--greenapple);
            }

            .title {
                padding-left: 0;
                width: 440px;
            }

            .title > label {
                float: left;
            }

            .public {
                height: 40px;
                vertical-align: bottom;
                padding-left: 75px;
            }

            .btn-public {
                position: relative;
                top: -8px;
                height: 38px;
                width: 100px;
            }

            .private {
                color: var(--darkermatter);
                background-color: var(--greyapple);
            }

            .category-select {
                padding: 10px 0;
            }

            .sport-header {
                padding-bottom: 7px;
            }

            .sport-select {
                width: 300px;
            }

            .spots {
                vertical-align: top;
                width: 110px;
                padding: 0;
                font-size: 1em;
            }

            .spots > input {
                width: 60px;
                padding: 12px 10px;
            }

            .description {
                min-height: 4em;
                height: auto;
                width: 100%;
            }

            i {
                width: 66px;
                padding: 25px 20px;
            }

            .address {
                width: 380px;
            }

            .time {
                vertical-align: bottom;
            }

            .toggle-endtime {
                display: inline-block;
                font-weight: bold;
                color: var(--greenapple);
                margin-left: 15px;
            }

            .toggle-endtime:after {
                content: "End Time";
            }

            .endDateTime {
                display: none;
                padding-left: 66px;
            }

            .show {
                display: block;
            }

            .btn-submit-game {
                display: block;
                width: 100%;
                height: 70px;
                font-size: 1.5em;
                background-color: var(--darkermatter);
                color: white;
                padding: 14px 20px;
                margin: 12px auto;
                margin-bottom: 0;
                border: none;
                cursor: pointer;
            }

            .incomplete {
                background-color: grey;
            }

            .btn-submit-game:hover {
                background-color: var(--darkmatter);
            }

            .incomplete:hover {
                background-color: grey;
            }

            .error {
                text-align: center;
            }

            .exit-btn {
                position: absolute;
                top: 10px;
                right: 12px;
                background: none;
                border: none;
                text-align: center;
                outline: none;
                font-size: 1.2em;
                font-weight: bold;
                color: #4b4f56;
                color: var(--darkermatter);
                cursor: pointer;
                float: right;
            }

            .exit-btn:hover {
                color: var(--darkmatter);
            }

            @keyframes fadein {
                from {
                    opacity: 0;
                } 
                
                to {
                    opacity: 1;
                }
            }

            ::-webkit-input-placeholder {
                font-style: italic;
            }

            /******************
            *  Laptop/tablet  *
            *******************/
            @media only screen and (max-width: 1024px) {
                .create {
                    width: 600px;
                }

                .title {
                    width: 340px;
                }

                .toggle-endtime:after {  
                    content: "";
                }

                .toggle-endtime {
                    font-size: 2.5em;
                    vertical-align: middle;
                    text-align: center;
                }
            }

            /******************
            *     Mobile      *
            *******************/
            @media only screen and (max-width: 600px) {
                .create {
                    width: 100%;
                    height: calc(100% - 70px);
                    transform: translate(0%, 0%);
                    top: 0%;
                    left: 0%;
                    bottom: 70px;
                }

                .title {
                    width: 190px;
                    padding-right: 20px;
                }

                .public {
                    width: 100px;
                    padding-left: 0;
                }

                .sidebar {
                    display: inline-block;
                    width: max-content;
                    vertical-align: top;
                }

                .category-select {
                    width: 120px;
                }

                .sport-spots {
                    padding-left: 10px;
                }

                .sport-select {
                    display: block;
                    width: 200px;
                }

                .spots {
                    width: 70px;
                    padding: 10px 0;
                }

                .spots > label {
                    content: "Reserved";
                }

                i {
                    display: none;
                }

                .address {
                    width: 100%;
                }

                .datetime {
                    width: 145px;
                    padding-right: 10px;
                }

                .datetime > input {
                    padding: 12px 6px;
                }

                .endDateTime {
                    padding-left: 0;
                }

                .toggle-endtime:after {  
                    content: "";
                }

                .toggle-endtime {
                    margin: 0;
                    width: 10px;
                    vertical-align: bottom;
                }

                .btn-submit-game {
                    position: sticky;
                    // top: calc(100% - 70px);
                    bottom: 0;
                }

                *::-webkit-scrollbar {
                    display: none;
                }
            }

            /******************
            *    Landscape    *
            *******************/
            @media only screen and (max-width: 800px) and (max-height: 425px) {
                .create {
                    position: absolute;
                    transform: translate(0%, 0%);
                    left: 0%;
                    width: 100%;
                    height: calc(100% - 70px);
                    top: 0; 
                }

                .title {
                    width: 400px;
                    padding-right: 20px;
                }

                .btn-submit-game {
                    position: sticky;
                    bottom: 0;
                }
            }

            /******************
            *Lndscpe Xtra Wide*
            *******************/
            @media only screen and (min-width: 800px) and (max-height: 600px) {
                .create {
                    position: absolute;
                    transform: translate(-50%, 0%);
                    width: 50%;
                    height: calc(100% - 70px);
                    top: 0; 
                }

                .title {
                    width: 400px;
                    padding-right: 20px;
                }

                .btn-submit-game {
                    position: sticky;
                    bottom: 0;
                }
            }

            /******************
            *      Tall       *
            *******************/
            @media only screen and (max-width: 600px) and (min-height: 700px) {
                .create {
                    height: calc(100% - 70px - 15%);
                    top: 15%;
                    bottom: 70px;
                }
            }

            /******************
            *      Small      *
            *******************/
            @media only screen and (max-width: 320px), (max-height: 320px) {
                .create {
                    // position: absolute;
                    transform: translate(0%, 0%);
                    left: 0%;
                    width: 100%;
                    bottom: 70px;
                    // height: 250px;
                    top: 0;
                }

                .category-select {
                    width: 250px;
                }

                .sport-spots {
                    padding-left: 0;
                }
            }
        `}</style>
        </React.Fragment>
    );

}

export default CreateGameForm;