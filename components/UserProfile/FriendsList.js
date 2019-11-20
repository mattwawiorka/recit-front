import React, { Component } from 'react';

class FriendsList extends Component {

    render() {
        return(
            <React.Fragment>
                <div className="container">
                    {/* <p>Announcements</p> */}
                </div>

                <style jsx>{`
                    .container {
                        width: 18vw;
                        height: 76vh;
                        display: flex;
                        justify-content: center;
                        //background-color: white;
                        border-radius: 25px;
                        margin-top: 2em;
                        margin-left: 1em;
                    }
                    p {
                        text-align: center;
                        margin-top: 1em;
                        font-weight: bold;
                        text-decoration: underline;
                    }
                `}</style>
            </React.Fragment>
        );
    }
}

export default FriendsList;