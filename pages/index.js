import React, { Component } from 'react';
import Games from '../components/Games';
import Layout from '../components/Layout/Layout';
import CreateGameForm from '../components/CreateGame/CreateGameForm';
import Announcements from '../components/Announcements/Announcements';
import Filtering from '../components/Filtering/Filtering';
import { withApollo } from '../lib/apollo';
import withAuth from '../lib/withAuth';

let loggedIn;

class Index extends Component {
    constructor(props) {
        // props
        super(props)
        // state
        this.state = {
          createGame: false
        };
    }

    componentDidMount() {
        this.setState({
            createGame: false
        })
        loggedIn =this.props.auth.loggedIn();
    }

    toggleCreateGame = () => {
        this.setState({
            createGame: !this.state.createGame
        })
    }

    renderCreateGame = () => {
        return (
            <Layout showGamesButton={true} startGame={false} submitGame={true} clickEvent={this.toggleCreateGame} >
                <Announcements />
                <CreateGameForm />
                <Filtering />
            </Layout>
        );
    }

    renderGameList = () => {
        return (
            <Layout showGamesButton={true} startGame={true} submitGame={false} clickEvent={this.toggleCreateGame} >
                <Announcements />
                <Games loggedIn={loggedIn} />
                <Filtering />
            </Layout>
        )
    }

    render() {  
        if (this.state.createGame) {
            return (
                <div>
                    {this.renderCreateGame()}
                </div>
            );
        } else {
            return (
                <div>
                    {this.renderGameList()}
                </div>
            );
        } 
    }
}

export default withApollo(withAuth(Index));