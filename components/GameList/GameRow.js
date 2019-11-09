import Link from 'next/link';

const GameRow = ({id, title, sport, venue, date, time}) => {
  return (
    <React.Fragment>
    <Link href={`/Game?id=${id}`} as='/'>
    <li className="container">
      <div className="dateTime">
        <h3>{date}</h3>
        <h3>{time}</h3>
      </div>
      <h3 className="title">{title}</h3>
      <h3>{sport}</h3>
      <h3>{venue}</h3> 
    </li>
    </Link> 

    <style jsx>{`
      .container {
        display: grid;
        grid-template-columns: 10vw 10vw 10vw 10vw;
        grid-gap: 2em;
        grid-auto-rows: 4em;
      }

      li {
        border-bottom-style: groove;
      }

      li:hover {
        background-color: var(--greyapple);
        transform: scale(0.95);
      }

      .title {
        text-align: center;
      }

      .dateTime {
        text-align: center;
        font-size: 0.75em;
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

export default GameRow;