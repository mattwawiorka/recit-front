import React, { Component } from 'react';
import Comment from './Comment';

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

    handleUpdate = (mutation, e) => {
        e.preventDefault();
        mutation()
        .then (result => {
            this.props.refetch();
        })
    }

    render() {
        const rows = []

        if (this.props.comments) {    
            this.props.comments.forEach((comment) => {
                rows.push(
                    <Comment comment={comment} isOwner={this.props.currentUser === comment.user} key={comment.id} refetch={this.props.refetch} handleUpdate={this.handleUpdate} />
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
                    display: block;
                    color: #ffffff;
                    width: 100%;
                    height: 100%;
                    //padding: 1em;
                    //border-radius: 25px;
                    //overflow: auto;
                }

            `}</style>
            </React.Fragment>
        );
    }
}

export default CommentList;