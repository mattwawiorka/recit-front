import React, { Component } from 'react';
import GameList from '../components/GameList/GameList';
import GamesLayout from '../components/GamesLayout/GamesLayout';
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
      }

    componentDidMount() {
        this.setState({
            createGame: false
        })
    }

    handleCreateGame() {
        // this.setState({
        //     createGame: true
        // })
    }

    renderCreateGame = () => {
        return (
            <GamesLayout>
                <GameForm />
            </GamesLayout>
        );
    }

    renderGameList = () => {
        return (
            <GamesLayout>
                <GameList></GameList>
                <button className="btn" onClick={this.handleCreateGame}>Create Game</button>
            </GamesLayout>
        )
    }

    render() {
        return (
            <div>
                {this.renderGameList()}
            </div>
        );
    }
}

export default Index;