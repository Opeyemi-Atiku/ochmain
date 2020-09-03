import React from 'react';
import auth from './../auth/auth-helper';
import swal from 'sweetalert'

import openSocket from 'socket.io-client'


class ContactList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            sender: '',
            mesageList: [],
            link: 'https://ochbackend.herokuapp.com/',
            intervalId: '',
            check: 0,
            receiver: ''
        }

        this.socket = openSocket(this.state.link)
    }

    readMessage = () => {

        if (auth.isAuthenticated()) {
            let jwt = auth.isAuthenticated();
            let authId = jwt.user._id;

            if (authId) {
                let conversation = {
                    sender: authId
                }

                this.socket.emit('show_conversation', conversation);

                this.socket.on('conversations', this.viewNewMessage)
            }
        }
    }


    componentDidUpdate(prevProps) {
        if (this.props.receiver !== prevProps.receiver) {
            this.setState({ receiver: this.props.receiver })
        }
    }


    viewNewMessage = data => {
        if (data.sender === this.state.sender) {
            if (JSON.stringify(this.state.mesageList) != JSON.stringify(data.conversation)) {
                let check = this.state.check + 1;
                this.setState({ check: check })
                let _check = check % 2 == 0;

                if (_check == true) {
                    data.conversation.map((el, i) => {
                        if (el.recieveLast == auth.isAuthenticated().user._id && el.deleivered == false) {
                            this.state.receiver == el.sendLast ? this.play2() : this.play1()
                        }
                    })
                    this.setState({ check: 0 })
                }
            }
            this.setState({
                mesageList: data.conversation
            });

        }
    }

    componentDidMount() {
        if (auth.isAuthenticated()) {
            const jwt = auth.isAuthenticated();
            const userId = jwt.user._id;
            this.setState({ sender: userId })

            let intervalId = setInterval(this.readMessage, 1000)
            this.setState({ intervalId: intervalId })
        }
        
    }


    componentWillUnmount() {
        clearInterval(this.state.intervalId)
    }


    viewMessageArea = (data) => {
        this.props._viewMessageArea(data)

        document.getElementById('chatInput').style.display = '';
    }

    showNewMessageStatus = (sender, status, data) => {


        if (sender == auth.isAuthenticated().user._id) {
            return (<div className="msg-icon"><a href="javascript:void(0)"><i className="fa fa-envelope-open" aria-hidden="true"></i></a>
            </div>)
        } else {
            if (status == true) {
                return (<div className="msg-icon"><a href="javascript:void(0)"><i className="fa fa-envelope-open" aria-hidden="true"></i></a>
                </div>)
            } else {
                return (
                    <div className="msg-icon"><a href="javascript:void(0)"><i className="fa fa-envelope" style={{ color: 'red' }} aria-hidden="true"></i></a>
                    </div>
                )
            }
        }
    }

    play1 = () => {
        let x = document.getElementById("myAudio1");
        x.play();
        setTimeout(function(){ x.pause(); }, 2500);
    }

    play2 = () => {
        let x = document.getElementById("myAudio2");
        x.play();
        setTimeout(function(){ x.pause(); }, 2500);
    }

    /*openChat = (data, e) => {
        this.props._openChat(data)

        document.getElementById('chatInput').style.display = '';
    }*/


    render() {
        const contactArea = {
            height: '412px',
            overflow: 'auto'
        }

        return (
            <div className="white-box">
                <h2 className="in-h">MESSAGES</h2>
                <audio id="myAudio1">
                    <source src="/client/assets/audio/ring3.mp3" type="audio/mpeg" />
                </audio>
                <audio id="myAudio2">
                    <source src="/client/assets/audio/ring2.mp3" type="audio/mpeg" />
                </audio>
                <div className="line3 text-left"></div>
                <div className="likes-section new" style={contactArea}>

                    {this.state.mesageList.map((el, i) => {
                        let user;
                        if (el.recipients[0]._id == auth.isAuthenticated().user._id) {
                            user = el.recipients[1]
                            return (
                                <div className="img-area clearfix" onClick={this.viewMessageArea.bind(this, el)}>
                                    <div className="img-c">
                                        <img src={'https://ochbackend.herokuapp.com/api/usersPhoto/' + user._id} className="img-responsive circled" />
                                        <span className={"msg" + user.userStatus}></span>
                                    </div>

                                    <div className="cont w-70">
                                        <b>{user.displayName}</b>

                                        <p>{el.lastMessage}</p>


                                        {/*<p className="mins">2 mins ago</p>*/}
                                    </div>

                                    {this.showNewMessageStatus(el.sendLast, el.read, el)}



                                </div>
                            );
                        } else {
                            user = el.recipients[0]
                            return (
                                <div className="img-area clearfix" onClick={this.viewMessageArea.bind(this, el)}>
                                    <div className="img-c">
                                        <img src={'https://ochbackend.herokuapp.com/api/usersPhoto/' + user._id} className="img-responsive circled" />
                                        <span className={"msg" + user.userStatus}></span>
                                    </div>

                                    <div className="cont w-70">
                                        <b>{user.displayName}</b>

                                        <p>{el.lastMessage}</p>


                                        {/*<p className="mins">2 mins ago</p>*/}
                                    </div>

                                    {this.showNewMessageStatus(el.sendLast, el.read, el)}
                                </div>
                            );
                        }
                    }
                    )}

                    {/**/}




                </div>
                {/*<a href="" className="btn-spc"><i className="fa fa-ellipsis-h" aria-hidden="true"></i> See More
                                Messages</a>*/}
            </div>

        );
    }
}
export default ContactList;