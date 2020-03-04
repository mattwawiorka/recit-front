import React, { useCallback } from 'react';
import classNames from 'classnames';
import cookie from 'js-cookie';

import Link from 'next/link';

function GameMarker(props) {

    const { id, sport, image, hovered, clearHovered, onMouseEnter } = props;

    const getHovered = useCallback(() => {
        onMouseEnter(id, true)
    })

    let markerClass = classNames({
        'marker': true,
        'hovered': hovered
    })

    if (cookie.get('token')) {
        return (
            <React.Fragment>
                <Link href='/Game/[game]' as={`/Game/${id}`} >
                    <div className={markerClass} onMouseEnter={getHovered} onMouseLeave={clearHovered} shallow="true" >
                        <img src={image} alt={sport} className="icon"/>
                    </div>
                </Link>
    
                <style jsx>{`
                    .marker {
                        width: 42px;
                        height: 42px;
                        background: none;
                        animation: bounce 1s;
                    }

                    .icon {
                        width: 42px;
                        height: 42px;
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
    } else {
        return (
            <React.Fragment>
                <div className={markerClass} onMouseEnter={getHovered} onMouseLeave={clearHovered}>
                    <img src={image} alt={sport} className="icon" />
                </div>
    
                <style jsx>{`
                    .marker {
                        width: 42px;
                        height: 42px;
                        background: none;
                        animation: bounce 1s;
                    }

                    .icon {
                        width: 42px;
                        height: 42px;
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
    
}

export default GameMarker;