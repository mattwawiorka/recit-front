import React, { useCallback } from 'react';
import classNames from 'classnames';

import Link from 'next/link';

function GameMarker(props) {

    const { game, image, loggedIn, hovered, clearHovered, onMouseEnter } = props;

    const getHovered = useCallback(() => {
        onMouseEnter(game.id, true)
    })

    let markerClass = classNames({
        'marker': true,
        'hovered': hovered
    })

    if (loggedIn) {
        return (
            <>
                <Link href='/Game/[game]' as={`/Game/${game.id}`} >
                    <div className={markerClass} onMouseEnter={getHovered} onMouseLeave={clearHovered}>
                        <img src={image} alt={game.sport} className="image"/>
                    </div>
                </Link>
    
                <style jsx>{`
                    .marker {
                        width: 4em;
                        height: 4em;
                        background: none;
                    }

                    .image {
                        width: 100%;
                        height: 100%;
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
                    <img src={image} alt={game.sport}
                        style={{ width: '100%', height: '100%', borderRadius: '10px'}}
                    />
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

export default GameMarker