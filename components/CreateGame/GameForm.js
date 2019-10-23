import React, { Component } from 'react';
import axios from 'axios';

class GameForm extends Component {
    constructor() {
        super()
        this.state = { 
            title: "",
            date: "1900-01-01",
            time: "10:30",
            sport: "Tennis",
            venue: "Court",
            address: "123 Court St",
            description: "Let's Play"
        }
    }

    handleChange = (input) => (e) => {
        this.setState({ [input]: e.target.value });
    };

    clickCreate = e => {
        e.preventDefault();
        const {title, date, time, sport, venue, address, description} = this.state;
        const dateTime = new Date(date + "T" + time);
        let graphqlQuery = {
            query: `
            mutation {
                createGame(gameInput: {
                    title: "${title}",
                    dateTime: "${dateTime}",
                    venue: "${venue}",
                    address: "${address}",
                    sport: "${sport}",
                    description: "${description}",
                    public: true
                }) 
                {
                    id
                }
            }
        `
        };

        axios({
            url: 'http://localhost:8080/graphql',
            method: 'post',
            data: graphqlQuery
        })
        .then( response => { 
            this.setState({
                title: "",
                date: "",
                time: "",
                sport: "",
                venue: "",
                address: "",
                description: ""
            })
        })
        .catch( err => {
            console.log(err);
        })
    }

    render() {
        const {title, date, time, sport, venue, address, description} = this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Create Game</h2>

                <form>
                    <div className="form-group">
                        <label className="text-muted">Title</label>
                        <input 
                            onChange={this.handleChange("title")} 
                            type="text" 
                            className="form-control"
                            value={title} 
                        />
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Date</label>
                        <input 
                            onChange={this.handleChange("date")} 
                            type="date" 
                            className="form-control"
                            value={date} 
                        />
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Time</label>
                        <input 
                            onChange={this.handleChange("time")} 
                            type="time" 
                            className="form-control"
                            value={time} 
                        />
                    </div>
                    <div className="form-group">
                        <label className="text-muted">sport</label>
                        <input 
                            onChange={this.handleChange("sport")} 
                            type="text" 
                            className="form-control"
                            value={sport} 
                        />
                    </div>
                    <div className="form-group">
                        <label className="text-muted">venue</label>
                        <input 
                            onChange={this.handleChange("venue")} 
                            type="text" 
                            className="form-control" 
                            value={venue}
                        />
                    </div>
                    <div className="form-group">
                        <label className="text-muted">address</label>
                        <input 
                            onChange={this.handleChange("address")} 
                            type="text" 
                            className="form-control"
                            value={address} 
                        />
                    </div>
                    <div className="form-group">
                        <label className="text-muted">description</label>
                        <input 
                            onChange={this.handleChange("description")} 
                            type="text" 
                            className="form-control"
                            value={description} 
                        />
                    </div>
                    <button 
                        className="btn btn-raised btn-primary"
                        onClick={this.clickCreate}>
                        Create!
                    </button>
                </form>
            </div>
        );
    }
}

export default GameForm;