import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

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
            date: this.props.date || "",
            time: this.props.time || "",
            endDate: this.props.endDate || "",
            endTime: this.props.endTime || "",
            sport: this.props.sport ? (this.props.sport.charAt(0) + this.props.sport.substring(1).toLowerCase()) : "",
            players: this.props.players || 2,
            venue: this.props.venue || "",
            address: this.props.address || "",
            description: this.props.description || "Let's Play!",
            errors: [{message: ""}],
            loading: true
        }
    }

    componentDidMount() {
        this.setState({
            loading: false
        })

        if (!this.props.id) {
            const d = new Date();
            const startDate = d.toISOString().split("T")[0];
            d.setHours(d.getHours() + 2);
            let startTime;
            if ((Math.ceil(d.getMinutes()/10)*10) > 59) {
                d.setHours(d.getHours() + 1);
                startTime = d.getHours().toString() + ":" + "00"
            } else {
                startTime = d.getHours().toString() + ":" + (Math.ceil(d.getMinutes()/10)*10).toString();
            }
            this.setState({
                date: startDate,
                time: startTime,
                endDate: startDate
            })
        }

        this.toggleEndTime();

        document.getElementById('descriptionInput').innerText = this.state.description

        document.getElementById('descriptionInput').addEventListener("input", e => {
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

    toggleEndTime = () => {
        if (this.state.loading) {
            return;
        }
        const endTime = document.getElementById("endDateTime");
        if (!endTime.style.display) {
            endTime.style.display = "none";
        }
        if (endTime.style.display === "none") {
            endTime.style.display = "block";
        } else {
            endTime.style.display = "none";
        }
    }

    render() {
        const {title, date, time, endDate, endTime, sport, players, venue, address, description} = this.state;
        const dateTime = new Date(date + "T" + time);

        const endDateTime = new Date(endDate + "T" + endTime);

        const errors = [];
        this.state.errors.forEach( error => {
            errors.push(
            <li key={error.message}>
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
            sport: sport.toUpperCase().trim(),
            description: description,
            players: parseInt(players),
            public: true
        } } : { gameInput: {
            title: title,
            dateTime: dateTime,
            endDateTime: endDateTime,
            venue: venue,
            address: address,
            sport: sport.toUpperCase().trim(),
            description: description,
            players: parseInt(players),
            public: true
        } }

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

            <div className="container">

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
                            console.log(response)
                            if (response.errors) {
                                this.setState({
                                    errors: response.errors[0].data
                                })
                                return;
                            }
                            if (!this.props.id) this.props.exitFunc(); 
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
                    <div className="section" id="titleSportForm">
                        <div className="form-group">
                            <label id="title" className="header">Title</label>
                            <button onClick={this.props.exitFunc} id="exitButton" type="button">X</button>
                            <input
                                id="titleInput" 
                                onChange={this.handleChange("title")} 
                                type="text" 
                                className="input-fields"
                                value={title}
                                minLength="4"
                                placeholder="Give your sporting event a unique title"
                                autoComplete="off" 
                            />
                        </div>
                        
                    </div>

                    <div className="section">
                        <div className="form-group split-form">
                            <label className="header">Sport</label>
                            <input 
                                id="sportInput"
                                onChange={this.handleChange("sport")} 
                                list="sports"
                                type="text" 
                                autoCapitalize="word"
                                className="input-fields"
                                value={sport} 
                                placeholder="Pick a sport from the list or specify your own"
                                autoComplete="off"
                            />
                        </div>
                        <div className="form-group split-form">
                            <label className="header">No. Players</label>
                            <input
                                id="playersInput"
                                className="input-fields"
                                onChange={this.handleChange("players")}
                                type="number"
                                autoComplete="off"
                                min="1"
                                max="32"
                                value={players}
                            />
                        </div>
                    </div>

                    <div className="section" id="descriptionForm">
                        <div className="form-group">
                            <label className="header">Description</label>
                            <div
                                id="descriptionInput"
                                className="input-fields"
                                contentEditable="true"                  
                                autoComplete="off"
                            >
                            </div>
                        </div>
                    </div>

                    <div className="section" id="locationForm">
                        <div className="form-group split-form" id="venueForm">
                            <label className="header">Venue</label>
                            <input 
                                id="venueInput"
                                onChange={this.handleChange("venue")} 
                                type="text" 
                                className="input-fields" 
                                value={venue}
                                placeholder="What is this venue commonly known as"
                                autoComplete="off"
                            />
                        </div>
                        <div className="form-group split-form" id="addressForm">
                            <label className="header">Address</label>
                            <input 
                                id="addressInput"
                                onChange={this.handleChange("address")} 
                                type="text" 
                                className="input-fields"
                                value={address}
                                placeholder="Where is your game located"
                                autoComplete="off"
                            />
                        </div>
                    </div>
                    
                    <div className="section" id="dateTimeForm">
                        <label className="header" id="dateTimeLabel">Date/Time</label>
                        <div className="form-group small-form" id="startDateForm">
                            <input 
                                id="startDateInput"
                                onChange={this.handleChange("date")} 
                                type="date" 
                                className="input-fields"
                                value={date} 
                                autoComplete="off"
                            />
                        </div>
                        <div className="form-group small-form" id="stateTimeForm">
                            <input 
                                id="startTimeInput"
                                onChange={this.handleChange("time")} 
                                type="time" 
                                className="input-fields"
                                value={time} 
                                autoComplete="off"
                            />
                        </div>

                        <a 
                            id="toggleEndTime"
                            href="#" 
                            onClick={this.toggleEndTime}
                        >+End Time</a>

                        <div className="endDateTime" id="endDateTime">
                            <div className="form-group small-form" id="endDateForm">
                                <label className="header">End Date</label>
                                <input 
                                    id="endDateInput"
                                    onChange={this.handleChange("endDate")} 
                                    type="date" 
                                    className="input-fields"
                                    value={endDate} 
                                />
                            </div>
                            <div className="form-group small-form" id="endTimeForm">
                                <label className="header">End Time</label>
                                <input 
                                    id="endTimeInput"
                                    onChange={this.handleChange("endTime")} 
                                    type="time" 
                                    className="input-fields"
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
                .container {
                    display: block;
                    flex-direction: column;
                    align-content: center;
                    align-items: center;
                    justify-content: center;
                    justify-items: center;
                    background-color: white;
                    border-radius: 10px;
                    margin: 1.5em;
                    padding: 10px;
                }

                .gameForm {
                    width: 100%;
                    height: 100%;
                    padding: 10px
                    display: block;
                }

                .section {
                    padding: 5px;
                    display: block;
                }

                .header {
                    display: block;
                    color: #4b4f56;
                    padding-left: 5px;
                    font-weight: 500;
                    font-weight: bold;
                }

                #title {
                    display: inline-block;
                    width: 95%;
                }

                #exitButton {
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
                    display: block;
                    margin : 0 auto;
                    width: 100%;
                    padding: 12px 20px;
                    margin: 8px 0;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-sizing: border-box;
                }

                #titleInput {
                    max-width: 33vw;
                }

                .split-form {
                    width: 50%;
                    display: inline-block;
                    padding-left: 5px;
                    padding-right: 5px;
                }

                // textarea {
                //     width: 80%;
                //     height: auto;
                //     border: none;
                //     resize: none;
                //     outline: none;
                //     border-radius: 5px;
                //     padding: 0.5em;
                //     white-space: pre-wrap;
                //     //overflow: auto;
                // }

                #descriptionInput {
                    outline: none;
                }

                .small-form {
                    width: 40%;
                    display: inline-block;
                    padding-left: 5px;
                    padding-right: 5px;
                }

                #toggleEndTime {
                    display: inline-block;
                    font-size: 0.85em;
                    color: var(--greenapple);
                    margin-left: 15px;
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

                // .alert {
                //     color: black;
                //     margin-bottom: 15px;
                //     text-align: center;
                // }

                ::-webkit-input-placeholder {
                    font-style: italic;
                }

                // @media only screen and (max-width: 700px) {
                //     .container {
                //         //grid-template-columns: .25fr 1fr .25fr;
                //     }
                // }
            `}</style>
            </React.Fragment>
        );
    }
}

export default CreateGameForm;