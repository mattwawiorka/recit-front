import Link from 'next/link';

const GameMarker = (props) => {

    const { id, sport, title, image } = props;

    return (
        <>
            <Link href='/Game/[game]' as={`/Game/${id}`} >
                <div className="marker">
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

                .marker:hover {
                    transform: scale(1.5);
                    cursor: pointer;
                }
            `}</style>
        </>
    );
}

export default GameMarker