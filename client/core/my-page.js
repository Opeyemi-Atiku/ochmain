import React, { Component } from 'react';
import Header from './../menu/header';
import PicBox from './../modal/pic-box';
import Art from './../modal/art';
import Upgrade from './../modal/upgrade';
import Plan from './../modal/plan';
import { read } from './../api/api-user';
import { checkLink, updateLinkAudio, deleteLinkAudio, updateLinkVideo, deleteLinkVideo } from './../api/api-link';
import auth from './../auth/auth-helper';

class Profile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fullName: '',
            displayName: '',
            phoneNumber: '',
            about: '',
            loading: true,
            newLink: true,
            linkId: '',
            _id: '',
            auth: false,
            image: ''
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.userData !== prevProps.userData) {
            let user = this.props.userData;
            this.updateUser(user);
            //this.updateLink(user._id);
            //console.log(user);
        }
    }

    updateUser = (data) => {
        let imageView = 'https://ochbackend.herokuapp.com/api/usersPhoto/'+data._id
        //let imageView = 'http://localhost:8080/api/usersPhoto/' + data._id;
        this.setState({
            fullName: data.fullName || '', displayName: data.displayName || '', phoneNumber: data.phoneNumber || '', about: data.about || '', loading: data.loading, _id: data._id, auth: data.auth, image: imageView
        });
    }


    render() {
        return (
            <section className="padd-small padd-top text-center">

                <div className="small-12 medium-2 large-2 columns">
                    <div className="circle">
                        <img className="profile-pic" style={{ maxWidth: 'unset' }} src={this.state.image} />

                        <i className="fa fa-user fa-5x"></i>
                    </div>
                    <div className="p-image">
                        <a href="" data-toggle="modal" data-target="#pic-box"> <img src="/client/assets/images/camera-icon.png" /></a>

                    </div>
                </div>
                <div className="heading-areaz">
                    <h2>{this.state.displayName}</h2>
                    <h4>{this.state.fullName}</h4>
                </div>

                <ul className="profile-setting clearfix">
                    <li>
                        <div className="dropdown-share"><a href="javascript:void0">BIO</a><div className="edit"><i className="fa fa-eye" aria-hidden="true"></i></div>
                            <div className="dropdown-share-content bio">
                                <h5>View Bio</h5>
                                <div className="line3"></div>
                                {this.state.about}
                            </div>
                        </div>
                    </li>
                    <li style={{ display: 'none' }}> <div className="dropdown-share"><a href="javascript:void0">AVAILABLE <i className="fa fa-angle-down" aria-hidden="true"></i></a>
                        <div className="dropdown-share-content ava">
                            <ul className="status-list">
                                <li> <a href="javascript:void0"><img src="/client/assets/images/profile-available.png" />Available <i className="fa fa-check grn" aria-hidden="true"></i></a></li>
                                <li>  <a href="javascript:void0"><img src="/client/assets/images/p-away.png" />Away</a></li>
                                <li> <a href="javascript:void0"><img src="/client/assets/images/p-busy.png" />Busy</a></li>
                                <li> <a href="javascript:void0"><img src="/client/assets/images/p-dist.png" />Do not Disturb</a></li>
                                <li><a href="javascript:void0"><img src="/client/assets/images/p-close.png" />Appear Offline</a></li>
                            </ul>
                        </div>
                    </div>
                        <div className="checkb">

                            <span><i className="fa fa-check" aria-hidden="true"></i></span>
                        </div>

                    </li>
                    <li style={{ display: 'none' }}>
                        <div className="dropdown-share"><a href="javascript:void0"><img src="/client/assets/images/user-share.png" className="img-responsive" /></a>
                            <div className="dropdown-share-content shr">
                                <b><a href="javascript:void0">Share Profile Via Email</a></b>
                                <p>Create new email containing link to your profile</p>

                                <b><a href="javascript:void0">Share Profile via Text or iMessage</a></b>
                                <p>Create new text/iMessage containing profile link </p>

                                <b><a href="javascript:void0">Copy Profile Link</a></b>
                                <p>Copy your profile link to the Copy/Paste buffer </p>
                            </div>
                        </div>
                    </li>

                </ul>


            </section>
        );
    }

}

/*Audio*/
class AudioList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            linkUrl: ''
        }

    }

    componentDidMount() {
        this.validateSoundCloud();
    }

    validateSoundCloud = () => {
        var url = this.props.link
        if (url != undefined || url != '') {
            var regexp = /^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/;
            var match = url.match(regexp);

            if (match && url.match(regexp)[2]) {
                // Do anything for being valid
                // if need to change the url to embed url then use below line            
                //$('#videoObject').attr('src', 'https://www.youtube.com/embed/' + match[2] + '?autoplay=1&enablejsapi=1');

                let _linkUrl = "https://w.soundcloud.com/player/?url=" + this.props.link

                this.setState({ linkUrl: _linkUrl })

            } else {
                this.validateSpotify();
                //this.setState({ linkUrlValidation: 'LINK IS INVALID' });
                // Do anything for not being valid
            }
        }
    }

    validateSpotify = () => {
        var url = this.props.link;
        var match = /^(spotify:|https:\/\/[a-z]+\.spotify\.com\/)/.test(url);

        this.setState({ linkUrl: url })
        if (match) {
        } else {
            console.log()
        }
    }



    deleteLink = () => {
        if (auth.isAuthenticated()) {
            const jwt = auth.isAuthenticated();
            const userId = jwt.user._id;
            const token = jwt.token

            let _linkData = {
                linkId: this.props.linkId,
                audioId: this.props._audioId,
            }

            if (userId == this.props.userId) {
                deleteLinkAudio({ t: token }, _linkData).then((data) => {
                    if (data.error) {
                        console.log(data.error);
                    } else {
                        this.props.grandParentUpdateLink(userId)
                    }
                });
            }
        }
    }




    render() {
        const _jwt = auth.isAuthenticated();
        const _userId = _jwt.user._id;
        return (
            <li>
                <iframe width="100%" height="100%" scrolling="no" frameborder="no" allow="autoplay" src={this.state.linkUrl}></iframe>
                <div className="btn-area clearfix">
                    <div className="dropdown-share">
                        <span><img src="/client/assets/images/share-white.png" className="img-responsive share" /></span>
                        <div className="dropdown-share-content song-share">
                            <b><a href="javascript:void0">Share Song in New Post</a></b>
                            <p>Create new post containing link to the song</p>

                            <b><a href="javascript:void0">Share Song via Email</a></b>
                            <p>Create new email containing link to the song</p>

                            <b><a href="javascript:void0">Share Song via Text or iMessage</a></b>
                            <p>Create new text/iMessage containing song link </p>

                            <b><a href="javascript:void0">Share Song via Direct Message</a></b>
                            <p>Send direct message containing song link </p>
                            <b><a href="javascript:void0">Copy Song Link</a></b>
                            <p>Copy song link to the Copy/Paste buffer</p>
                        </div>
                    </div>
                    {this.props.userId === _userId ? (<div className="dropdown-share del-share"><a href="#"><img src="/client/assets/images/del.png" className="img-responsive" /></a>
                        <div className="dropdown-share-content sharee">
                            <div className="cancel-bx">
                                <b className="d-block text-center bold">Do you want to delete the song?</b>
                                <div className="line3"></div>
                                <div className="btn-del">
                                    <a href="javascript:void0" className="outline-btn">NO - KEEP IT</a>
                                    <a onClick={this.deleteLink} className="cancel-small">YES - DELETE IT</a>
                                </div>
                            </div>
                        </div>
                    </div>) : ('')}

                </div>
            </li>


        );
    }
}

class Audio extends Component {
    constructor(props) {
        super(props);

        this.state = {
            _userId: '',
            linkId: '',
            newLink: true,
            linkUrl: '',
            linkUrlValidation: '',
            auth: false,
            audioLink: []
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            let audio = this.props;
            this.setState({ _userId: audio.userId, linkId: audio.linkId, newLink: audio.newLink, audioLink: audio._audio });

            if (auth.isAuthenticated()) {
                const jwt = auth.isAuthenticated();
                const userId = jwt.user._id;

                if (userId === audio.userId) {
                    this.setState({ auth: true });
                }
            }
        }
    }

    onChangeLink = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });

        event.target.name === 'linkUrl' ? this.setState({ linkUrlValidation: '' }) : '';
    }

    onSubmitAudio = () => {
        if (this.state.linkUrl === '') {
            this.state.linkUrl === '' ? (this.setState({ linkUrlValidation: 'LINK IS REQUIRED' })) : this.setState({ linkUrlValidation: '' });
        } else {
            this.validateSoundCloud();
        }
    }


    validateSoundCloud = () => {
        var url = this.state.linkUrl
        if (url != undefined || url != '') {
            var regexp = /^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/;
            var match = url.match(regexp);

            if (match && url.match(regexp)[2]) {
                // Do anything for being valid
                // if need to change the url to embed url then use below line            
                //$('#videoObject').attr('src', 'https://www.youtube.com/embed/' + match[2] + '?autoplay=1&enablejsapi=1');

                this._onSubmitAudio();

            } else {
                this.validateSpotify();
                //this.setState({ linkUrlValidation: 'LINK IS INVALID' });
                // Do anything for not being valid
            }
        }
    }

    validateSpotify = () => {
        var url = this.state.linkUrl;
        var match = /^(spotify:|https:\/\/[a-z]+\.spotify\.com\/)/.test(url);

        if (match) {
            this._onSubmitAudio();
        } else {
            this.setState({ linkUrlValidation: 'LINK IS INVALID' });
        }
    }

    _onSubmitAudio = () => {
        let _linkData = {
            linkUrlAudio: this.state.linkUrl,
            userId: this.state._userId
        }

        if (auth.isAuthenticated()) {
            const jwt = auth.isAuthenticated();
            const userId = jwt.user._id;
            const token = jwt.token

            if (userId == this.state._userId) {
                checkLink({
                    userId: userId
                }).then((data) => {
                    if (data.error) {
                        alert(data.error)
                    } else {
                        let countLink = data.link.length;
                        let links = data.link;
                        if (countLink > 0 && countLink == 1) {
                            links = links[0]
                            _linkData = { ..._linkData, linkId: links._id }
                            updateLinkAudio({ t: token }, _linkData).then((data) => {
                                if (data.error) {
                                    console.log(data.error);
                                } else {
                                    this.setState({ linkUrl: '' })
                                    this.props.parentUpdateLink(userId)
                                }
                            });
                        } else if (countLink == 0) {
                            alert('Unknown error occured');
                        }
                    }
                })
            }
        }
    }


    render() {
        return (
            <div className="white-box transparent-area">
                <h2 className="in-h">SONGS</h2>
                <div className="line3 text-left"></div>

                <ul className="song-list">

                    {this.state.audioLink.map((el, i) =>
                        <AudioList
                            link={el.text}
                            _audioId={el._id}
                            userId={this.state._userId}
                            linkId={this.state.linkId}
                            grandParentUpdateLink={this.props.parentUpdateLink}
                        />
                    )}

                    <li>

                        {this.state.auth == true ? (<div className="dropdown-share">
                            <a href="#" className="play-btn"><img src="/client/assets/images/plus-btn.png" /> Add Song</a>
                            <div className="dropdown-share-content add-song">
                                {/*<b><a href="javascript:void0">Add Song from File</a></b>*/}
                                <p>Create new post containing link to the song</p>

                                <b><a href="#">Add Song via Link</a></b>
                                <input type="text" name="linkUrl" onChange={this.onChangeLink} value={this.state.linkUrl} placeholder="Enter/Paste Soundcloud or Spotify Link..." />
                                <span id="validationError">{this.state.linkUrlValidation}</span>
                                <a onClick={this.onSubmitAudio} className="save-btn btm">ADD LINK</a>

                            </div>
                        </div>) : ''}


                    </li>
                </ul>
            </div>
        );
    }
}
/*Audio*/


/*Video*/
class VideoList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            link: ''
        }
    }

    deleteLink = () => {
        if (auth.isAuthenticated()) {
            const jwt = auth.isAuthenticated();
            const userId = jwt.user._id;
            const token = jwt.token

            let _linkData = {
                linkId: this.props.linkId,
                videoId: this.props._videoId,
            }

            if (userId == this.props.userId) {
                deleteLinkVideo({ t: token }, _linkData).then((data) => {
                    if (data.error) {
                        console.log(data.error);
                    } else {
                        this.props.grandParentUpdateLink(userId)
                    }
                });
            }
        }
    }

    render() {
        const _jwt = auth.isAuthenticated();
        const _userId = _jwt.user._id;
        return (

            <li>
                <iframe width="100%" height="100%"
                    src={this.props.link}>
                </iframe>
                <div className="btn-area tp clearfix">
                    <div className="dropdown-share">
                        <span><img src="/client/assets/images/share-white.png" className="img-responsive share" /></span>
                        <div className="dropdown-share-content song-share">
                            <b><a href="javascript:void0">Share Video in New Post</a></b>
                            <p>Create new post containing link to the video</p>

                            <b><a href="javascript:void0">Share Video via Email</a></b>
                            <p>Create new email containing link to the video</p>

                            <b><a href="javascript:void0">Share Video via Text or iMessage</a></b>
                            <p>Create new text/iMessage containing video link </p>

                            <b><a href="javascript:void0">Share Video via Direct Message</a></b>
                            <p>Send direct message containing video link </p>
                            <b><a href="javascript:void0">Copy Video Link</a></b>
                            <p>Copy video link to the Copy/Paste buffer</p>
                        </div>
                    </div>

                    {this.props.userId === _userId ? (<div className="dropdown-share del-share"><a href="javascript:void0"><img src="/client/assets/images/del.png" className="img-responsive" /></a>
                        <div className="dropdown-share-content sharee">
                            <div className="cancel-bx">
                                <b className="d-block text-center bold">Do you want to delete the video?</b>
                                <div className="line3"></div>
                                <div className="btn-del">
                                    <a href="javascript:void0" className="outline-btn">NO - KEEP IT</a>
                                    <a onClick={this.deleteLink} className="cancel-small">YES - DELETE IT</a>
                                </div>
                            </div>
                        </div>
                    </div>) : ('')}
                </div>
            </li>

        )
    }
}

class Video extends Component {
    constructor(props) {
        super(props)

        this.state = {
            _userId: '',
            linkId: '',
            newLink: true,
            linkUrl: '',
            linkUrlValidation: '',
            auth: false,
            videoLink: []
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            let video = this.props;
            this.setState({ _userId: video.userId, linkId: video.linkId, newLink: video.newLink, videoLink: video._video });

            if (auth.isAuthenticated()) {
                const jwt = auth.isAuthenticated();
                const userId = jwt.user._id;

                if (userId === video.userId) {
                    this.setState({ auth: true });
                }
            }
        }
    }


    onChangeLink = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });

        event.target.name === 'linkUrl' ? this.setState({ linkUrlValidation: '' }) : '';
    }


    onSubmitVideo = () => {
        if (this.state.linkUrl === '') {
            this.state.linkUrl === '' ? (this.setState({ linkUrlValidation: 'LINK IS REQUIRED' })) : this.setState({ linkUrlValidation: '' });
        } else {
            this.validateYouTubeUrl();
        }
    }


    validateYouTubeUrl = () => {
        var url = this.state.linkUrl
        if (url != undefined || url != '') {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
            var match = url.match(regExp);
            if (match && match[2].length == 11) {
                // Do anything for being valid
                // if need to change the url to embed url then use below line            
                //$('#videoObject').attr('src', 'https://www.youtube.com/embed/' + match[2] + '?autoplay=1&enablejsapi=1');

                this._onSubmitVideo();

            } else {
                this.setState({ linkUrlValidation: 'LINK IS INVALID' });
                // Do anything for not being valid
            }
        }
    }


    _onSubmitVideo = () => {
        let _linkData = {
            linkUrlVideo: this.state.linkUrl,
            userId: this.state._userId
        }

        if (auth.isAuthenticated()) {
            const jwt = auth.isAuthenticated();
            const userId = jwt.user._id;
            const token = jwt.token

            if (userId == this.state._userId) {
                checkLink({
                    userId: userId
                }).then((data) => {
                    if (data.error) {
                        alert(data.error)
                    } else {
                        let countLink = data.link.length;
                        let links = data.link;
                        if (countLink > 0 && countLink == 1) {
                            links = links[0]
                            _linkData = { ..._linkData, linkId: links._id }
                            updateLinkVideo({ t: token }, _linkData).then((data) => {
                                if (data.error) {
                                    console.log(data.error);
                                } else {
                                    this.setState({ linkUrl: '' })
                                    this.props.parentUpdateLink(userId)
                                }
                            });
                        } else if (countLink == 0) {
                            alert('Unknown error occured');
                        }
                    }
                })
            }
        }
    }

    render() {
        return (
            <div className="white-box transparent-area">
                <h2 className="in-h">VIDEOS</h2>
                <div className="line3 text-left"></div>

                <ul className="song-list">
                    {this.state.videoLink.map((el, i) =>
                        <VideoList
                            link={el.text}
                            _videoId={el._id}
                            userId={this.state._userId}
                            linkId={this.state.linkId}
                            grandParentUpdateLink={this.props.parentUpdateLink}
                        />
                    )}

                    <li>
                        {this.state.auth == true ? (
                            <div className="dropdown-share">
                                <a className="play-btn"><img src="/client/assets/images/plus-btn.png" /> Add Video...</a>
                                <div className="dropdown-share-content add-song">
                                    <p>Create new post containing link to the video</p>
                                    <p>format: https://www.youtube.com/embed/watch?v=kiyi-C7NQrQ</p>
                                    <input type="text" name="linkUrl" onChange={this.onChangeLink} value={this.state.linkUrl} placeholder="Enter/Paste YouTube Link..." />
                                    <span id="validationError">{this.state.linkUrlValidation}</span>
                                    <a onClick={this.onSubmitVideo} className="save-btn btm">ADD VIDEO</a>
                                </div>
                            </div>
                        ) : ('')}
                    </li>
                </ul>
            </div>

        );
    }
}
/*Video*/


class Timeline extends Component {
    constructor(props) {
        super(props)

        this.state = {
            facebook: '123',
            facebookStatus: '',
            instagram: '',
            instagramStatus: false,
            spotify: '',
            spotifyStatus: false,
            youtube: '',
            youtubeStatus: false,
            snapchat: '',
            snapchatStatus: false,
            tiktok: '',
            tiktokStatus: false,
            loading: true,
            newLink: true,
            linkId: '',
            _id: '',
            auth: false,
            audio: [],
            video: [],
            imageLink: ''
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.userData !== prevProps.userData) {
            let user = this.props.userData;
            this.updateLink(user._id);
            this.updateUser(user);
        }
    }

    updateUser = (data) => {
        let imageView = 'https://ochbackend.herokuapp.com/api/usersPhoto/'+data._id
        //let imageView = 'http://localhost:8080/api/usersPhoto/' + data._id;
        this.setState({
            loading: data.loading, _id: data._id, auth: data.auth, imageLink: imageView
        });
    }

    updateLink = (id) => {
        const userId = id;
        checkLink({
            userId: userId
        }).then((data) => {
            if (data.error) {
                alert(data.error)
            } else {
                let countLink = data.link.length;
                let links = data.link;
                if (countLink > 0 && countLink == 1) {
                    links = links[0]
                    this.setState({
                        facebook: links.facebook, facebookStatus: links.facebookStatus, instagram: links.instagram, instagramStatus: links.instagramStatus,
                        spotify: links.spotify, spotifyStatus: links.spotifyStatus, youtube: links.youtube, youtubeStatus: links.youtubeStatus,
                        snapchat: links.snapchat, snapchatStatus: links.snapchatStatus, tiktok: links.tiktok, tiktokStatus: links.tiktokStatus,
                        newLink: false, linkId: links._id, audio: links.linkUrlAudio, video: links.linkUrlVideo
                    })
                }
            }
        })
    }

    render() {
        return (
            <section className="song-section">
                <div className="container-fluid">
                    <div className="row">

                        {/*Audio Componenet*/}
                        <div className="col-md-12 col-lg-3 padd-right">

                            <Audio
                                userId={this.state._id}
                                linkId={this.state.linkId}
                                newLink={this.state.newLink}
                                _audio={this.state.audio}
                                parentUpdateLink={this.updateLink}
                            />

                            <ul className="social-circle">
                                <li><a style={{ display: 'none' }} href="javascript:void0" className="crs-btn"><img src="/client/assets/images/close-icon.png" /></a><a href={this.state.facebookStatus == true ? 'https://' + this.state.facebook : '#'} target={this.state.facebookStatus == true ? '_blank' : ''}  ><img src="/client/assets/images/facebook.png" />{this.state.facebookStatus == true ? (<div className="dropdown-share"><div className=" edit-two"><i className="fa fa-eye" aria-hidden="true"></i></div>
                                    <div className="dropdown-share-content edit-drp d-nn">
                                        {this.state.facebook}
                                        <input style={{ display: 'none' }} type="text" placeholder="Enter/Paste Facebook Artist Link..." />
                                        {/*<a href="javascript:void0" className="save-btn btm">ADD LINK</a>*/}
                                    </div>
                                </div>) : ''}</a></li>
                                <li><a style={{ display: 'none' }} href="javascript:void0" className="crs-btn"><img src="/client/assets/images/close-icon.png" /></a><a href={this.state.instagramStatus == true ? 'https://' + this.state.instagram : '#'} target={this.state.instagramStatus == true ? '_blank' : ''}  ><a /><img src="/client/assets/images/insta.png" />{this.state.instagramStatus == true ? (<div className="dropdown-share"><div className=" edit-two"><i className="fa fa-eye" aria-hidden="true"></i></div>
                                    <div className="dropdown-share-content edit-drp d-nn">
                                        {this.state.instagram}
                                        <input style={{ display: 'none' }} type="text" placeholder="Enter/Paste Instagram Artist Link..." />
                                        {/*<a href="javascript:void0" className="save-btn btm">ADD LINK</a>*/}
                                    </div>
                                </div>) : ''}</a></li>
                                <li><a style={{ display: 'none' }} href="javascript:void0" className="crs-btn"><img src="/client/assets/images/close-icon.png" /></a><a href={this.state.spotifyStatus == true ? 'https://' + this.state.spotify : '#'} target={this.state.spotifyStatus == true ? '_blank' : ''} ><img src="/client/assets/images/spotify.png" />{this.state.spotifyStatus == true ? (<div className="dropdown-share"><div className="edit-two"><i className="fa fa-eye" aria-hidden="true"></i></div>
                                    <div className="dropdown-share-content edit-drp d-nn">
                                        {this.state.spotify}
                                        <input style={{ display: 'none' }} type="text" placeholder="Enter/Paste Spotify Artist Link..." />
                                        {/*<a href="javascript:void0" className="save-btn btm">ADD LINK</a>*/}
                                    </div>
                                </div>) : ''}</a></li>
                            </ul>
                        </div>
                        {/*Audio Component*/}


                        {/*Timeline*/}
                        <div className="col-md-12 col-lg-6 padd-both" >
                            <div className="white-box clearfix">

                                <div className="left-img">

                                    <img src={this.state.imageLink} width="5%" height="5%" className="img-responsive circled no-b" />

                                </div>
                                <div className="right-content">
                                    <div className="search-area">
                                        <input type="text" placeholder="Share your thoughts and your music..." />

                                        <div className="button-wrap btn" style={{ display: "none" }}>
                                            <label className="new-button" for="upload1"> <img src="/client/assets/images/pic-up.png" className="img-responsive upload" />
                                                <input id="upload1" type="file" />
                                            </label>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "none" }} className="white-box clearfix">

                                <div className="left-img">

                                    <img src="/client/assets/images/elif.png" className="img-responsive circled no-b" />

                                </div>
                                <div className="right-content position-relative">
                                    <b>Ellie Soufl</b>
                                    <span>5 min ago</span>
                                    <div className="dots-a">
                                        <div className="dropdown-share">
                                            <span><i className="fa fa-ellipsis-h" aria-hidden="true"></i></span>
                                            <div className="dropdown-share-content">
                                                <b><a href="javascript:void0">Hide Post</a></b>
                                                <p>Remove this post from your feed</p>

                                                <b><a href="javascript:void0">Unfollow Ellie Soufi</a></b>
                                                <p>Stop seeing Ellie’s posts but stay connected</p>

                                                <b><a href="javascript:void0">Report Post</a></b>
                                                <p>Something about this post concerns me</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="clearfix"></div>
                                <div className="desc-box">
                                    <p>Lorem Ipsum</p>

                                    <iframe width="100%" height="315"
                                        src="https://www.youtube.com/embed/tgbNymZ7vqY" frameBorder="0">
                                    </iframe>

                                    <ul className="comments-area-two clearfix">
                                        <li><a href="javascript:void0" className="like-btn"></a> <a href="javascript:void(0)" id="msg-bar-two"><img src="/client/assets/images/msg-right.png" className="img-responsive m-r" /> You and 267 others liked this</a></li>

                                        <li><div className="dropdown-share">
                                            <span><img src="/client/assets/images/f-share.png" className="img-responsive share" /></span>
                                            <div className="dropdown-share-content">
                                                <b><a href="javascript:void0">Share Now</a></b>
                                                <p>Instantly post to your content feed</p>

                                                <b><a href="javascript:void0">Write Post</a></b>
                                                <p>Write new post based on this post</p>

                                                <b><a href="javascript:void0">Send As Direct Message</a></b>
                                                <p>Send to one or more contacts directly </p>
                                            </div>
                                        </div></li>
                                    </ul>
                                    <div className="msg-area-two clearfix">
                                        <div className="left-img">

                                            <img src="/client/assets/images/user-two.png" className="img-responsive circled no-b" />

                                        </div>
                                        <div className="right-content">
                                            <div className="search-area">
                                                <input type="text" placeholder="Be the first to write a comment..." />

                                                <div className="button-wrap btn">
                                                    <label className="new-button" for="upload2"> <img src="/client/assets/images/pic-up.png" className="img-responsive upload" />
                                                        <input id="upload2" type="file" />
                                                    </label></div>
                                                <a className="smly"><i className="fa fa-smile-o" aria-hidden="true"></i></a>

                                            </div>
                                        </div>
                                    </div>
                                    <p className="p-b"><b>robbiedean</b> So proud of this record! Let’s write another one!</p>
                                    <a className="grey" href="javascript:void0">View all 6 comments</a>
                                </div>
                            </div>
                        </div>
                        {/*Timeline*/}


                        {/*Video*/}
                        <div className="col-md-12 col-lg-3 padd-left">
                            <Video
                                userId={this.state._id}
                                linkId={this.state.linkId}
                                newLink={this.state.newLink}
                                _video={this.state.video}
                                parentUpdateLink={this.updateLink}
                            />
                            <ul className="social-circle">
                                <li><a style={{ display: 'none' }} href="javascript:void0" className="crs-btn"><img src="/client/assets/images/close-icon.png" /></a><a href={this.state.youtubeStatus == true ? ('https://' + this.state.youtube) : '#'} target={this.state.youtubeStatus == true ? '_blank' : ''} ><img src="/client/assets/images/youtube.png" />{this.state.youtubeStatus == true ? (<div className="dropdown-share"><div className="edit-two"><i className="fa fa-eye" aria-hidden="true"></i></div>
                                    <div className="dropdown-share-content edit-drp right d-nn">
                                        {this.state.youtube}
                                        <input style={{ display: 'none' }} type="text" placeholder="Enter/Paste Youtube Artist Link..." />
                                        {/*<a href="javascript:void0" className="save-btn btm">ADD LINK</a>*/}
                                    </div>
                                </div>) : ''}</a></li>
                                <li><a style={{ display: 'none' }} href="javascript:void0" className="crs-btn"><img src="/client/assets/images/close-icon.png" /></a><a href={this.state.snapchatStatus == true ? 'https://' + this.state.snapchat : '#'} target={this.state.snapchatStatus == true ? '_blank' : ''} ><img src="/client/assets/images/snapchat.png" />{this.state.snapchatStatus == true ? (<div className="dropdown-share"><div className=" edit-two"><i className="fa fa-eye" aria-hidden="true"></i></div>
                                    <div className="dropdown-share-content edit-drp right d-nn">
                                        {this.state.snapchat}
                                        <input style={{ display: 'none' }} type="text" placeholder="Enter/Paste Snapchat Artist Link..." />
                                        {/*<a href="javascript:void0" className="save-btn btm">ADD LINK</a>*/}
                                    </div>
                                </div>) : ''}</a></li>
                                <li><a style={{ display: 'none' }} href="javascript:void0" className="crs-btn"><img src="/client/assets/images/close-icon.png" /></a><a href={this.state.tiktokStatus == true ? 'https://' + this.state.tiktok : '#'} target={this.state.tiktokStatus == true ? '_blank' : ''} ><img src="/client/assets/images/tiktok.png" />{this.state.tiktokStatus == true ? (<div className="dropdown-share"><div className=" edit-two"><i className="fa fa-eye" aria-hidden="true"></i></div>
                                    <div className="dropdown-share-content edit-drp right d-nn">
                                        {this.state.tiktok}
                                        <input style={{ display: 'none' }} type="text" placeholder="Enter/Paste Tiktok Artist Link..." />
                                        {/*<a href="javascript:void0" className="save-btn btm">ADD LINK</a>*/}
                                    </div>
                                </div>) : ''}</a></li>


                            </ul>
                        </div>
                        {/*Video*/}

                    </div>
                </div>
            </section>
        );
    }

}


class Mypage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            displayName: '',
            fullName: '',
            dataEdit: {},
            _id: '',
            image: '',
        }
    }

    readUser = () => {

        let jwt, authId;

        if (auth.isAuthenticated) {
            jwt = auth.isAuthenticated();
            authId = jwt.user._id;
        } else {
            authId = '';
        }

        const userId = this.props.match.params.userId;

        this.setState({ _id: userId });
        let check = false;

        if (authId == userId) {
            check = true
        }

        read({
            userId: userId
        }).then((data) => {
            if (data.error) {
                alert(data.error)
            } else {
                this.setState({ 'fullName': data.fullName, 'displayName': data.displayName, dataEdit: { ...data, loading: false, auth: check } });
            }
        });
    }

    componentDidMount() {
        this.readUser();
    }

    renderImage_ = (imageV) => {
        this.setState({ image: imageV })
    }


    render() {
        return (
            <div>
                <div className="page-bg">

                    <Header
                        path={this.props.location.pathname}
                    />

                    <Profile
                        userData={this.state.dataEdit}
                        image={this.state.image}
                    />

                    <Timeline
                        userData={this.state.dataEdit}
                    />
                </div>
                <PicBox
                    _id={this.state._id}
                    renderImage={this.renderImage_}
                />
                <Art />
                <Upgrade />
                <Plan />



            </div>
        )
    }
}

export default Mypage;