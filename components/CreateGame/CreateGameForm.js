import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
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

class CreateGameForm extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            id: this.props.id || "",
            title: this.props.title || "",
            isPublic: this.props.isPublic === false ? false : true,
            date: this.props.date || "",
            time: this.props.time || "",
            endDate: this.props.endDate || "",
            endTime: this.props.endTime || "",
            sport: this.props.sport ? (this.props.sport.charAt(0) + this.props.sport.substring(1).toLowerCase()) : "",
            spots: this.props.spots || 2,
            venue: this.props.venue || "",
            address: this.props.address || "",
            coords: this.props.coords || [],
            description: this.props.description || "",
            errors: [{message: ""}],
            loading: true
        }

        this.descriptionInput = React.createRef();
        this.endDateTime = React.createRef();
    }

    componentDidMount() {
        this.setState({
            loading: false
        })

        if (!this.props.id) {
            const defaultStart = dateTool.generateStartTime();

            this.setState({
                date: defaultStart[0],
                time: defaultStart[1],
                endDate: defaultStart[0],
                endTime: defaultStart[2]
            })
        }

        this.toggleEndTime();

        this.descriptionInput.current.innerText = new String(this.state.description);

        this.descriptionInput.current.addEventListener("input", e => {
            this.setState({
                description: e.target.innerText
            })
        })
    }

    handleChange = (input) => (e) => {
        this.setState({ 
            [input]: e.target.value,
            errors: [{message: ""}] 
        });

        if (input === 'date') {
            this.setState({
                endDate: e.target.value
            })
        }

        if (input === 'time') {
            let d = new Date();
            d.setHours(parseInt(e.target.value.split(":")[0]) + 2)
            d.setMinutes(parseInt(e.target.value.split(":")[1]))
            let endTime = (d.getHours() < 10 ? '0' + d.getHours().toString() : d.getHours().toString()) + ":" + (d.getMinutes() < 10 ? '0' + d.getMinutes().toString() : d.getMinutes().toString());
            this.setState({
                endTime: endTime,
                errors: [{message: ""}]
            })
        }
    };

    handleGooglePlace = (place) => {
        if (place.formatted_address) {
            this.setState({
                address: place.formatted_address,
                coords: [place.geometry.location.lat(), place.geometry.location.lng()],
                venue: place.name
            })
        } else {
            this.setState({
                errors: [{message: "Please select a valid address"}],
            })
        }
    }

    toggleEndTime = () => {
        if (this.state.loading) {
            return;
        }

        if (!this.endDateTime.current.style.display) {
            this.endDateTime.current.style.display = "none";
        }
        if (this.endDateTime.current.style.display === "none") {
            this.endDateTime.current.style.display = "block";
        } else {
            this.endDateTime.current.style.display = "none";
        }
    }

    render() {
        const { title, isPublic, date, time, endDate, endTime, sport, spots, venue, address, coords, description } = this.state;
        const dateTime = new Date(date + "T" + time);
        let needsInput, invalidAddress, invalidSpots, invalidDescrip, invalidDate, invalidEnd;
        needsInput = invalidAddress = invalidSpots = invalidDescrip = invalidDate = invalidEnd = false;

        const endDateTime = new Date(endDate + "T" + endTime);

        const errors = [];
        this.state.errors.map( error => {
            if (!needsInput) needsInput = error.field === "all";
            if (!invalidAddress) invalidAddress = error.field === "address";
            if (!invalidSpots) invalidSpots = error.field === "spots";
            if (!invalidDescrip) invalidDescrip = error.field === "description";
            if (!invalidDate) invalidDate = error.field === "date";
            if (!invalidEnd) invalidEnd = error.field === "endDate";
            errors.push(
                <li key={error.message} className="error">
                    {error.message}
                </li>
            );
        })

        let input = this.props.id ? { id: this.props.id, gameInput: {
            title: title,
            dateTime: dateTime,
            endDateTime: endDateTime,
            venue: venue,
            address: address,
            coords: coords,
            sport: sport.toUpperCase().trim(),
            description: description,
            spots: parseInt(spots),
            public: isPublic
        } } : { gameInput: {
            title: title,
            dateTime: dateTime,
            endDateTime: endDateTime,
            venue: venue,
            address: address,
            coords: coords,
            sport: sport.toUpperCase().trim(),
            description: description,
            spots: parseInt(spots),
            public: isPublic
        } }

        const publicBtnClass = classNames({
            "btn-public": true,
            "private": !this.state.isPublic
        })

        const containerClass = classNames({
            "create-game-container": true,
            "create": typeof this.props.id === 'undefined',
            "update": !(typeof this.props.id === 'undefined')
        })

        const titleClass = classNames({
            "input-fields": true,
            "title-input": true,
            "needs-input": needsInput && this.state.title == ""
        })
        const sportClass = classNames({
            "input-fields": true,
            "needs-input": needsInput && this.state.sport == ""
        })

        const playersClass = classNames({
            "input-fields": true,
            "needs-input": needsInput && this.state.spots == "" || invalidSpots
        })

        const descriptionClass = classNames({
            "input-fields": true,
            "needs-input": needsInput && this.state.description == "" || invalidDescrip
        })

        const dateClass = classNames({
            "input-fields": true,
            "needs-input": needsInput && this.state.date == "" || invalidDate
        })

        const endClass = classNames({
            "input-fields": true,
            "needs-input": invalidEnd
        })

        const timeClass = classNames({
            "input-fields": true,
            "needs-input": needsInput && this.state.time == ""
        })

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
                    style={{ display: (this.state.errors[0].message !== "") ? "" : "none" }}
                >
                    {errors}
                </span>

                <Mutation
                    mutation={this.props.id ? UPDATE_GAME : CREATE_GAME}
                    variables={input}
                >
                { CreateGame => (
                <form 
                    className="gameForm"
                    onSubmit={ e => {
                        e.preventDefault();
                        CreateGame()
                        .then(response => {
                            if (response.errors) {
                                this.setState({
                                    errors: response.errors[0].data
                                })
                                return;
                            }
                            if (!this.props.id) {
                                location.reload();
                                this.props.exitFunc(); 
                            }
                            else {
                                this.props.refetch(); 
                                this.props.exitFunc(); 
                            }
                             
                        })
                        .catch(error => {
                            console.log(error);
                        });
                    }}
                >
                    {/* Prevent implicit submission of the form */}
                    <button type="submit" disabled style={{display: "none"}} aria-hidden="true"></button>
                   
                    <div className="section" id="titleSportForm">
                        <div className="form-group">
                            <label id="title" className="header">Title</label>
                            <button onClick={this.props.exitFunc} className="exit-btn" type="button">X</button>
                            <input
                                onChange={this.handleChange("title")} 
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
                                    this.setState({ isPublic: !this.state.isPublic });
                                }} 
                                className={publicBtnClass}
                            >{this.state.isPublic ? "Public" : "Private"}</button>
                        </div>
                        
                    </div>

                    <div className="section">
                        <div className="form-group split-form">
                            <label className="header">Sport</label>
                            <input 
                                onChange={this.handleChange("sport")} 
                                list="sports"
                                type="text" 
                                autoCapitalize="word"
                                className={sportClass}
                                value={sport} 
                                placeholder="Pick a sport from the list or specify your own"
                                autoComplete="off"
                            />
                        </div>
                        <div className="form-group split-form">
                            <label className="header">No. Players</label>
                            <input
                                className={playersClass}
                                onChange={this.handleChange("spots")}
                                type="number"
                                autoComplete="off"
                                min={this.props.spots || 2}
                                max="32"
                                value={spots}
                            />
                        </div>
                    </div>

                    <div className="section" id="descriptionForm">
                        <div className="form-group">
                            <label className="header">Description</label>
                            <div
                                ref={this.descriptionInput}
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
                                onChangeFunc={this.handleGooglePlace}
                                prevPlace={this.props.address}
                                needsInput={needsInput && this.state.address == "" || invalidAddress}
                            />
                        </div>
                    </div>
                    
                    <div className="section" id="dateTimeForm">
                        <label className="header" id="dateTimeLabel">Date/Time</label>
                        <div className="form-group small-form" id="startDateForm">
                            <input 
                                onChange={this.handleChange("date")} 
                                type="date" 
                                className={dateClass}
                                value={date} 
                                autoComplete="off"
                            />
                        </div>
                        <div className="form-group small-form" id="stateTimeForm">
                            <input 
                                onChange={this.handleChange("time")} 
                                type="time" 
                                className={timeClass}
                                value={time} 
                                autoComplete="off"
                            />
                        </div>

                        <a 
                            className="toggle-endtime"
                            href="#" 
                            onClick={this.toggleEndTime}
                        >+</a>

                        <div className="endDateTime" id="endDateTime" ref={this.endDateTime}>
                            <div className="form-group small-form" id="endDateForm">
                                <label className="header">End Date</label>
                                <input 
                                    id="endDateInput"
                                    onChange={this.handleChange("endDate")} 
                                    type="date" 
                                    className={endClass}
                                    value={endDate} 
                                />
                            </div>
                            <div className="form-group small-form" id="endTimeForm">
                                <label className="header">End Time</label>
                                <input 
                                    id="endTimeInput"
                                    onChange={this.handleChange("endTime")} 
                                    type="time" 
                                    className={endClass}
                                    value={endTime} 
                                />
                            </div>
                        </div>
                    </div>
                    <input type="submit" value={this.props.id ? "Update Game" : "Create Game!"} />
                </form>
                )}
                </Mutation>

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

                #endDateTime {
                    display: none;
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
}

export default CreateGameForm;