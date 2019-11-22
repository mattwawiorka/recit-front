import React, { Component } from 'react';
import Loading from '../Loading/Loading';
import GameInfo from './GameInfo';
import PlayerList from './PlayerList';
import Discussion from './Discussion';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import CreateGameForm from '../CreateGame/CreateGameForm';

const GET_GAME = gql`
  query Game($id: ID!, $gameId: ID!) {
    game(id: $id) {
        id
        title
        dateTime
        endDateTime
        venue
        address
        sport
        description
        players
    }

    host(gameId: $gameId)
  }
  `;

class GameContainer extends Component {
  constructor(props) {
    // props
    super(props)
    // state
    this.state = {
        editMode: false
    };
  }

  toggleEditing = () => {
    this.setState({
      editMode: !this.state.editMode
    })
  }

  render() {

    return (
      <React.Fragment>
      <Query query={GET_GAME} variables={{ id: this.props.gameId, gameId: this.props.gameId }}>
      { ({ loading, error, data, refetch }) => 
      {
        if (loading) return <Loading></Loading>
        if (error) return <h4>ERROR!!!</h4>

        const d = new Date(parseInt(data.game.dateTime))
        const endD = new Date(parseInt(data.game.endDateTime))

        const time = (d.getHours() < 10 ? '0' + d.getHours().toString() : d.getHours().toString()) + ":" + (d.getMinutes() < 10 ? '0' + d.getMinutes().toString() : d.getMinutes().toString());
        const endTime = (endD.getHours() < 10 ? '0' + endD.getHours().toString() : endD.getHours().toString()) + ":" + (endD.getMinutes() < 10 ? '0' + endD.getMinutes().toString() : endD.getMinutes().toString());

        return (
          <div className="container">
            <div className="gameInfo">
              {this.state.editMode ? 
              <CreateGameForm 
                id={this.props.gameId}
                title={data.game.title}
                date={d.getFullYear().toString() + '-' + (d.getMonth() + 1).toString() + '-' +  d.getDate().toString()}
                time={time}
                endDate={endD.getFullYear().toString() + '-' + (endD.getMonth() + 1).toString() + '-' +  endD.getDate().toString()}
                endTime={endTime}
                sport={data.game.sport}
                players={data.game.players}
                venue={data.game.venue}
                address={data.game.address}
                description={data.game.description}
                exitFunc={this.toggleEditing}
                refetch={refetch}
              />
              :
              <GameInfo game={data.game} isHost={data.host === this.props.currentUser} toggleEditing={this.toggleEditing} />}
            </div>
            
            <div className="players">
              <PlayerList gameId={this.props.gameId} playerSpots={data.game.players} />
            </div>
            
            <div className="discussion">
              <Discussion gameId={this.props.gameId} currentUser={this.props.currentUser}/>
            </div>
          </div>
        )
      
      }
      }
      </Query>
      

      <style jsx>{`
        .container {
          display: grid;
          max-width: 60vw;
          // max-height: 82vh;
          justify-items: center;
          grid-template-columns: 43vw 17vw;
          grid-template-rows: minmax(min-content, max-content) minmax(min-content, auto);
          grid-template-areas:
            "gameInfo players"
            "discussion discussion";
        }

        .gameInfo {
          width: 100%;
          height: auto;
          grid-area: gameInfo;
        }

        .players {
          width: 100%;
          height: 100%;
          grid-area: players;
          overflow: hidden;
        }

        .discussion {
          margin-top: 1em;
          width: 100%;
          height: 100%;
          grid-area: discussion;
        }

      `}</style>
      </React.Fragment>
    );
  }    
}

export default GameContainer;