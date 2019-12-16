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

    render() {  
        if (this.state.loading) return <Loading />

        return (
            <>
            {this.state.createGame ? <div className="overlay"></div> : null}
            <Layout 
                main={true} 
                showGamesButton={true} 
                startGame={!this.state.createGame} 
                clickEvent={this.toggleCreateGame} 
            >
                <Announcements />
                <>
                    {this.state.createGame ? 
                        <CreateGameForm 
                            exitFunc={this.toggleCreateGame}
                        />
                    :
                    null 
                    }
                    <SortingFiltering 
                        loggedIn={this.state.loggedIn}  
                        currentLoc={this.state.currentLoc}
                        faded={this.state.createGame}
                    />
                </>
            </Layout>

            <style jsx>{`
                .overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 100%;
                    background-color: rgba(0,0,0,0.5);
                    z-index: 10;
                    animation-duration: .75s;
                    animation-name: fadein;
                }

                @keyframes fadein {
                    from {
                        opacity: 0;
                    } 
                    
                    to {
                        opacity: 1;
                    }
                }
            `}</style>
            </>
        );   
    }
}

export default withApollo(withAuth(Index));