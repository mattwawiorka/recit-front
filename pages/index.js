import React, { Component } from 'react';
import Games from '../components/Games';
import Layout from '../components/Layout/Layout';
import GamesLayout from '../components/Layout/GamesLayout';
import CreateGameForm from '../components/CreateGame/CreateGameForm';
import BottomDockable from '../components/BottomDockable/BottomDockable';
import Announcements from '../components/Announcements/Announcements';
import Filtering from '../components/Filtering/Filtering';
import { withApollo } from '../lib/apollo';

class Index extends Component {
    constructor(props) {
        // props
        super(props)
        // state
        this.state = {
          createGame: false
        };
        // bind
        this.handleCreateGame = this.handleCreateGame.bind(this);
    }

    componentDidMount() {
        this.setState({
            createGame: false
        })
    }

    handleCreateGame() {
        this.setState({
            createGame: !this.state.createGame
        })
    }

    renderCreateGame = () => {
        return (
            // <Layout>
            //     <div>
            //     <CreateGameForm />
            //     </div>
            //     <br />
            //     <BottomDockable startGame={false} submitGame={true} clickEvent={this.handleCreateGame} />
            // </Layout>
            <GamesLayout startGame={false} submitGame={true} clickEvent={this.handleCreateGame} >
                <Announcements />
                <CreateGameForm />
                <Filtering />
            </GamesLayout>
        );
    }

    renderGameList = () => {
        return (
            // <Layout>
            //     <Games></Games>
            //     <BottomDockable startGame={true} submitGame={false} clickEvent={this.handleCreateGame} />
            // </Layout>
            <GamesLayout startGame={true} submitGame={false} clickEvent={this.handleCreateGame} >
                <Announcements />
                <Games />
                <Filtering />
            </GamesLayout>
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
        // return (
        //     <GamesLayout>
        //         <Announcements />
        //         <Games />
        //         <Filtering />
        //     </GamesLayout>
        // );
    }
}

export default withApollo(Index);