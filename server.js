let express = require('express');
let app = express();
const moment = require('moment');
const { addUser, getRoomUsers } = require('./utils/user_manage')

let server = require('http').createServer(app)
let socketio = require('socket.io')
const io = socketio(server)
let rooms = ['public', 'hari', 'palani', 'cbe', 'mdu', 'tce']


const path = require('path')
app.use('/', express.static(path.join(__dirname, 'public')))

io.on('connection', (socket) => {
    console.log(`New connection`)
    socket.emit('welcome', rooms)

    socket.on('newRoomCreate', (new_room) => {
        console.log(`New room -- ${new_room}`)
        rooms.push(new_room)
        io.emit('addedRoom', new_room)
    })
    socket.on('joinRoom', (data) => {
        const user = addUser(socket.id, data.name, data.room)
        console.log(user)
        socket.join(user.room);
        let room_users = getRoomUsers(user.room)
        socket.emit('joinRoom', {
            action: 'add', user: user, users: room_users,
            txt: `Welcome to ${user.room} room!`
        })
        socket.broadcast.to(user.room).emit('botMsg', {
            txt: `${user.name} joined the room`, action: 'userJoined',
            sender: 'bot',
            name: user.name, stamp: moment().unix()
        });
    })
    socket.on('message', (msg) => {
        msg['stamp'] = moment().unix();
        socket.broadcast.to(msg.room).emit('message', msg);
    })

    socket.on('disconnect', (socket) => {
        console.log(socket)
    })
})

let port = process.env.port || 3005
server.listen(port, () => { console.log(`Listening on port ${port}`) })

console.log(new Date().valueOf().toString(32))
