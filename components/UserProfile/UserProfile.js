import React, { useState, useRef, useCallback, useEffect } from 'react';
import dateTool from '../../lib/dateTool';
import cookie from 'js-cookie';

function UserProfile(props) {
    let pastGames = []; 

    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState();
    const [dob, setDOB] = useState();
    const [gender, setGender] = useState();
    const [status, setStatus] = useState(props.user.status);
    const [picMode, setPicMode] = useState(false);
    // Store new pic file and new pic object url for preview for each of the 4 pics
    const [newProfile, setNewProfile] = useState(null);
    const [profilePreview, setProfilePreview] = useState(null);
    const [newPic1, setNewPic1] = useState(null);
    const [pic1Preview, setPic1Preview] = useState(null);
    const [newPic2, setNewPic2] = useState(null);
    const [pic2Preview, setPic2Preview] = useState(null);
    const [newPic3, setNewPic3] = useState(null);
    const [pic3Preview, setPic3Preview] = useState(null);
    // Which pic is being viewed in the pic viewer
    const [viewerPic, setViewerPic] = useState(null);
    const [viewing, setViewing] = useState(null);

    const overlay = useRef();

    const fileCheck = useCallback((e) => {
        let files = e.target.files 
        let err = ''

        // Only allow one image 
        if (files.length > 1) {
            err = 'Only 1 image can be uploaded at a time\n'
        } 

        let size = 200000;
        if (files[0].size > size) {
            err += files[0].type + ' is too large\n';
        }
        
        // list allow mime type
        const types = ['image/png', 'image/jpeg', 'image/jpg']

        // compare file type find doesn't matach
        if (types.every(type => files[0].type !== type)) {
            // create error message and assign to container   
            err += files[0].type+' is not a supported format\n';
        }

        if (err !== '') { // if message not same old that mean has error 
            e.target.value = null // discard selected file
            console.log(err)
            return false;
        }

        return true;
    }, []);

    props.pastGames.map( game => {
        let row;

        row = 
            <React.Fragment key={game.node.id}>
                <div className="past-game">
                    <img className="sport-image" src={game.node.image} />
                    <div className="game-title">{game.node.title}</div>
                    <div className="game-date">{dateTool.getMonthYear(game.node.dateTime)}</div>
                </div>

                <style jsx="true">{`
                    .past-game {
                        display: block;
                        width: 100%;
                        color: white;
                        font-weight: bold;
                        display: flex;
                        justify-content: space-between;
                        min-height: 4em;
                        max-height: 6em;
                        padding: 0.5em;
                        overflow: hidden;
                        font-style: italic;
                    }

                    .sport-image {
                        display: inline-block;
                        width: 2.5em;
                        height: 2.5em;
                    }

                    .game-title {
                        display: inline-block;
                    }

                    .game-date {
                        display: inline-block;
                    }
                `}</style>
            </React.Fragment>

        pastGames.push(row)
    });

    useEffect(() => {
        if (overlay.current) {
            overlay.current.addEventListener("click", e => {
                setPicMode(false)
            })
        }
    }, [picMode])

    return (
        <React.Fragment>
            {picMode ? <div className="overlay" ref={overlay}></div> : null}
            <div className="profile-container">
                <section className="user-main">
                    <article className="profile-pic"> 
                        <img 
                            src={profilePreview ? profilePreview : props.user.profilePic}
                            className="image-round"
                            onClick={() => {
                                setViewerPic(profilePreview ? profilePreview : props.user.profilePic);
                                setViewing('profile');
                                setPicMode(true);
                            }}
                        />
                    </article>

                    {picMode ?
                    <div className="pic-viewer" >
                        <label htmlFor="profile-upload" className="btn-pic-upload">
                        <img 
                            src={viewerPic}
                            className="image-round"
                        />
                        </label>
                        {props.owner ?
                        <input 
                            type="file" 
                            id="profile-upload"
                            onChange={ e => {
                                if (fileCheck(e)) {
                                    if (viewing === 'profile') {
                                        setNewProfile(e.target.files[0]);
                                        setProfilePreview(URL.createObjectURL(e.target.files[0]));
                                    }
                                    else if (viewing === 'pic1') {
                                        setNewPic1(e.target.files[0]);
                                        setPic1Preview(URL.createObjectURL(e.target.files[0]));
                                    }
                                    else if (viewing === 'pic2') {
                                        setNewPic2(e.target.files[0]);
                                        setPic2Preview(URL.createObjectURL(e.target.files[0]));
                                    }
                                    else if (viewing === 'pic3') {
                                        setNewPic3(e.target.files[0]);
                                        setPic3Preview(URL.createObjectURL(e.target.files[0]));
                                    }
                                }
                                setPicMode(false);
                            }}
                        />
                        :
                        null
                        }
                    </div>
                    :
                    null
                    }
                    
                    <article className="user-heading">
                        <h1 className="name">{props.user.name}<span className="jersey-number">{props.user.number}</span></h1>
                        {props.owner ? 
                        <React.Fragment>
                            {(editMode || newProfile || newPic1 || newPic2 || newPic3) ?
                            <React.Fragment>
                                <button 
                                    className="btn-edit"
                                    onClick={() => {
                                        setEditMode(false);
                                        setNewProfile(null);
                                        setProfilePreview(null);
                                        setNewPic1(null);
                                        setPic1Preview(null);
                                        setNewPic2(null);
                                        setPic2Preview(null);
                                        setNewPic3(null);
                                        setPic3Preview(null);
                                    }}
                                >Cancel</button>
                                <button 
                                    className="btn-edit btn-save"
                                    onClick={() => {
                                        // If uploading pics, make REST API request
                                        if (newProfile || newPic1 || newPic2 || newPic3) {
                                            const data = new FormData();
                                            data.append('file', newProfile);
                                            data.append('file', newPic1);
                                            data.append('file', newPic2);
                                            data.append('file', newPic3);

                                            fetch(`http://localhost:8080/post-image?user=${props.userId}`, {
                                                method: 'POST',
                                                headers: {
                                                    Authorization: 'Bearer ' + cookie.get('token')
                                                },
                                                body: data
                                            })
                                            .then( response => {
                                                props.updateProfile({ variables: {
                                                    userId: props.userId,
                                                    userInput: {
                                                        profilePic: newProfile ? "http://localhost:8080/images/" + props.user.id + "/" + newProfile.name : null,
                                                        pic1: newPic1 ? "http://localhost:8080/images/" + props.user.id + '/' + newPic1.name : null,
                                                        pic2: newPic2 ? "http://localhost:8080/images/" + props.user.id + '/' + newPic2.name : null,
                                                        pic3: newPic3 ? "http://localhost:8080/images/" + props.user.id + '/' + newPic3.name : null,
                                                        name: name,
                                                        dob: dob,
                                                        gender: gender,
                                                        status: status.trim()
                                                    }
                                                }})
                                                .then( response => {
                                                    setNewProfile(null);
                                                    setNewPic1(null);
                                                    setNewPic2(null);
                                                    setNewPic3(null);
                                                    setEditMode(false);
                                                })
                                            })
                                        } else {
                                            props.updateProfile({ variables: {
                                                userId: props.userId,
                                                userInput: {
                                                    name: name,
                                                    dob: dob,
                                                    gender: gender,
                                                    status: status
                                                }
                                            }})
                                            .then( response => {
                                                setEditMode(false);
                                                props.refetch();
                                            })
                                        }
                                    }}
                                >Save</button>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <button 
                                    className="btn-edit"
                                    onClick={() => {
                                        setEditMode(true);
                                    }}
                                >Edit</button>
                            </React.Fragment>
                            }
                        </React.Fragment>
                        :
                        null}
                    </article>  

                    <article className="demographics">
                        <p className="city">{props.user.city}</p>
                        <p className="joined">{"Member since " + props.joinDate}</p>
                        {editMode ? 
                        <React.Fragment>
                            <p className="real-name">{"Name: "} 
                                <input 
                                    className="input-fields" 
                                    type="text"
                                    placeholder={props.user.name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </p>
                            <p className="age">{"Birth Date: "}
                            <input 
                                className="input-fields" 
                                type="date"
                                onChange={(e) => setDOB(e.target.value)}
                            />
                            </p>
                            <p className="gender">{"Gender: "}
                                <select 
                                    className="input-fields" 
                                    type="date"
                                    defaultValue={props.user.gender}
                                    onChange={(e) => setGender(e.target.value)}
                                >
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                    <option value="N">Non-binary</option>
                                </select>
                            </p>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <p className="real-name">{"Name: " + props.user.name}</p>
                            <p className="age">{"Age: " + props.age}</p>
                            <p className="gender">{"Gender: " + props.user.gender}</p>
                        </React.Fragment>
                        }
                    </article>

                    <article className="status">
                        <textarea
                            className="status-input"
                            readOnly={!props.owner || !editMode}
                            defaultValue={props.user.status}    
                            autoComplete="off"
                            maxLength="250"
                            onChange={e => {
                                if (e.target.value.split('\n').length > 17) {
                                    return;
                                }
                                setStatus(e.target.value)
                            }}
                        />
                    </article>
                </section>

                <section className="player-history">
                    <div className="stats">
                        <p className="stats-title">Games played: <span className="stat">{props.gamesPlayed}</span></p>
                        <p className="stats-title">Top sport: <span className="stat">{props.topSport.charAt(0) + props.topSport.substring(1).toLowerCase()}</span></p>
                    </div>
                    {pastGames}
                    {props.hasMore ?
                    <button className="btn-load-more" onClick={props.loadMore}>
                         + Load more
                    </button>
                    :
                    null}
                </section>

                <section className="pic-gallery">
                    <div className="pic-carousel">

                    
                    <div className="gallery-pic">
                        <img 
                            src={pic1Preview ? pic1Preview : props.user.pic1}
                            className="image-round"
                            onClick={() => {
                                setPicMode(true);
                                setViewerPic(pic1Preview ? pic1Preview : props.user.pic1);
                                setViewing('pic1');
                            }}
                        />
                    </div>
                    <div className="gallery-pic">
                        <img 
                            src={pic2Preview ? pic2Preview :  props.user.pic2}
                            className="image-round"
                            onClick={() => {
                                setPicMode(true);
                                setViewerPic(pic2Preview ? pic2Preview : props.user.pic2)
                                setViewing('pic2');
                            }}
                        />
                    </div>
                    <div className="gallery-pic">
                        <img 
                            src={pic3Preview ? pic3Preview : props.user.pic3}
                            className="image-round"
                            onClick={() => {
                                setPicMode(true);
                                setViewerPic(pic3Preview ? pic3Preview : props.user.pic3)
                                setViewing('pic3');
                            }}
                        />
                    </div>
                    </div>
                </section>

            </div>
                

            <style jsx>{`
                .overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 100%;
                    background-color: rgba(0,0,0,0.5);
                    z-index: 10;
                    animation-duration: .75s;
                    animation-name: fadein;
                }

                br {
                    line-height: 0.5em;
                }

                .pic-viewer {
                    z-index: 11;
                    position: absolute;
                    left: 0; 
                    right: 0; 
                    margin-left: auto; 
                    margin-right: auto; 
                    width: 720px;
                    height: 720px;
                    background-color: white;
                    border-radius: 10px;
                    animation-duration: 1.5s;
                    animation-name: fadein;
                    overflow: hidden;
                }

                .profile-container {
                    width: 100%;
                    height: 76vh;
                    display: block;
                    justify-content: center;
                    padding: 1.5em;
                    // padding-top: 100%;
                    // position: relative;
                }

                section {
                    display: block;
                    background-color: var(--greenapple);
                    width: 100%;
                    height: 25%;
                    border-radius: 15px;
                    margin-bottom: 1em;
                    color: white;
                    font-weight: bold;
                    // position: absolute;
                    // top: 0;
                    // left: 0;
                    // bottom: 0;
                    // right: 0;
                }
                
                .user-main {
                    height: 50%;
                    display: inline-block;
                }

                article {
                    // border: 2px solid red;
                }

                .profile-pic {
                    display: inline-block;
                    float: left;
                    width: 33%;
                    height: 100%;   
                    cursor: pointer;
                }

                .image-round {
                    width: 100%;
                    height: 100%;
                    border-radius: 15px;
                    border: 2px solid white;
                    cursor: pointer;
                }

                #profile-upload {
                    display: none;
                }

                .user-heading {
                    display: inline-block;
                    border-bottom: 2px solid white;
                    height: 15%;
                    margin-bottom: 1em;
                    width: 66%;
                    vertical-align: top;
                    font-weight: 800;
                }

                .name {
                    display: inline-block;
                    font-size: 2.5em;
                    padding-left: 0.5em;
                }

                .jersey-number {
                    color: white;
                    font-size: 0.65em;
                    margin-left: 2em;
                    font-family: 'Bitter', serif;
                }

                .btn-edit {
                    float: right;
                    width: 5em;
                    height: 2em;
                    margin-top: 1em;
                    margin-right: 1em;
                    font-size: 0.9em;
                }

                .btn-save {
                    animation-duration: 1s;
                    animation-name: fadein;
                }

                @keyframes fadein {
                    from {
                        opacity: 0;
                    } 
                    
                    to {
                        opacity: 1;
                    }
                }

                .demographics {
                    display: inline-block;
                    height: 80%;
                    width: 25%;
                    vertical-align: top;
                    padding-left: 1em;
                    line-height: 1.5em;
                }

                .city {
                    font-style: italic;
                }

                .joined {
                    font-style: italic;
                    margin-bottom: 1em;
                }

                .real-name {
                    font-size: 1.2em;
                }

                .age {
                    font-size: 1.2em;
                }

                .gender {
                    font-size: 1.2em;
                }

                .input-fields {
                    width: 100%;
                    padding: 12px 20px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-sizing: border-box;
                    animation-duration: 1s;
                    animation-name: fadein;
                }

                .status {
                    display: inline-block;
                    width: 40%;
                    padding-left: 2em;
                    height: 80%;
                }

                .status-input {
                    width: 100%;
                    height: 100%;
                    resize: none;
                    overflow: hidden;
                    border: none;
                    font-size: 1.1em;
                    font-weight: bold;
                    font-style: italic;
                    color: var(--darkermatter);
                    background-color: var(--greenapple);
                }

                .player-history {
                    display: inline-block;
                    height: min-content;
                    width: 35%;
                    padding: 1em;
                }
    
                .btn-load-more {
                    transform: translate(-50%);
                    margin: 0 50%;
                    width: 10em;
                    background-color: var(--greenapple);
                    color: var(--darkmatter);
                    text-align: center;
                    font-size: 1em;
                    cursor: pointer;
                    outline: none;
                }

                .stats {
                    color: var(--darkmatter);
                    font-weight: bold;
                    font-size: 1.2em;
                    margin-bottom: 1em;
                    border-bottom: 2px solid white;
                    width: 65%;
                }

                .stats-title {
                    margin-bottom: 1em;
                    font-size: 0.9em;
                }

                .stat {
                    font-size: 1.2em;
                    float: right;
                }

                .pic-gallery {
                    display: inline-block;
                    width: 60%;
                    vertical-align: top;
                    margin-left: 2em;
                    // background-color: inherit;
                }

                .pic-carousel {
                    display: flex;
                    justify-content: space-between;
                }

                .gallery-pic {
                    display: inline-block;
                    width: 185px;
                    height: 150px;
                    margin: 0.5em;
                }

            `}</style>
        </React.Fragment>
    );
}

export default UserProfile;