import React, { Component } from 'react';
import Games from '../components/Games';
import Layout from '../components/Layout/Layout';
import CreateGameForm from '../components/CreateGame/CreateGameForm';
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
            <Layout>
                <CreateGameForm />
                <button className="btn" onClick={this.handleCreateGame}>Exit</button>
            </Layout>
        );
    }

    renderGameList = () => {
        return (
            <Layout>
                <Games></Games>
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

export default withApollo(Index);