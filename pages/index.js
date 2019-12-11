import React, { Component } from 'react';
import SortingFiltering from '../components/GamesFeed/SortingFiltering';
import Layout from '../components/Layout/Layout';
import CreateGameForm from '../components/CreateGame/CreateGameForm';
import Announcements from '../components/Announcements/Announcements';
import { withApollo } from '../lib/apollo';
import withAuth from '../lib/withAuth';
import Loading from '../components/Loading/Loading';

// const AuthContext = React.createContext(false);

class Index extends Component {
    constructor(props) {
        // props
        super(props)
        // state
        this.state = {
            loading: true,
            loggedIn: this.props.auth.loggedIn(),
            currentLoc: [],
            createGame: false,
            sortingFiltering: false,
        };
    }

    componentDidMount() {

        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({
                currentLoc: [position.coords.latitude, position.coords.longitude],
                loading: false
            })
        })

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

    render() {  
        if (this.state.loading) return <Loading />

        if (this.state.createGame) {
            return (
                <Layout 
                    main={true} 
                    showGamesButton={true} 
                    startGame={false} 
                    submitGame={true} 
                    clickEvent={this.toggleCreateGame} 
                >
                    <Announcements />
                    <CreateGameForm 
                        exitFunc={this.toggleCreateGame}
                    />
                    <br />
                </Layout>
            );
        } else {
            return (
                <Layout 
                    main={true} 
                    showGamesButton={true} 
                    startGame={true} 
                    submitGame={false} 
                    clickEvent={this.toggleCreateGame} 
                >
                    <Announcements />
                    <div style={{ width: '100%', height: 'auto', paddingTop: '1.2em', paddingLeft: '1.2em', marginBottom: '5em' }}>
                        <SortingFiltering 
                            loggedIn={this.state.loggedIn} 
                            showPanel={this.state.sortingFiltering} 
                            toggleSortingFiltering={this.toggleSortingFiltering} 
                            currentLoc={this.state.currentLoc} 
                        />
                    </div>
                </Layout>
            );
        } 
    }
}

export default withApollo(withAuth(Index));