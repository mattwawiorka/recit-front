import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';
import PlaceSearch from '../GoogleMaps/PlaceSearch';
import classNames from 'classnames';
import dateTool from '../../lib/dateTool';

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
    const [sport, setSport] = useState(props.sport ? (props.sport.charAt(0) + props.sport.substring(1).toLowerCase()) : "");
    const [spots, setSpots] = useState(props.spots || 4);
    const [spotsReserved, setSpotsReserved] = useState(props.spotsReserved || 0);
    const [venue, setVenue] = useState(props.venue || "");
    const [address, setAddress] = useState(props.address || "");
    const [coords, setCoords] = useState(props.coords || []);
    const [description, setDescription] = useState(props.description || "");
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
        "title-input": true,
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

        <datalist id="sports">
            <option value="Tennis" />
            <option value="Basketball" />
            <option value="Football" />
            <option value="Volleyball" />
            <option value="Softball" />
            <option value="Baseball" />
            <option value="Field Hockey" />
            <option value="Table Tennis" />
            <option value="Soccer" />
            <option value="Badminton" />
            <option value="Golf" />
            <option value="Disc Golf" />
        </datalist>

        <div className={containerClass}>

            <span 
                className="alert"
            >
                {errorsDisplay}
            </span>


            <form 
                className="gameForm"
                onSubmit={ e => {
                    e.preventDefault();

                    let gameInput = {
                        title: title,
                        dateTime: dateTime,
                        endDateTime: endDateTime,
                        venue: venue,
                        address: address,
                        coords: coords,
                        sport: sport.toUpperCase().trim(),
                        description: description,
                        spots: parseInt(spots),
                        spotsReserved: parseInt(spotsReserved),
                        public: isPublic
                    }
                
                    let variables = props.id ? { id: props.id, gameInput: gameInput } : { gameInput: gameInput }

                    createGame({ variables: variables })
                    .then(response => {
                        console.log(response)
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
            >
                {/* This prevents implicit submission of the form (pressing enter) */}
                <button type="submit" disabled style={{display: "none"}} aria-hidden="true"></button>
                
                <div className="section" id="titleSportForm">
                    <div className="form-group">
                        <label id="title" className="header">Title</label>
                        <button onClick={props.exitFunc} className="exit-btn" type="button">X</button>
                        <input
                            onChange={(e) => setTitle(e.target.value)} 
                            type="text" 
                            className={titleClass}
                            value={title}
                            minLength="4"
                            placeholder="Give your sporting event a unique title"
                            autoComplete="off" 
                        />
                        <button 
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsPublic(!isPublic);
                            }} 
                            className={publicBtnClass}
                        >{isPublic ? "Public" : "Private"}</button>
                    </div>
                    
                </div>

                <div className="section">
                    <div className="form-group split-form">
                        <label className="header">Sport</label>
                        <input 
                            onChange={(e) => setSport(e.target.value)} 
                            list="sports"
                            type="text" 
                            autoCapitalize="word"
                            className={sportClass}
                            value={sport} 
                            placeholder="Pick a sport from the list or specify your own"
                            autoComplete="off"
                        />
                    </div>
                    <div className="form-group split-form-half">
                        <label className="header">No. Players</label>
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
                    <div className="form-group split-form-half">
                        <label className="header">Reserve Spots</label>
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
                </div>

                <div className="section" id="descriptionForm">
                    <div className="form-group">
                        <label className="header">Description</label>
                        <div
                            ref={descriptionInput}
                            className={descriptionClass}
                            contentEditable="true" 
                            placeholder="Let's play!"                 
                            autoComplete="off"
                        >
                        </div>
                    </div>
                </div>

                <div className="section" id="locationForm">
                    <div className="form-group" id="addressForm">
                        <label className="header">Address</label>
                        <PlaceSearch
                            onChangeFunc={handleGooglePlace}
                            prevPlace={props.address}
                            needsInput={needsInput && address == "" || invalidAddress}
                        />
                    </div>
                </div>
                
                <div className="section" id="dateTimeForm">
                    <label className="header" id="dateTimeLabel">Date/Time</label>
                    <div className="form-group small-form" id="startDateForm">
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
                    <div className="form-group small-form" id="stateTimeForm">
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
                        <div className="form-group small-form" id="endDateForm">
                            <label className="header">End Date</label>
                            <input 
                                id="endDateInput"
                                onChange={(e) => setEndDate(e.target.value)} 
                                type="date" 
                                className={endClass}
                                value={endDate} 
                            />
                        </div>
                        <div className="form-group small-form" id="endTimeForm">
                            <label className="header">End Time</label>
                            <input 
                                id="endTimeInput"
                                onChange={(e) => setEndTime(e.target.value)} 
                                type="time" 
                                className={endClass}
                                value={endTime} 
                            />
                        </div>
                    </div>
                </div>
                <input type="submit" value={props.id ? "Update Game" : "Create Game!"} />
            </form>


            <br />

        </div>
        <style jsx>{`
            .create-game-container {
                z-index: 11;
                display: inline-block;
                height: auto;
                max-height: 75vh;
                background-color: white;
                border-radius: 10px;
                padding: 10px;
                animation-duration: 1.5s;
                animation-name: fadein;
                overflow: auto;
            }

            .create {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 40vw;
                max-width: 50vw;
            }

            .update {
                display: block;
                margin-top: 2em;
                width: 40vw;
            }

            @keyframes fadein {
                from {
                    opacity: 0;
                } 
                
                to {
                    opacity: 1;
                }
            }

            .gameForm {
                width: 100%;
                height: 100%;
                padding: 10px
                display: inline-block;
            }

            .section {
                padding: 5px;
                display: block;
            }

            .header {
                display: block;
                color: #4b4f56;
                // color: var(--darkmatter);
                padding-left: 5px;
                font-weight: 500;
                font-weight: bold;
            }

            #title {
                display: inline-block;
                width: 95%;
            }

            .exit-btn {
                background: none;
                border: none;
                text-align: center;
                outline: none;
                font-weight: bold;
                color: #4b4f56;
                cursor: pointer;
            }

            .form-group {
                vertical-align: middle;
                padding-top: 5px;
            }

            .input-fields {
                display: inline-block;
                margin : 0 auto;
                width: 100%;
                padding: 12px 20px;
                margin: 8px 0;
                border: 1px solid #ccc;
                border-radius: 4px;
                box-sizing: border-box;
                outline: none;
            }

            .needs-input {
                outline: solid;
                outline-color: var(--greenapple);
            }

            .title-input {
                max-width: 60%;
            }

            .btn-public {
                margin-left: 15%;
                height: 2.5em;
                width: 6vw;
            }

            .private {
                color: var(--darkermatter);
                background-color: var(--greyapple);
            }

            .split-form {
                width: 50%;
                display: inline-block;
                padding-left: 5px;
                padding-right: 5px;
            }

            .split-form-half {
                width: 25%;
                display: inline-block;
                padding-left: 5px;
                padding-right: 5px;
            }

            .input-fields[placeholder]:empty:before {
                content: attr(placeholder);
                cursor: text;
                color: #555; 
                font-style: italic;
            }

            .small-form {
                width: 40%;
                display: inline-block;
                padding-left: 5px;
                padding-right: 5px;
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
            }

            .show {
                display: block;
            }

            input[type=submit] {
                display: block;
                margin-left: auto;
                margin-right: auto;
                width: 50%;
                background-color: var(--darkermatter);
                color: white;
                padding: 14px 20px;
                margin-top: 12px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }

            input[type=submit]:hover {
                background-color: var(--darkmatter);
            }

            .error {
                text-align: center;
            }

            // .alert {
            //     color: black;
            //     margin-bottom: 15px;
            //     text-align: center;
            // }

            ::-webkit-input-placeholder {
                font-style: italic;
            }

            @media only screen and (max-width: 1000px) {
                .toggle-endtime:after {  
                    content: "";
                }

                .toggle-endtime {
                    font-size: 1.5em;
                    text-align: center;
                }
            }
        `}</style>
        </React.Fragment>
    );

}

export default CreateGameForm;