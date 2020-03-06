import React, { useState, useRef, useCallback, useEffect } from 'react';
import dateTool from '../../lib/dateTool';
import cookie from 'js-cookie';
import TextareaAutosize from 'react-textarea-autosize';

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

        let size = 8000000;
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
            alert(err);
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
                        min-height: 56px;
                        // max-height: 80px;
                        padding: 8px 4px;
                        overflow: hidden;
                        font-style: italic;
                    }

                    .past-game > * {
                        display: inline-block;
                        padding: 0 8px;
                    }

                    .game-title {
                        vertical-align: top;
                        width: 40%;
                    }

                    .sport-image {
                        width: 56px;
                        height: 40px;
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

            <div className="profile-container">
                <section className="profile-pic">
                    <div className="profile-pic-container">
                        <img 
                            src={profilePreview ? profilePreview : props.userPics.profile_medium}
                            className="image-round"
                            onClick={() => {
                                setViewerPic(profilePreview ? profilePreview : props.userPics.profile_large);
                                setViewing('profile');
                                setPicMode(true);
                            }}
                        />
                    </div>
                    <div className="heading-mobile">
                        <h1 className="name">{props.user.name}</h1>
                        <h2 className="jersey-number">{props.user.number}</h2>
                        <div className="membership-info-mobile">
                            <p>{props.user.city}</p>
                            <p>{"Member since " + props.joinDate}</p>
                        </div>
                    </div>
                </section>

                <section className="main-info">
                    <article className="user-heading">
                        <h1 className="name">{props.user.name}<span className="jersey-number">{props.user.number}</span></h1>
                    </article>  

                    <div className="col-1">


                    <article className="actions">
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

                                            if (newProfile) {
                                                fetch(process.env.API_URI + `/post-image?user=${props.userId}`, {
                                                    method: 'POST',
                                                    headers: {
                                                        Authorization: 'Bearer ' + cookie.get('token')
                                                    },
                                                    body: data
                                                })
                                            }

                                            data.append('file', newPic1);
                                            data.append('file', newPic2);
                                            data.append('file', newPic3);

                                            if (newPic1 || newPic2 || newPic3) {
                                                fetch(process.env.API_URI + `/post-images?user=${props.userId}`, {
                                                    method: 'POST',
                                                    headers: {
                                                        Authorization: 'Bearer ' + cookie.get('token')
                                                    },
                                                    body: data
                                                })
                                            }
                                            
                                            props.updateProfile({ variables: {
                                                userId: props.userId,
                                                userInput: {
                                                    profilePic: newProfile ? newProfile.name : null,
                                                    pic1: newPic1 ? newPic1.name : null,
                                                    pic2: newPic2 ? newPic2.name : null,
                                                    pic3: newPic3 ? newPic3.name : null,
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
                                                props.refetch();
                                                window.location.reload();
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
                        <div className="membership-info"> 
                            <p>{props.user.city}</p>
                            <p>{"Member since " + props.joinDate}</p>
                        </div>
                        {editMode ? 
                        <React.Fragment>
                            <p className="real-name">{"Name: "} 
                                <input 
                                    className="input-fields" 
                                    type="text"
                                    maxLength="50"
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
                            <p className="basic-info">{"Name: " + props.user.name}</p>
                            <p className="basic-info">{"Age: " + props.age}</p>
                            <p className="basic-info">{"Gender: " + props.user.gender}</p>
                        </React.Fragment>
                        }
                    </article>

                    </div>

                    <article className="status">
                        <TextareaAutosize 
                            style={{ 
                                resize: "none",
                                width: "100%",
                                border: "none",
                                outline: editMode ? "default" : "none",
                                fontSize: "1.1em",
                                backgroundColor: editMode ? "white" : "var(--greenapple)",
                                color: "var(--darkermatter)",
                                fontWeight: "bold"
                            }}
                            readOnly={!props.owner || !editMode}
                            defaultValue={props.user.status}  
                            autoComplete="off"
                            minRows={1}
                            maxRows={17}
                            onChange={ e => {
                                setStatus(e.target.value)
                            }}
                        />
                    </article>
                </section>

                <section className="pic-gallery">
                    <div className="pic-carousel">
                        <div className="gallery-pic">
                            <img 
                                src={pic1Preview ? pic1Preview : props.userPics.pic1_small}
                                className="image-round"
                                onClick={() => {
                                    setPicMode(true);
                                    setViewerPic(pic1Preview ? pic1Preview : props.userPics.pic1_large);
                                    setViewing('pic1');
                                }}
                            />
                        </div>
                        <div className="gallery-pic">
                            <img 
                                src={pic2Preview ? pic2Preview :  props.userPics.pic2_small}
                                className="image-round"
                                onClick={() => {
                                    setPicMode(true);
                                    setViewerPic(pic2Preview ? pic2Preview : props.userPics.pic2_large)
                                    setViewing('pic2');
                                }}
                            />
                        </div>
                        <div className="gallery-pic">
                            <img 
                                src={pic3Preview ? pic3Preview : props.userPics.pic3_small}
                                className="image-round"
                                onClick={() => {
                                    setPicMode(true);
                                    setViewerPic(pic3Preview ? pic3Preview : props.userPics.pic3_large)
                                    setViewing('pic3');
                                }}
                            />
                        </div>
                    </div>
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

                .pic-viewer {
                    z-index: 11;
                    position: absolute;
                    left: 0; 
                    right: 0; 
                    margin: 0 auto;
                    width: 600px;
                    height: 600px;
                    background-color: white;
                    border-radius: 10px;
                    animation-duration: 1.5s;
                    animation-name: fadein;
                    overflow: hidden;
                }

                .profile-container {
                    width: 100%;
                    padding: 24px;
                    animation-duration: .75s;
                    animation-name: fadein;
                }

                section {
                    display: inline-block;
                    background-color: var(--greenapple);
                    border-radius: 15px;
                    color: white;
                    font-weight: bold;
                }

                .profile-pic {
                    height: 350px;
                    width: 350px;
                    border-top-right-radius: 0;
                    border-bottom-right-radius: 0;
                }
                
                .main-info {
                    vertical-align: top;
                    height: 350px;
                    width: calc(100% - 350px);
                    border-top-left-radius: 0;
                    border-bottom-left-radius: 0;
                }

                .player-history {
                    height: max-content;
                    margin-top: 16px;
                    width: 350px;
                    padding: 16px;
                }

                .pic-gallery {
                    float: right;
                    width: calc(100% - 382px);
                    vertical-align: top;
                    margin-left: 32px;
                    margin-top: 16px;
                }

                article {
                    display: inline-block;
                }

                .profile-pic-container {
                    height: 350px;
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

                .heading-mobile {
                    display: none;
                }

                .user-heading {
                    border-bottom: 2px solid white;
                    min-height: 50px;
                    max-height: 100px;
                    width: 100%;
                    font-weight: 800;
                    vertical-align: top;
                }

                .name {
                    display: block;
                    font-size: 2em;
                    padding-left: 16px;
                }

                .jersey-number {
                    color: white;
                    font-size: 0.65em;
                    padding: 0 24px;
                    font-family: 'Bitter', serif;
                    word-break: normal;
                }

                .col-1 {
                    display: inline-block;
                    width: 250px;
                }

                .actions {
                    display: block;
                }

                .btn-edit {
                    margin-left: 12px;
                    margin-top: 8px;
                    width: 64px;
                    height: 28px;
                    font-size: 0.9em;
                }

                .btn-save {
                    margin-left: 12px;
                    margin-top: 8px;
                    animation-duration: 1s;
                    animation-name: fadein;
                }

                .demographics {
                    display: inline-block;
                    padding: 12px 8px 12px 12px;
                    width: 250px;
                    // vertical-align: top;
                    line-height: 1.5em;
                }

                .demographics > p {
                    display: block;
                }

                .membership-info {
                    font-style: italic;
                    padding-bottom: 12px;
                }

                .basic-info {
                    font-size: 1.2em;
                }

                .input-fields {
                    width: 100%;
                    padding: 8px 20px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-sizing: border-box;
                    animation-duration: 1s;
                    animation-name: fadein;
                }

                .status {
                    padding: 12px 8px;
                    display: inline-block;
                    vertical-align: top;
                    width: calc(100% - 250px);
                    // height: 300px;
                    overflow: hidden;
                }

                .outline {
                    outline: 2px solid var(--darkermatter);
                    outline-radius: 15px;
                }

                .stats {
                    color: var(--darkmatter);
                    font-weight: bold;
                    font-size: 1.2em;
                    margin-bottom: 16px;
                    border-bottom: 2px solid white;
                    width: 100%;
                }

                .stats-title {
                    margin-bottom: 1em;
                    font-size: 0.9em;
                }

                .stat {
                    font-size: 1.2em;
                    float: right;
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

                .pic-carousel {
                    display: flex;
                    justify-content: space-evenly;
                    flex-wrap: wrap;
                }

                .gallery-pic {
                    flex: 0 0 191px;
                    height: 191px;
                    padding: 8px;
                }

                .gallery-pic > img {
                    width: 175px;
                    height: 175px;
                }

                @keyframes fadein {
                    from {
                        opacity: 0;
                    } 
                    
                    to {
                        opacity: 1;
                    }
                }

                /******************
                *     Laptop      *
                *******************/
                @media only screen and (max-width: 1024px) {
                    .profile-container {
                        padding: 24px 128px;
                    }

                    .pic-gallery {
                        float: none;
                    }

                    section {
                        display: block;
                        width: 100%;
                        margin-bottom: 12px;
                    }

                    article {
                        width: 100%;
                    }

                    .profile-pic {
                        border-radius: 15px;
                        width: 100%;
                        height: 175px;
                    }

                    .profile-pic-container {
                        height: 175px;
                        width: 175px;
                        display: inline-block;
                    }

                    .heading-mobile {
                        display: inline-block;
                        vertical-align: top;
                        padding-top: 8px;
                    }
    
                    .user-heading {
                        display: none;
                    }
    
                    .jersey-number {
                        font-size: 1.2em;
                        padding-left: 16px;
                    }

                    .membership-info-mobile {
                        padding: 28px 16px;
                    }

                    .membership-info {
                        display: none;
                    }
                    
                    .main-info {
                        width: 100%;
                        border-radius: 15px;
                        height: min-content;
                    }

                    .col-1 {
                        width: 100%;
                    }

                    .demographics {
                        width: 100%;
                        padding: 8px 12[x;]
                    }

                    .status {
                        width: 100%;
                    }

                    .btn-edit {
                        float: right;
                        margin-right: 8px;
                    }
    
                    .player-history {
                        top: 0;
                        width: 100%;
                    }
    
                    .pic-gallery {
                        width: 100%;
                        margin: 0;
                    }
                }

                /******************
                *     Tablet      *
                *******************/
                @media only screen and (max-width: 768px) {
                    .profile-container {
                        padding: 24px 48px;
                    }

                    .actions {
                        margin: auto;
                        position: absolute;
                        width: min-content;
                        transform: translate(-50%);
                        left: 50%;
                        bottom: 5%;
                        z-index: 10;
                    }

                    .actions > button {
                        width: 100px;
                        height: 50px;
                        font-size: 1.5em;
                    }
                }

                /******************
                *     Mobile      *
                *******************/
                @media only screen and (max-width: 600px), (max-height: 600px) {
                    .profile-container {
                        padding: 24px 16px;
                    }

                    .pic-viewer {
                        width: 350px;
                        height: 350px;
                        top: 5%;
                    }

                    .heading-mobile {
                        display: inline-block;
                        width: calc(100% - 175px);
                        vertical-align: top;
                        padding-top: 8px;
                    }
    
                    .user-heading {
                        display: none;
                    }

                    .name {
                        font-size: 1.2em;
                        padding-left: 8px;
                    }
    
                    .jersey-number {
                        display: block;
                        font-size: 0.8em;
                        padding: 2px 8px;
                    }

                    .membership-info-mobile {
                        padding: 28px 8px 8px 8px;
                        font-size: 0.8em;
                    }
                }

                /******************
                *      Short      *
                *******************/
                @media only screen and (max-height: 350px) {
                    .pic-viewer {
                        top: 0;
                        height: 100%;
                    }
                }

                /******************
                *     Small       *
                *******************/
                @media only screen and (max-width: 350px) {
                    .pic-viewer {
                        width: 100%;
                        height: auto;
                    }

                    .name {
                        font-size: 1em;
                    }

                    .membership-info-mobile {
                        padding: 12px 8px 8px 8px;
                        font-size: 0.7em;
                    }
                }
            `}</style>
        </React.Fragment>
    );
}

export default UserProfile;