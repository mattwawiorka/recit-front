import classNames from 'classnames';

function GameCluster(props) {
    const { games, hovered, clearHovered } = props;

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
        <React.Fragment>
            <div className={markerClass} onMouseLeave={clearHovered}>
                <img src={games[0].image} alt={games[0].sport} className="icon" />
                <img src={games[1].image} alt={games[1].sport} className="icon top" />
                {props.games.length > 2 ? <div className={countClass}><strong>+ {games.length - 2}</strong></div> : null}
            </div>

            <style jsx>{`
                .cluster {
                    display: flex;
                    height: 4em;
                    width: min-content;
                    background: none;
                    animation: bounce 1s;
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

                @keyframes bounce {
                    0% { transform: translate(0, 0px); }
                    25% { transform: translate(0, -10px); }
                    50% { transform: translate(0, 0px); }
                    75% { transform: translate(0, -5px); }
                    100% { transform: translate(0, 0px); }
                }

            `}</style>
        </React.Fragment>
    ); 
}

export default GameCluster;