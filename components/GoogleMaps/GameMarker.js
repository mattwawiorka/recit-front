import React, { useCallback } from 'react';
import classNames from 'classnames';

import Link from 'next/link';

const GameMarker = (props) => {

    const { id, sport, title, image } = props;

    const getHovered = useCallback(() => {
        props.onMouseEnter(id, true)
    })

    let markerClass = classNames({
        'marker': true,
        'hovered': props.hovered
    })

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
                }

                .hovered {
                    transform: scale(1.5);
                    cursor: pointer;
                }

            `}</style>
        </>
    );
}

export default GameMarker