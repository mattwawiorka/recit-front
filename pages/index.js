import React, { Component } from 'react';
import GameList from '../components/GameList/GameList';
import Layout from '../components/Layout/Layout';
import GameForm from '../components/CreateGame/GameForm';

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
            <Layout>
                <GameForm />
                <button className="btn" onClick={this.handleCreateGame}>Exit</button>
            </Layout>
        );
    }

    renderGameList = () => {
        return (
            <Layout>
                <GameList></GameList>
                <button className="btn" onClick={this.handleCreateGame}>Create Game</button>
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

export default Index;