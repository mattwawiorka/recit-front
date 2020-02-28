import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import classNames from 'classnames';

function Navigation(props) {
    let links;

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

    let style = 
        <style jsx="true">{`
            nav {
                height: 100%;
                width: 100%;
            }

            .content {
                height: 100%;
                width: 100%;
                padding: 0.35em 20vw 0.15em 20vw;
                display: flex;
                place-items: center;  
            }

            .nav-title {
                flex: 1 1 auto;
            }

            .nav-title > img:hover {
                filter: opacity(80%);
                transform: scale(0.97);
                cursor: pointer;
                -webkit-user-select: none;
            }

            .links {
                flex: 0 0 auto;
                display: flex;
                justify-content: space-evenly;
            }

            .links > a {
                width: max-content;
                margin-left: 1em;
                color: white;
                font-size: 1.5em;
                font-weight: bold;
                text-align: center;
            }

            .links > a:hover {
                transform: scale(0.9);
            }
            
            nav .content .menu {
                display: none;
            }

            nav .content .menu:hover {
                filter: opacity(50%);
                cursor: pointer;
                -webkit-user-select: none;
            }

            .dropdown {
                display: none;
                position: absolute;
                width: 100%;
                height: max-content;
                background-color: var(--greenapple);
                text-align: center;
                z-index: 7;     // Needs to be higher than view button
            }

            .show {
                display: grid;
            }

            .dropdown > a {
                width: 100%;
                color: white;
                font-weight: bold;
                padding: 20px;
            }

            .dropdown > a:hover {
                color: var(--greenapple);
                background-color: var(--greyapple);
            }

            @media only screen and (max-width: 768px) {
                nav .content .menu { display: initial; }
                nav .content .links { display: none; }
            }
        `}</style>

    if (props.user) {
        links = 
        <React.Fragment>
            <Link href='/Inbox'>
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

            {style}
        </React.Fragment>
    } else {
        links = 
        <React.Fragment>
            <Link href="/About">
                <a>About</a>
            </Link>
            <Link href="/Login">
                <a>Login</a>
            </Link>
            <Link href="/Signup">
                <a>Signup</a>
            </Link>

            {style}
        </React.Fragment>
    }

    return (
        <React.Fragment>
            <nav>
                <div className="content">
                    <Link href="/">
                        <div className="nav-title">
                            <img src="/REC-BOARD.png" alt="Recit"
                            style={{ width: '42px', height: '42px', borderRadius: '10px'}}/>
                        </div>
                    </Link>
                    <div className="links">
                        {links}
                    </div>
                    <i className="material-icons menu" onClick={() => setShowDropDown(!showDropDown)} ref={button}>menu</i>
                </div>
                <div className={dropDownClass} ref={dropdown}>
                    {links}
                </div>
            </nav>
        
            {style}
        </React.Fragment>        
    );
};

export default Navigation;