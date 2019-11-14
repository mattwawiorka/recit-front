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

class CreateGameForm extends Component {
    constructor() {
        super()
        this.state = { 
            title: "",
            date: "",
            time: "",
            endDate: "",
            endTime: "",
            sport: "",
            venue: "",
            address: "",
            description: "",
            errors: [{message: ""}]
        }
    }

    componentDidMount() {
        const d = new Date(Date.now());
        const startDate = d.toISOString().split("T")[0];
        d.setHours(d.getHours() + 2);
        const startTime = d.getHours().toString() + ":" + (Math.ceil(d.getMinutes()/10)*10).toString() + ":" + "00";
        this.setState({
            date: startDate,
            time: startTime
        })
    }

    handleChange = (input) => (e) => {
        this.setState({ 
            [input]: e.target.value,
            errors: [{message: ""}] 
        });
        if (input == 'date') {
            console.log('date');
            this.setState({
                endDate: e.target.value,
                errors: [{message: ""}]
            })
        }
        if (input == 'time') {
            let d = new Date();
            d.setHours(parseInt(e.target.value.split(":")[0]) + 2)
            d.setMinutes(parseInt(e.target.value.split(":")[1]))
            this.setState({
                endTime: (d.getHours()).toString() + ":" + (d.getMinutes()).toString(),
                errors: [{message: ""}]
            })
        }
    };

    render() {
        const {title, date, time, endDate, endTime, sport, venue, address, description} = this.state;
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

        return (
            <React.Fragment>
            <div className="container">
                <div></div>

                <span 
                    className="alert"
                    style={{ display: (this.state.errors[0].message !== "") ? "" : "none" }}
                >
                    {errors}
                </span>

                <Mutation
                    mutation={CREATE_GAME}
                    variables={{ gameInput: {
                        title: title,
                        dateTime: dateTime,
                        endDateTime: endDateTime,
                        venue: venue,
                        address: address,
                        sport: sport,
                        description: description,
                        public: true
                    } }}
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
                        Router.push('/Login');
                    })
                    .catch(error => {
                        console.log(error);
                    });
                }}
                >
                    <div className="form-group">
                        <label className="text-muted">Title</label>
                        <input 
                            onChange={this.handleChange("title")} 
                            type="text" 
                            className="input-fields"
                            value={title}
                            placeholder="Give your sporting event a unique title" 
                        />
                    </div>
                    <div className="form-group">
                        <label for="textarea" className="text-muted">Description</label>
                        <textarea
                            onChange={this.handleChange("description")} 
                            type="text" 
                            className="input-fields"
                            value={description} 
                            placeholder="Tell people about your game"
                        />
                    </div>

                    <div className="form-group">
                        <label className="text-muted">Sport</label>
                        <input 
                            onChange={this.handleChange("sport")} 
                            type="text" 
                            className="input-fields"
                            value={sport} 
                            placeholder="Pick a sport from the list or specify your own"
                        />
                    </div>

                    <div className="location">
                        <div className="form-group">
                            <label className="text-muted">Address</label>
                            <input 
                                onChange={this.handleChange("address")} 
                                type="text" 
                                className="input-fields"
                                value={address}
                                placeholder="Where is your game located"
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-muted">Venue</label>
                            <input 
                                onChange={this.handleChange("venue")} 
                                type="text" 
                                className="input-fields" 
                                value={venue}
                                placeholder="What is this venue commonly known as"
                            />
                        </div>
                    </div>
                    
                    <div className="dateTime">
                        <div className="form-group">
                            <label className="text-muted">Start Date</label>
                            <input 
                                onChange={this.handleChange("date")} 
                                type="date" 
                                className="input-fields"
                                value={date} 
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-muted">Start Time</label>
                            <input 
                                onChange={this.handleChange("time")} 
                                type="time" 
                                className="input-fields"
                                value={time} 
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-muted">End Date</label>
                            <input 
                                onChange={this.handleChange("endDate")} 
                                type="date" 
                                className="input-fields"
                                value={endDate} 
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-muted">End Time</label>
                            <input 
                                onChange={this.handleChange("endTime")} 
                                type="time" 
                                className="input-fields"
                                value={endTime} 
                            />
                        </div>
                    </div>
                    <input type="submit" value="Create Game!" />
                </form>
                )}
                </Mutation>

                <br />

            </div>
            <style jsx>{`
                .container {
                    //display: grid;
                    display: flex;
                    flex-direction: column;
                    align-content: center;
                    align-items: center;
                    justify-content: center;
                    justify-items: center;
                    // grid-template-columns: 40vw;
                    // grid-template-rows: auto auto;
                    // grid-gap: 10px;
                    background-color: white;
                    border-radius: 15px;
                    margin: 1.5em;
                    padding: 10px;
                    overflow-x: hidden;
                }

                .gameForm {
                    width: 100%;
                    height: 100%;
                    margin: 1.5em;
                    padding: 10px
                    display: grid;
                    align-items: center;
                    grid-template-columns: 1fr;
                    grid-template-rows: auto auto;
                    grid-gap: 1em;
                    //overflow: hidden;
                }

                textarea {
                    width: 80%;
                    height: 100%;
                    border: none;
                    resize: none;
                    outline: none;
                    border-radius: 5px;
                    padding: 0.5em;
                    white-space: pre-wrap;
                    overflow: auto;
                }

                .form-group {
                    vertical-align: middle;
                }

                .input-fields {
                    width: 100%;
                    padding: 12px 20px;
                    margin: 8px 0;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-sizing: border-box;
                }

                .location {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-template-rows: auto auto;
                    grid-gap: 2em;
                }

                .dateTime {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-template-rows: auto auto;
                    grid-gap: 2em;
                }

                label {
                    font-weight: bold;
                }

                input[type=submit] {
                    width: 100%;
                    background-color: var(--darkermatter);
                    color: white;
                    padding: 14px 20px;
                    margin 8px 0;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }

                input[type=submit]:hover {
                    background-color: var(--darkmatter);
                }

                .alert {
                    color: black;
                    margin-bottom: 15px;
                    text-align: center;
                }

                ::-webkit-input-placeholder {
                    font-style: italic;
                }

                @media only screen and (max-width: 700px) {
                    .container {
                        grid-template-columns: .25fr 1fr .25fr;
                    }
                }
            `}</style>
            </React.Fragment>
        );
    }
}

export default CreateGameForm;