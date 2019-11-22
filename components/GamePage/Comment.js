import React, { Component } from 'react';
import dateTool from '../../lib/dateTool';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Link from 'next/link';

const DELETE_COMMENT = gql`
    mutation DeleteComment($id: ID!) {
        deleteComment(id: $id) {
            id
            user
        }
    }
`;

const UPDATE_COMMENT = gql`
    mutation UpdateComment($id: ID!, $content: String!) {
        updateComment(id: $id, content: $content) {
            id
            user
        }
    }
`;

class Comment extends Component {
    constructor(props) {
        // props
        super(props)
        // state
        this.state = {
            content: this.props.comment.content,
            textAreaRows: this.props.comment.content.split("\n").length,
            showSave: false
        };
    }

    componentDidMount() {
        this.props.refetch();
    }

    handleChange = (input) => (e) => {
        this.setState({ 
            [input]: e.target.value
         });
        
        if (e.target.value !== this.state.content) {
            // This isn't perfect, rows not increasing at correct pace
            const rowHeight = 24;
            const currentRows = Math.ceil(e.target.scrollHeight / rowHeight);

            this.setState({
                textAreaRows: currentRows,
                showSave: true
            })
            
        } 
        
        if (e.target.value === this.props.comment.content) {
            console.log('this hitting?')
            this.setState({
                showSave: false
            })
        }
    };

    render() {
        const { comment } = this.props;
        return (
            <React.Fragment key={comment.id}>
                
                <div className="comment">
                    <div className="heading">
                        <div className="userName">
                            <Link href={`/Profile?id=${comment.user}`} as='/'>
                                <a>{comment.userName}</a>
                            </Link>
                        </div>
                         
                        {this.props.currentUser ? 
                            <Mutation
                                mutation={DELETE_COMMENT}
                                variables={{ id: comment.id }}
                            >{deleteComment =>
                            <strong onClick={e => this.props.handleUpdate(deleteComment,e)} id="editButton">...</strong> 
                            }
                            </Mutation>
                            : 
                            null}  
                        
                        <div className="dateTime">
                            {dateTool.getDateTime(parseInt(comment.dateTime))}
                        </div>
                    </div>
                    <div className="body">
                        {this.props.currentUser ? 
                            <Mutation
                                mutation={UPDATE_COMMENT}
                                variables={{ id: comment.id, content: this.state.content }}
                            >{updateComment => (
                                <form
                                onSubmit={e => {
                                    this.setState({
                                        showSave: false
                                    })
                                    this.props.handleUpdate(updateComment,e)
                                }}>
                                <textarea 
                                    id="status" 
                                    onChange={this.handleChange("content")} 
                                    rows={this.state.textAreaRows}
                                    value={this.state.content}
                                    autoComplete="off"
                                />   
                                {this.state.showSave ? <input className="saveEditButton" type="submit" value="Save" /> : null}
                                </form>
                            )
                            }
                            </Mutation>
                            : 
                            comment.content} 
                    </div>
                </div>

                
                <style jsx>{`
                    .comment {
                        display: block;
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
                        width: 100%;
                        display: inline-block;
                    }

                    .userName {
                        display: inline-block;
                        width: 80%;
                        font-weight: bold;
                    }

                    #editButton {
                        width: 20%;
                        text-align: center;
                        padding-left: 12%;
                        cursor: pointer;
                    }

                    .dateTime {
                        color: #616770;
                        font-size: 0.8em;
                    }

                    .body {
                        max-width: 100%;
                        word-wrap: break-word;
                        padding: 0.5em;
                    }

                    textarea {
                        display: inline-block;
                        width: 80%;
                        border: none;
                        resize: none;
                        outline: none;
                        overflow: hidden;
                        font-size: 1em;
                        font-family: "IBM Plex Sans",Verdana,Geneva,Tahoma,sans-serif;
                    }

                    .saveEditButton {
                        display: inline-block;
                        width: 20%;
                        height: 40%;
                        background-color: var(--darkermatter);
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-weight: bold;
                        text-align: center;
                    }
                `}</style>
            </React.Fragment>  
        );
    }
}

export default Comment;