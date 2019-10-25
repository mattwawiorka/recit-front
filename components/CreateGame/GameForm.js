import React, { Component } from 'react';
import axios from 'axios';

class GameForm extends Component {
    constructor() {
        super()
        this.state = { 
            title: "",
            date: "",
            time: "",
            endDate: "",
            endTime: "",
            sport: "Tennis",
            venue: "Court",
            address: "123 Court St",
            description: "Let's Play"
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
        this.setState({ [input]: e.target.value });
        if (input == 'date') {
            console.log('date');
            this.setState({
                endDate: e.target.value
            })
        }
        if (input == 'time') {
            let d = new Date();
            d.setHours(parseInt(e.target.value.split(":")[0]) + 2)
            d.setMinutes(parseInt(e.target.value.split(":")[1]))
            this.setState({
                endTime: (d.getHours()).toString() + ":" + (d.getMinutes()).toString()
            })
        }
    };

    clickCreate = e => {
        e.preventDefault();
        const {title, date, time, endDate, endTime, sport, venue, address, description} = this.state;
        const dateTime = new Date(date + "T" + time);
        const endDateTime = new Date(endDate + "T" + endTime);
        let graphqlQuery = {
            query: `
            mutation {
                createGame(gameInput: {
                    title: "${title}",
                    dateTime: "${dateTime}",
                    endDateTime: "${endDateTime}",
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
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem("token"),
                'Content-Type': 'application/json'
            },
            data: graphqlQuery
        })
        .then( response => { 
            this.setState({
                title: "",
                date: "",
                time: "",
                endDate: "",
                endTime: "",
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
        const {title, date, time, endDate, endTime, sport, venue, address, description} = this.state;
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
                        <label className="text-muted">Start Date</label>
                        <input 
                            onChange={this.handleChange("date")} 
                            type="date" 
                            className="form-control"
                            value={date} 
                        />
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Start Time</label>
                        <input 
                            onChange={this.handleChange("time")} 
                            type="time" 
                            className="form-control"
                            value={time} 
                        />
                    </div>
                    <div className="form-group">
                        <label className="text-muted">End Date</label>
                        <input 
                            onChange={this.handleChange("endDate")} 
                            type="date" 
                            className="form-control"
                            value={endDate} 
                        />
                    </div>
                    <div className="form-group">
                        <label className="text-muted">End Time</label>
                        <input 
                            onChange={this.handleChange("endTime")} 
                            type="time" 
                            className="form-control"
                            value={endTime} 
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