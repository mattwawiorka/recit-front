import React, { useCallback } from 'react';
import classNames from 'classnames';

import Link from 'next/link';

function GameMarker(props) {
    let image;
    const { id, sport, loggedIn, hovered, clearHovered, onMouseEnter } = props;

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

    const getHovered = useCallback(() => {
        onMouseEnter(id, true)
    })

    let markerClass = classNames({
        'marker': true,
        'hovered': hovered
    })

    if (loggedIn) {
        return (
            <>
                <Link href='/Game/[game]' as={`/Game/${id}`} >
                    <div className={markerClass} onMouseEnter={getHovered} onMouseLeave={clearHovered} shallow="true" >
                        <img src={image} alt={sport} className="icon"/>
                    </div>
                </Link>
    
                <style jsx>{`
                    .marker {
                        width: 4em;
                        height: 4em;
                        background: none;
                    }

                    .icon {
                        width: 4em;
                        height: 4em;
                    }

                    .hovered {
                        transform: scale(1.5);
                        cursor: pointer;
                    }

                `}</style>
            </>
        );
    } else {
        return (
            <>
                <div className={markerClass} onMouseEnter={getHovered} onMouseLeave={clearHovered}>
                    <img src={image} alt={sport} />
                </div>
    
                <style jsx>{`
                    .marker {
                        width: 2.5em;
                        height: 2.5em;
                        background: none;
                    }

                    .hovered {
                        transform: scale(1.5);
                        cursor: pointer;
                    }

                `}</style>
            </>
        );
    }
    
}

export default GameMarker;