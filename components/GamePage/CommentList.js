import React, { useEffect, useRef, useCallback } from 'react';
import Comment from './Comment';

function CommentList(props) {

    useEffect(() => {
        props.subscribeToMore();
    }, [])


    const observer = useRef();
    const lastCommentRef = useCallback(node => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {    
                observer.current.disconnect();
                if (props.hasMore) {
                    props.loadMore();
                } 
            }
        })
        if (node) observer.current.observe(node)
    },[props.comments, props.hasMore])
    
    const rows = []

    if (props.comments) {    
        props.comments.map((comment, index) => {
            if (comment.node.type === 4) return
            if (props.comments.length === index + 1) {
                rows.push(
                    <React.Fragment key={comment.node.id}>
                        <Comment 
                            comment={comment.node}
                            updateComment={props.updateComment} 
                            deleteComment={props.deleteComment}  
                            isOwner={props.currentUser === comment.node.userId && !props.isOver} 
                        />
                        <div ref={lastCommentRef}></div>
                    </React.Fragment>
                );
            } else {
                rows.push(
                    <React.Fragment key={comment.node.id}>
                        <Comment 
                            comment={comment.node}
                            updateComment={props.updateComment} 
                            deleteComment={props.deleteComment}  
                            isOwner={props.currentUser === comment.node.userId && !props.isOver} 
                        />
                    </React.Fragment>
                );
            }
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

export default CommentList;