import classNames from 'classnames';

function GameCluster(props) {
    let image1, image2;
    const { games, hovered, clearHovered } = props;

    if (games[0].sport === 'TENNIS') {
        image1 = "/tennis-ball.svg";
    } 
    else if (games[0].sport === 'BASKETBALL') {
        image1 = "/basketball.svg";
    }
    else if (games[0].sport === 'FOOTBALL') {
        image1 = "/american-football.svg";
    } 
    else {
        image1 = "rec-it.png";
    }

    if (games[1].sport === 'TENNIS') {
        image2 = "/tennis-ball.svg";
    } 
    else if (games[1].sport === 'BASKETBALL') {
        image2 = "/basketball.svg";
    }
    else if (games[1].sport === 'FOOTBALL') {
        image2 = "/american-football.svg";
    } 
    else {
        image2 = "rec-it.png";
    }

    let markerClass = classNames({
        'cluster': true,
        'hovered': hovered
    })

    let countClass = classNames({
        'icon': true,
        'count': true,
        'football': games[1].sport === 'FOOTBALL'
    })

    return (
        <>
            <div className={markerClass} onMouseLeave={clearHovered}>
                <img src={image1} alt={games[0].sport} className="icon" />
                <img src={image2} alt={games[1].sport} className="icon top" />
                {props.games.length > 2 ? <div className={countClass}><strong>+ {games.length - 2}</strong></div> : null}
            </div>

            <style jsx>{`
                .cluster {
                    display: flex;
                    height: 4em;
                    width: min-content;
                    background: none;
                }

                .icon {
                    width: 4em;
                    height: 4em;
                }

                .top {
                    z-index: 5;
                    position: relative;
                    left: -3em;
                }

                .count {
                    z-index: 6;
                    position: relative;
                    left: -6em;
                    background-color: var(--greyapple);;
                    border-radius: 50%;
                    text-align: center;
                    overflow: hidden;
                }

                .football {
                    left: -5.5em;
                }

                strong {
                    display: inline-block;
                    height: 100%;
                    font-weight: bold;
                    color: var(--darkmatter);
                    font-size: 2em;
                    letter-spacing: -2px;
                    vertical-align: middle;
                    margin-top: 20%;
                }

                .cluster:hover {
                    transform: scale(1.5);
                    cursor: pointer;
                }

                .hovered {
                    transform: scale(1.5);
                    cursor: pointer;
                }

            `}</style>
        </>
    ); 
}

export default GameCluster;