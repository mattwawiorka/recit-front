import React, { useEffect } from 'react';
import Link from 'next/link';

function PlayerList(props) {
  let host, i;

  useEffect(() => {
      props.subscribeToMore();
  }, [])

  const playerStyle = 
    <style jsx="true">{`
      .player {
        display: block;
        width: 100%;
        height: 3em;
        margin-bottom: 0.5em;
        overflow: hidden;
      }

      .player-pic {
        display: inline-block;
        float: left;
        width: 30%;
        height: 100%;
      }

      .player-pic-round {
        width: 3em;
        height: 3em;
        border-style: hidden;
        border-radius: 50%;
        border: 0;
      }

      .open-spot {
        // transform(-50%, 0%);
        margin: auto;
        background-color: var(--greyapple);
        font-style: italic;
      }

      .player-name-container {
        display: inline-block;
        height: 3em;
        width: 70%;
        text-align: left;
      }

      .player-name {
        display: inline-block;
        margin-left: 0.25em;
        vertical-align: -50%;
        transform(0%, -50%);
        font-size: 1.2em;
      }

      .player:hover {
        cursor: pointer;
        transform: scale(0.95);
        border-radius: 15px;
      }
    `}</style>

  const players = [];
  for (i = 0; i < props.spots; i++) {
    let player = props.players[i];

    if (player && player.role === 1) {
      host = player;
    }

    if (player) {
      players.push(
        <React.Fragment key={i}>
          <Link href='/Profile/[user]' as={`/Profile/${player.userId}`}>
            <div className="player">
              <span className="player-pic">
                <img 
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQYAAADBCAMAAAAace62AAAAPFBMVEX+/v6wsLCtra3a2tr8/Pz19fWzs7P4+Pi9vb3Ly8vBwcHo6OjY2Njw8PDT09Py8vLj4+O4uLjGxsbPz88cCaLbAAAEw0lEQVR4nO2d2ZakIAxAFTdQy/X//3VUtNqa2hSTDqFzn3p5kXskhKAxigRBEARBEARB4EmRtW2bpdSXQUZR1YPO1Urcl2N3o76m36Ya+2XwO+bf8zLJqC/t17iZ+NHAgwud/IkZkvTvHGwqYtNSXyQ2Sf7ZwXpPDEGHie6IBCvCFNQXi0VbHpRgp0ZCfb04JF9iwpMIHeCqkZ65FVYPqqO+amhuR6PCo4iR+rph6VwkzB5K6iuHJHG0MHnow0mm3C3MHkJZOa9YCOd+cI0Ldw+aegQQ3C5amDwM1GO4TpFftTB5qKlHcZnzWdMrDxX1MC5SQ1iI45x3mGxhLHAPDxpIA+9pcXWt3NFTj8WdFGCV2FB8yw9A8XGFejTOQErgmzxc20s8kVOPx5Ee1ELMtBZVwd4MccxzizVAa1AcS7QptIVYNdRjcgAwddrgmEIZeA0cZwVgBnnXwG+tgNpbPmgw1KM6DUJo4JhBNRgaFLvqC0jx7UkDu8ceECIkxxiJcTPw22UWOBq4nXBjrJcMK7PXz6peauB2zi8aFkTDgmhYkBC5kOFo4La3gq89LRrY1Z8wLDA8ugKuzq8a2B3oItTgOFbhgI+sVg3UozoN+GHNDL8DmwLBAr+FIoo0ggZ2ERKnGMmuFImxq2CXSi+AVyP5VSJnwGcFv+VyBnp3xW5ftQL8gAO/QwoLbJBkV3K5A/aM7KKBYdJggUyoOb9cAniQyTUyzMBVJHmmThtwuQPDPHoHUBGKZwL5A8yiyXtKzIBUoZi/YzQDkEtyXiXuXE6iuAcGS9pf88DvcOI12aXKA8cC5Gsypx4WoVmIosJ5XoQyIywOnV2shSCi447RwYPKQ1gpH+nisyLUwD9reqY4l0ipOLQJsXG4F1rY3dCiqD42M5TS4UWFPWnzXYRSJdu643ES/ak53PQ/E/adcOfW9OqliumPQxfi8vCOLBl69R+xbqq/5GCluHX1OJQTg2mSKvjOqYIgCIIgCJdJ07RYmH6gvpZfJm2rLmlMqfs+t59jsJ9oyPNel2asu6oNW0lWJWb3YY6XWytLrk1dsXtp4DtF1ZT529G/EZKXTReOi6IzT58mOS4jN10A1bis1m4G9ip0zXr3mdXfvkxyWEXfcDXRlTAONhOaYcG+aN5+psfdRDzyipiZAXdgRaiBz9zAksBLRIMnwYowDLLM8ye2DiJ8f+ihQGn39CxCez0zOtz5sPPg8w0B3i/0k4jS0wjRXnjQy8WDn4/CoLyU/VmEh2klyhv63zx41xuNwoJ/D03Cdps/4cGrJnE098LiwaP7AaVh6lEP3iQQOB2/Dnvw5DkpyI9xOOFHEeJ3thHvUV40I6cLj3cPHoRJnB54Jz3Qp9XUU2KBfFpQrpU/kK+a1KvEBu2umz4+WoijpC83A+3t4EdkmCGNDggNz1wh/GaDDznDBuHWAuUbFI4QdoVCaZTqCtmswGmi7ApZRu3POjFDVp91edEWD7LGJx4tlzNU+yt/UkgLUSLp1ZyYZgXNg4M4bebdIerFLRpEg2gQDaJBNIgG0SAaRINoEA2iQTSIBtEgGkSDaBANokE0iAbRIBosomFBNCyIhgUyDZ5B9HpJnfiFp28rC4IgCIIgCELQ/AOcpFAvjfMo8wAAAABJRU5ErkJggg==" 
                  className="player-pic-round"
                />
              </span>
              
              <span className="player-name-container">
                <h3 className="player-name">{player.name}</h3>
              </span>
            </div>
          </Link>
          {playerStyle}
        </React.Fragment>
      );
    } else {
      players.push(
        <React.Fragment key={i}>
          <div className="player" onClick={() => { if (!props.playerFound) props.joinGame() }}>
            <span className="player-pic">
              <div 
                className="player-pic-round open-spot"
              />
            </span>
            
            <span className="player-name-container">
              <h3 className="player-name" style={{ fontStyle: "italic", fontSize: "0.9em" }}>Open Spot</h3>
            </span>
          </div>
          {playerStyle}
        </React.Fragment>
      );
    }
    
  }

  return (
    <React.Fragment>
      <div className="players-container">
        <div className="host">  
          <h3>{host ? "Hosted by " + host.name : null}</h3>
        </div>

        <div className="players">
          {/* <h3 style={{ textDecoration: 'underline' }}>Players</h3> */}
          {players}
        </div>

        <div className="spots">
          {props.spotsMessage}
        </div>

        <div className="buttons">
          {props.joinButton}
          {props.inviteButton}
        </div>
      </div>

      <style jsx>{`
        .players-container {
          display: block;
          align-items: center;
          background-color: var(--greenapple); 
          color: white;
          max-width: 20vw;
          width: 100%;
          height: auto;
          // height: 85%;
          border-radius: 15px;
          margin: auto;
          margin-top: 2em;
          padding: 1em;
          justify-items: center;
          // overflow: auto;
          border-bottom-style: groove;
        }

        .host {
          font-style: italic;
        }

        .players {
          padding-top: 1.5em;
          text-align: center;
          margin-bottom: 1.5em;
        }

        .spots {
          padding-top: 1em;
          text-align: center;
          margin-bottom: 1em;
          text-align: center;
          font-size: 1em;
          font-style: italic;
        }

        .buttons {
          display: inline-block;
          width: 100%;
          text-align: center;
        }
      `}</style>
    </React.Fragment>
  );
}

export default PlayerList;