const link = 'http://localhost:8080';
//const link = 'https://ochbackend.herokuapp.com';

const create = (params) => {
    return fetch(link + '/api/meetings', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    }).then((response) => {
        return response.json()
    }).catch((err) => console.log(err))
}

const listMeeting = () => {
    return fetch(link + '/api/meetings', {
        method: 'GET',
    }).then(response => {
        return response.json()
    }).catch((err) => console.log(err))
}

const listMeetingByUser = (userId) => {
    return fetch(link + '/api/meeting/' + userId, {
        method: 'GET',
    }).then(response => {
        return response.json()
    }).catch((err) => console.log(err))
}

export {
    create, listMeeting, listMeetingByUser
}