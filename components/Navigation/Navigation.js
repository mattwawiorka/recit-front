import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import classNames from 'classnames';

function Navigation(props) {

    const [showDropDown, setShowDropDown] = useState(false);

    const dropdown = useRef();
    const button = useRef();

    useEffect(() => {
        if (props.subscribeToNotifications) {
            props.subscribeToNotifications();
        }
    }, [])

    let dropDownClass = classNames({
        'dropdown': true,
        'show': showDropDown
    });

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
            font-size: 2em;
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
        nav .show {
            display: grid;
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

    if (props.loggedIn) {
        return (
            <React.Fragment>
                <nav>
                    <div className="content">
                        <Link href="/">
                            <div className="nav-title">
                                <img src="/rec-it.png" alt="Recit"
                                style={{ width: '64px', height: '64px', borderRadius: '10px'}}/>
                            </div>
                        </Link>
                        <div className="links">
                            <Link href='/Inbox' shallow={true}>
                                {props.unread > 0 ? <a>{"Inbox (" + props.unread + ")"}</a> : <a>Inbox</a>}
                            </Link>
                            {props.showLogout ?
                            <a 
                                href="/" 
                                onClick={props.logout}
                            >Logout</a> 
                            :
                            <Link href='/Profile/[user]' as={`/Profile/${props.user}`}>
                                <a>{props.userName}</a>
                            </Link>
                            }
                        </div>
                        <i className="material-icons menu" onClick={() => setShowDropDown(!showDropDown)} ref={button}>menu</i>
                    </div>
                    <div className={dropDownClass} ref={dropdown}>
                        <Link href='/Inbox' shallow={true}>
                            <a>Inbox</a>
                        </Link>
                        {props.logout ?
                        <a 
                            href="/" 
                            onClick={props.logout}
                        >Logout</a> 
                        :
                        <Link href='/Profile/[user]' as={`/Profile/${props.user}`}>
                            <a>{props.userName}</a>
                        </Link>
                        }
                    </div>
                </nav>
            
                {style}
                
            </React.Fragment>        
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
                        <i className="material-icons menu" onClick={() => setShowDropDown(!showDropDown)} ref={button}>menu</i>
                    </div>
                    <div className={dropDownClass} ref={dropdown}>
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
};

export default Navigation;