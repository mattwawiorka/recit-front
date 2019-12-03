import React, { Component } from 'react';
import SortingFiltering from '../components/SortingFiltering';
import Layout from '../components/Layout/Layout';
import CreateGameForm from '../components/CreateGame/CreateGameForm';
import Announcements from '../components/Announcements/Announcements';
import Filtering from '../components/Filtering/Filtering';
import { withApollo } from '../lib/apollo';
import withAuth from '../lib/withAuth';

// const AuthContext = React.createContext(false);
let loggedIn;

class Index extends Component {
    constructor(props) {
        // props
        super(props)
        // state
        this.state = {
          createGame: false,
          sortingFiltering: false
        };
    }

    componentDidMount() {
        this.setState({
            createGame: false
        })
        
        loggedIn = this.props.auth.loggedIn();
    }

    toggleCreateGame = () => {
        this.setState({
            createGame: !this.state.createGame
        })
    }

    toggleSortingFiltering = () => {
        this.setState({
            sortingFiltering: !this.state.sortingFiltering
        })
    }

    renderCreateGame = () => {
        return (
            <Layout main={true} showGamesButton={true} startGame={false} submitGame={true} clickEvent={this.toggleCreateGame} >
                <Announcements />
                <CreateGameForm exitFunc={this.toggleCreateGame}/>
                <Filtering />
            </Layout>
        );
    }

    renderGameList = () => {
        return (
            <Layout main={true} showGamesButton={true} startGame={true} submitGame={false} clickEvent={this.toggleCreateGame} >
                <Announcements />
                <div style={{ width: '100%', height: 'auto', paddingTop: '1.2em', paddingLeft: '1.2em', marginBottom: '5em' }}>
                    {/* <AuthContext.Provider value={this.props.auth.loggedIn()}> */}
                        <SortingFiltering loggedIn={loggedIn} showPanel={this.state.sortingFiltering} toggleSortingFiltering={this.toggleSortingFiltering} />
                    {/* </AuthContext.Provider> */}
                </div>
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