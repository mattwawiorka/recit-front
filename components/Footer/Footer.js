import React, { Component } from 'react';

class Footer extends Component {

    render() {
        return(
            <React.Fragment>
                <div className="container">
                    <p></p>
                </div>

                <style jsx>{`
                    .container {
                        width: 100vw;
                        height: 8vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    p {
                        text-align: center;
                        color: white;
                    }
                `}</style>
            </React.Fragment>
        );
    }
}

export default Footer;