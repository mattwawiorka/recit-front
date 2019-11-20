import React, { Component } from 'react';

class UserProfile extends Component {
    constructor(props) {
        // props
        super(props)
        // state
        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        console.log('profile mounted')
        this.setState({
            loading: false
        })
    }

    render() {
        const id = this.props.user;

        return(
            <React.Fragment>
            <div className="container">
                <span className="heading section">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQYAAADBCAMAAAAace62AAAAPFBMVEX+/v6wsLCtra3a2tr8/Pz19fWzs7P4+Pi9vb3Ly8vBwcHo6OjY2Njw8PDT09Py8vLj4+O4uLjGxsbPz88cCaLbAAAEw0lEQVR4nO2d2ZakIAxAFTdQy/X//3VUtNqa2hSTDqFzn3p5kXskhKAxigRBEARBEARB4EmRtW2bpdSXQUZR1YPO1Urcl2N3o76m36Ya+2XwO+bf8zLJqC/t17iZ+NHAgwud/IkZkvTvHGwqYtNSXyQ2Sf7ZwXpPDEGHie6IBCvCFNQXi0VbHpRgp0ZCfb04JF9iwpMIHeCqkZ65FVYPqqO+amhuR6PCo4iR+rph6VwkzB5K6iuHJHG0MHnow0mm3C3MHkJZOa9YCOd+cI0Ldw+aegQQ3C5amDwM1GO4TpFftTB5qKlHcZnzWdMrDxX1MC5SQ1iI45x3mGxhLHAPDxpIA+9pcXWt3NFTj8WdFGCV2FB8yw9A8XGFejTOQErgmzxc20s8kVOPx5Ee1ELMtBZVwd4MccxzizVAa1AcS7QptIVYNdRjcgAwddrgmEIZeA0cZwVgBnnXwG+tgNpbPmgw1KM6DUJo4JhBNRgaFLvqC0jx7UkDu8ceECIkxxiJcTPw22UWOBq4nXBjrJcMK7PXz6peauB2zi8aFkTDgmhYkBC5kOFo4La3gq89LRrY1Z8wLDA8ugKuzq8a2B3oItTgOFbhgI+sVg3UozoN+GHNDL8DmwLBAr+FIoo0ggZ2ERKnGMmuFImxq2CXSi+AVyP5VSJnwGcFv+VyBnp3xW5ftQL8gAO/QwoLbJBkV3K5A/aM7KKBYdJggUyoOb9cAniQyTUyzMBVJHmmThtwuQPDPHoHUBGKZwL5A8yiyXtKzIBUoZi/YzQDkEtyXiXuXE6iuAcGS9pf88DvcOI12aXKA8cC5Gsypx4WoVmIosJ5XoQyIywOnV2shSCi447RwYPKQ1gpH+nisyLUwD9reqY4l0ipOLQJsXG4F1rY3dCiqD42M5TS4UWFPWnzXYRSJdu643ES/ak53PQ/E/adcOfW9OqliumPQxfi8vCOLBl69R+xbqq/5GCluHX1OJQTg2mSKvjOqYIgCIIgCJdJ07RYmH6gvpZfJm2rLmlMqfs+t59jsJ9oyPNel2asu6oNW0lWJWb3YY6XWytLrk1dsXtp4DtF1ZT529G/EZKXTReOi6IzT58mOS4jN10A1bis1m4G9ip0zXr3mdXfvkxyWEXfcDXRlTAONhOaYcG+aN5+psfdRDzyipiZAXdgRaiBz9zAksBLRIMnwYowDLLM8ye2DiJ8f+ihQGn39CxCez0zOtz5sPPg8w0B3i/0k4jS0wjRXnjQy8WDn4/CoLyU/VmEh2klyhv63zx41xuNwoJ/D03Cdps/4cGrJnE098LiwaP7AaVh6lEP3iQQOB2/Dnvw5DkpyI9xOOFHEeJ3thHvUV40I6cLj3cPHoRJnB54Jz3Qp9XUU2KBfFpQrpU/kK+a1KvEBu2umz4+WoijpC83A+3t4EdkmCGNDggNz1wh/GaDDznDBuHWAuUbFI4QdoVCaZTqCtmswGmi7ApZRu3POjFDVp91edEWD7LGJx4tlzNU+yt/UkgLUSLp1ZyYZgXNg4M4bebdIerFLRpEg2gQDaJBNIgG0SAaRINoEA2iQTSIBtEgGkSDaBANokE0iAbRIBosomFBNCyIhgUyDZ5B9HpJnfiFp28rC4IgCIIgCELQ/AOcpFAvjfMo8wAAAABJRU5ErkJggg==" 
                    id="profilePic"/>
                    <div className="nameStatus">
                        <h3 id="userName">{this.props.user.name}</h3>
                        <br />
                        <textarea 
                            readOnly 
                            id="status" 
                            maxLength='40' 
                            placeholder="What's your status?"
                            value={this.props.user.status} />
                    </div>  
                </span>

                <span className="demographics section">

                </span>

                <span className="stats section">

                </span>
            </div>

                    

            <style jsx>{`
                .container {
                    width: 100%;
                    height: 76vh;
                    display: block;
                    justify-content: center;
                    // background-color: white;
                    border-radius: 25px;
                    // margin-top: 2em;
                    // margin-left: 1em;
                    padding: 1.5em;
                }

                .section {
                    display: block;
                    background-color: var(--greenapple);
                    width: 100%;
                    border-radius: 15px;
                    margin-bottom: 1em;
                }
                
                .heading {
                    display: inline-block;
                    height: 25%;
                    background-color: var(--greenapple);
                    border-radius: 15px;
                }

                #profilePic {
                    display: inline-block;
                    width: 30%;
                    height: 100%;
                    border-radius: 15px;
                }

                .nameStatus {
                    display: inline-block;
                    width: 70%;
                    height: 100%;
                    padding-left: 1em;
                    padding-top: 1em;
                    vertical-align: top;
                    font-weight: 800;
                    text-align: center;
                    color: white;
                }

                #userName {
                    font-size: 2.5em;
                }

                #status {
                    color: white;
                    font-size: 1.2em;
                    font-weight: 600;
                    text-align: center;
                    font-style: italic;
                    background: var(--greenapple);
                    border: none;
                    resize: none;
                    outline: none;
                }
            `}</style>
        </React.Fragment>
        );
    }
}

export default UserProfile;