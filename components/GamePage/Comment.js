import React, { Component } from 'react';
import dateTool from '../../lib/dateTool';

class Comment extends Component {

    render() {
        const { comment } = this.props;
        return (
            <React.Fragment key={comment.id}>
                    <div className="comment">
                        <div className="heading">
                            <div className="userName">
                                {comment.userName}
                            </div>
                            <div className="dateTime">
                                {dateTool.getDateTime(parseInt(comment.dateTime))}
                            </div>
                        </div>
                        <div className="body">
                            {comment.content}
                        </div>
                    </div>

                    <style jsx>{`
                        .comment {
                            display: flex;
                            flex-direction: column;
                            //flex-flow: row wrap;
                            max-width: 100%;
                            height: auto;
                            margin-top: 1em;
                            background-color: white;
                            color: black;
                            border-radius: 5px;
                            border-bottom-style: groove;
                            padding: 0.5em;
                            white-space: pre-wrap;
                        }

                        .heading {
                            flex: 2;
                            //flex-basis: 1em;
                        }

                        .userName {
                            font-weight: bold;
                        }

                        .dateTime {
                            color: #616770;
                            font-size: 0.8em;
                        }

                        .body {
                            flex: 5 auto;
                            max-width: 100%;
                            //overflow-x: hidden;
                            word-wrap: break-word;
                            padding: 0.5em;
                        }
                    `}</style>
                </React.Fragment>
        );
    }
}

export default Comment;