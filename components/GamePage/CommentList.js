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
                <tr key={comment.id}>
                    <th>{comment.userName} - {comment.content}</th>
                </tr>
                );
            });
        }
        return (

        <div className="jumbotron text-center">

            <br />

            <table className="table table-hover">
            <thead>
                <tr>
                <th>Comments</th>
                <th></th>
                </tr>
            </thead>
            <tbody>{rows}</tbody>
            </table>

            <style jsx>{`
                .jumbotron {
                    background-color: var(--greenapple); /* Orange */
                    color: #ffffff;
                }
            `}</style>
        </div>
        );
    }
}

export default CommentList;