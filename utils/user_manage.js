const moment = require('moment');
let users = []

function addUser(id, username, room, time = moment().unix()) {
    const user = { id: id, name: username, room: room, time: time };
    users.push(user);
    return user
}

function getUser(id) {
    return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Get room users
function getRoomUsers(room) {
    let res=[]
    return users.filter((user) => user.room === room);
}

module.exports = { addUser, getUser, userLeave, getRoomUsers }