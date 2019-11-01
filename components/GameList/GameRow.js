import Link from 'next/link';

const GameRow = ({id, title, sport, venue}) => {
  return (
    <Link href={`/Game?id=${id}`} as='/'>
      <tr>
        <td>
          <h3>{title}</h3>
        </td>
        <td>
          <p>{sport}</p>
        </td>
        <td>
          <p>{venue}</p>
        </td>
      </tr>
    </Link> 
  );  
}

export default GameRow;