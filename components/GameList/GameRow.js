import React, { Component } from 'react';
import Link from 'next/link';
import dateTool from '../../lib/dateTool';
import withAuth from '../../lib/withAuth';
import Loading from '../Loading/Loading';

let loggedIn;

class GameRow extends Component {
  constructor(props) {
    // props
    super(props)
    // state
    this.state = {
        loading: true
    };
  }

  componentDidMount() {
    loggedIn = this.props.auth.loggedIn();
    this.setState({
      loading: false
    })
  }

  render() {
    let {id, title, sport, venue, dateTime } = this.props;
    let dateFormat, image;

    if (parseInt(dateTime) < dateTool.getEndOfWeek().valueOf()) {
      dateFormat = dateTool.getDateTime(parseInt(dateTime), false, true);
    } else {
      dateFormat = dateTool.getDateTime(parseInt(dateTime), true, false)
    }

    if (sport === 'TENNIS') {
      image = "/tennis-ball.svg";
    } 
    else if (sport === 'BASKETBALL') {
      image = "/basketball.svg";
    }
    else if (sport === 'FOOTBALL') {
      image = "/american-football.svg";
    } 
    else {
      image = "rec-it.png";
    }

    if (!loggedIn) {
      dateFormat = "";
      venue = "";
    }

    if (this.state.loading) {
      return <Loading />
    }

    return (
      <React.Fragment>
      <Link href={`/Game?id=${id}`} as='/' prefetch={true}>
      <li className="container">
        <div className="sport">
          <h3 style={{ textAlign: 'center' }} >{sport}</h3>
          <img src={image} alt={sport} className="sportImage"
            style={{ width: '40%', height: '40%', borderRadius: '10px'}}/>
        </div>
        <div className="dateTime">
          <h3>{dateFormat}</h3>
        </div>
        <div className="title">
          <h3>{title}</h3>
        </div>
        <div className="venue">
          <h3>{venue}</h3> 
        </div>
      </li>
      </Link> 

      <style jsx>{`
        .container {
          // display: grid;
          // grid-template-columns: 10vw 10vw 10vw 10vw;
          // grid-gap: 2em;
          // grid-auto-rows: 4em;
          display: flex;
          width: 100%;
          min-height: 4em;
          height: auto;
          padding: 0.5em;
          //border-bottom-style: groove;
          overflow-x: hidden;
          border-radius: 3px;
        }

        .container:hover {
          background-color: var(--greyapple);
          transform: scale(0.97);
        }

        .sport {
          flex: 0.75;
          padding: 0.5em;
          font-size: 0.65em;
        }

        .sportImage {
          display: block;
          margin-top: 2px;
          margin-left: auto;
          margin-right: auto;
        }

        .dateTime {
          flex: 1;
          padding: 0.5em;
          text-align: center;
          color: #616770;
          font-size: 0.75em;
        }

        .title {
          flex: 2;
          padding: 0.5em;
          text-align: center;
        }

        .venue {
          flex: 1;
          display: flex;
          padding: 0.5em;
          text-align: center;
          justify-content: center;
        }

        @media only screen and (max-width: 1000px) {
          .container {
              //grid-template-columns: 10vw 10vw 10vw 10vw;
              grid-auto-rows: 5em;
              font-size: 0.8em;
              //transform: scale(0.8);
          }
        }
      `}</style>
      </React.Fragment>
    ); 
  } 
}

export default withAuth(GameRow);