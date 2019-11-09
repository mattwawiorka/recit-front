import React, { Component } from 'react';

class CommentList extends Component {
    constructor(props) {
        // props
        super(props)
        // state
        // bind
    }

    componentDidMount() {
        this.props.subscribeToMore();
    }

    render() {
        const rows = []
        if (this.props.comments) {    
            this.props.comments.forEach((comment) => {
                rows.push(
                <React.Fragment key={comment.id}>
                    <div>{comment.userName} - {comment.content}</div>
                </React.Fragment>
                );
            });
        }
        return (

        <React.Fragment>

        
        <div className="container">
            {rows}
        </div>

        <style jsx>{`
            .container {
                display: flex;
                flex-direction: column;
                background-color: var(--greenapple); /* Orange */
                color: #ffffff;
                width: 100%;
                height: 100%;
                padding: 1em;
                border-radius: 25px;
                overflow: auto;
            }
        `}</style>
        </React.Fragment>
        );
    }
}

export default CommentList;