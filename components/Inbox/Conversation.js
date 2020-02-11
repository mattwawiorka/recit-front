import Link from 'next/link';
import classNames from 'classnames';
import dateTool from '../../lib/dateTool';

function Conversation(props) {

    const { conversation } = props;

    let message = conversation.node;
    
    const messageClass = classNames({
        'conversation': true,
        'isNew': conversation.isNew
    });

    return (
        <React.Fragment>
            <Link href='/Game/[game]' as={`/Game/${message.gameId}`} shallow={true} >
                <div className={messageClass}>
                    <span className="conversation-heading">
                        <div>
                            {conversation.conversation}
                        </div>
                        <div className="date-time">
                            {dateTool.getDateTime(parseInt(message.createdAt))} 
                        </div>
                    </span>
                    <span className="conversation-content">
                        {message.type === 3 ?
                        message.content.slice(0,7) + " by " + message.author
                        :
                        message.author + (message.type === 4 ? " " : ": ") + message.content}
                    </span>
                </div>
            </Link>

            <style jsx>{`
                .conversation {
                    display: block;
                    font-size: 1.5em;
                    cursor: pointer;
                    // margin-bottom: 0.5em;
                    padding-bottom: 0.5em;
                    color: #616770;
                }

                .isNew {
                    color: black;
                    border-radius: 5px;
                }

                .conversation:hover {
                    cursor: pointer;
                    // transform: scale(0.95);
                    background-color: var(--greyapple);
                }

                .conversation-heading {
                    display: inline-block;
                    width: 30%;
                    border-right: 2px solid var(--greyapple);
                }

                .date-time {
                    color: #616770;
                    font-size: 0.7em;
                    font-style: italic;
                }

                .conversation-content {
                    display: inline-block;
                    width: 70%;
                    padding-left: 0.5em;
                    vertical-align: top;
                    overflow: hidden;
                }
            `}</style>
        </React.Fragment>
    );
}

export default Conversation;