import React, { Component } from 'react';
import Link from 'next/link';
import withAuth from '../../lib/withAuth';

class Navigation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            loggedIn: this.props.auth.loggedIn(),
            user: this.props.auth.getUser(),
            userName: this.props.auth.getUserName()
        };

        this.dropdown = React.createRef();
        this.button = React.createRef();
    }

    componentDidMount() {
        this.setState({
            loading: false
        })

        this.menu();

    }

    menu = () => {
        if (this.state.loading) {
            return;
        }
        var dropdown = this.dropdown.current;
        var button = this.button.current;
        if (dropdown.style.display === "none") {
            dropdown.style.display = "grid";
            button.innerHTML = "close";
        } else {
            dropdown.style.display = "none";
            button.innerHTML = "menu";
        }
        addEventListener("resize", () => {
            if (window.innerWidth > 700) {
                dropdown.style.display = "none";
                button.innerHTML = "menu";
            }
        });
    }

    render() {

        const style = <style jsx="true">{`
            nav {
                display: grid;
                grid-template-rows: minmax(min-content, 10vh) min-content;
            }
            nav .content {
                display: grid;
                place-items: center;
                grid-auto-flow: column;
                align-content: space-evenly;
            }
            nav .nav-title:hover {
                filter: opacity(80%);
                cursor: pointer;
                -webkit-user-select: none;
            }
            .links > a {
                color: white;
                font-size: 1.5em;
                font-weight: bold;
                text-align: center;
            }
            nav .content .menu {
                display: none;
            }
            nav .content .menu:hover {
                filter: opacity(50%);
                cursor: pointer;
                -webkit-user-select: none;
            }
            nav .content .links {
                display: inline-block;
            }
            nav .content .links a {
                margin-left: 1em;
            }
            nav .dropdown {
                display: none;
                background-color: var(--greenapple);
                text-align: center;
            }
            nav .dropdown a {
                color: white;
                font-weight: bold;
                padding: 20px;
            }
            nav .dropdown a:hover {
                color: var(--greenapple);
                background-color: var(--greyapple);
            }
            @media only screen and (max-width: 700px) {
                nav .content .menu { display: initial;}
                nav .content .links { display: none;}
            }
        `}</style>

        if (this.state.loading) {
            return (
                <div>
                    <nav>
                        <div className="content">
                            <Link href="/">
                                <div className="nav-title">
                                    <img src="/rec-it.png" alt="Recit"
                                    style={{ width: '64px', height: '64px', borderRadius: '10px', position: 'fixed', left: '20%', top: '1.5%'}}/>
                                </div>
                            </Link>
                        </div>
                    </nav>
                

                    <style jsx>{`
                        nav {
                            display: grid;
                            grid-template-rows: minmax(min-content, 10vh) min-content;
                        }
                        nav .content {
                            display: grid;
                            place-items: center;
                            grid-auto-flow: column;
                            align-content: space-evenly;
                        }
                    `}</style>
                </div>        
            );
        }

        if (this.state.loggedIn) {
            return(
                <div>
                    <nav>
                        <div className="content">
                            <Link href="/">
                                <div className="nav-title">
                                    <img src="/rec-it.png" alt="Recit"
                                    style={{ width: '64px', height: '64px', borderRadius: '10px'}}/>
                                </div>
                            </Link>
                            <div className="links">
                                {/* <Link href="/About">
                                    <a>About</a>
                                </Link> */}
                                <Link href='/Inbox'>
                                    <a>Inbox</a>
                                </Link>
                                <Link href='/Profile/[user]' as={`/Profile/${this.state.user}`}>
                                    <a>{this.state.userName}</a>
                                </Link>
                                <a 
                                    href="/" 
                                    onClick={this.props.auth.logout}
                                >Logout</a>
                            </div>
                            <i className="material-icons menu" onClick={() => this.menu()} ref={this.button}>menu</i>
                        </div>
                        <div className="dropdown" ref={this.dropdown}>
                            {/* <Link href="/About">
                                <a>About</a>
                            </Link> */}
                            <Link href='/Inbox'>
                                <a>Inbox</a>
                            </Link>
                            <Link href='/Profile/[user]' as={`/Profile/${this.state.user}`}>
                                <a>{this.state.userName}</a>
                            </Link>
                            <a 
                                href="/" 
                                onClick={this.props.auth.logout}
                            >Logout</a>
                        </div>
                    </nav>
                
                    {style}
                    
                </div>        
            );
        }
        else {
            return (
                <div>
                    <nav>
                        <div className="content">
                            <Link href="/">
                                <div className="nav-title">
                                    <img src="/rec-it.png" alt="Recit"
                                    style={{ width: '64px', height: '64px', borderRadius: '10px'}}/>
                                </div>
                            </Link>
                            <div className="links">
                                <Link href="/About">
                                    <a>About</a>
                                </Link>
                                <Link href="/Login">
                                    <a>Login</a>
                                </Link>
                                <Link href="/Signup">
                                    <a>Signup</a>
                                </Link>
                            </div>
                            <i className="material-icons menu" onClick={() => this.menu()} ref={this.button}>menu</i>
                        </div>
                        <div className="dropdown" ref={this.dropdown}>
                            <Link href="/About">
                                <a>About</a>
                            </Link>
                            <Link href="/Login">
                                <a>Login</a>
                            </Link>
                            <Link href="/Signup">
                                <a>Signup</a>
                            </Link>
                        </div>
                    </nav>

                    {style}
                    
                </div>        
            );
        }
    }
};

export default withAuth(Navigation);