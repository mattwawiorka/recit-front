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

    render() {
        const rows = []

        if (this.props.comments) {    
            this.props.comments.forEach((comment) => {
                rows.push(
                    <Comment 
                        key={comment.node.id} comment={comment.node}
                        updateComment={this.props.updateComment} 
                        deleteComment={this.props.deleteComment}  
                        isOwner={this.props.currentUser === comment.node.user} 
                    />
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