import React, { useCallback } from 'react';
import classNames from 'classnames';

import Link from 'next/link';

function GameMarker(props) {

    const { id, sport, image, loggedIn } = props;

    const getHovered = useCallback(() => {
        props.onMouseEnter(id, true)
    })

    let markerClass = classNames({
        'marker': true,
        'hovered': props.hovered
    })

    if (loggedIn) {
        return (
            <>
                <Link href='/Game/[game]' as={`/Game/${id}`} >
                    <div className={markerClass} onMouseEnter={getHovered} onMouseLeave={props.clearHovered}>
                        <img src={image} alt={sport}
                            style={{ width: '100%', height: '100%', borderRadius: '10px'}}
                        />
                    </div>
                </Link>
    
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
    } else {
        return (
            <>
                <div className={markerClass} onMouseEnter={getHovered} onMouseLeave={props.clearHovered}>
                    <img src={image} alt={sport}
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