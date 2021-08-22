const socket = io()
let avl_rooms = []
const alert_msg_red_bg = '#F35238';
const alert_msg_green_bg = '#4AD411';
let user_room;
let user_name;

socket.on('welcome', (data) => {
    avl_rooms = data.slice()
    addRooms(avl_rooms)
})
socket.on('addedRoom', (new_room) => {
    console.log(new_room)
    avl_rooms.push(new_room)
    addRooms([new_room], new_room);
})
socket.on('joinRoom', msg => {
    if (msg.action) {
        if (msg.action == 'add') {
            user_room = msg.user.room;
            user_name = msg.user.name;
            document.getElementsByClassName('entry')[0].style.display = 'none';
            document.getElementsByClassName('chat')[0].style.display = 'block';
            document.getElementById('chat_user').innerText = user_name;
            document.getElementById('current_room_name').innerHTML = `<strong>${user_room}</strong>`;
            msg.users.forEach(user => {
                addRoomUsers(user.name);
            })
            addnewMessageRow('bot_msg', msg)
        }
    }
})
socket.on(`botMsg`, (msg) => {
    console.log(msg)
    if (msg.action) {
        if (msg.action === 'userJoined') {
            addRoomUsers(msg.name);
            addnewMessageRow('bot_msg', msg, msg.stamp);
        }
    }
})
socket.on('message', (msg) => {
    console.log(msg);
    addnewMessageRow('other_msg', msg, msg.stamp);
})

// socket.emit('joinRoom', {
//     name: 'harish',
//     room: 'public'
// });

function addRooms(rooms, adding_new_room) {
    rooms.forEach(ele => {
        var opt = document.createElement('option');
        opt.value = ele;
        opt.innerHTML = ele;
        document.getElementById('avl_rooms').appendChild(opt);
    })
    if (adding_new_room && adding_new_room == user_room) {
        document.getElementsByClassName('new_room_sec')[0].style.display = 'none';
        showAlert(alert_msg_green_bg, 'Room Created, Enjoy chatting!');
    }
}

function addRoomUsers(name) {
    let user_elem = document.createElement('div');
    user_elem.innerHTML = `<i class="fa fa-user" aria-hidden="true"></i>${name}`
    document.getElementsByClassName('room_users')[0].appendChild(user_elem);
}

// ######### join room
let usr_inp = document.getElementsByClassName('form__input');
let usr_selected_room = document.getElementById('avl_rooms');
document.getElementById('join_btn').addEventListener('click', joinRoom);

function joinRoom() {
    console.log(usr_inp[0].value.length);
    if (usr_inp[0].value.length == 0) {
        showAlert(alert_msg_red_bg, 'Please enter USERNAME')
    } else {
        showAlert(alert_msg_green_bg, `Joining ${usr_selected_room.value} room`)
        user_room = usr_selected_room.value
        socket.emit('joinRoom', {
            name: usr_inp[0].value,
            room: usr_selected_room.value
        });
    }
}

// ########### Create Room
document.getElementsByClassName('create_room_btn')[0].addEventListener('click', () => {
    document.getElementsByClassName('new_room_sec')[0].style.display = 'block'
})

document.getElementById('create_btn').addEventListener('click', () => {
    let new_room_inp = document.getElementById('new_room_inp')
    if (new_room_inp.value) {
        if (avl_rooms.includes(new_room_inp.value)) showAlert(alert_msg_red_bg, `Room name '${new_room_inp.value}' exists, Try another!`)
        else {
            socket.emit('newRoomCreate', new_room_inp.value);
            user_room = new_room_inp.value
        }
    } else {
        showAlert(alert_msg_red_bg, 'Please enter a room name')
    }
})

// ########### alert function
function showAlert(bg, data, timeout = 3000) {
    document.getElementById('alert_msg_div1').innerHTML = data;
    document.getElementsByClassName('alert_msg')[0].style.backgroundColor = bg;
    document.getElementsByClassName('alert_msg')[0].classList.remove('fade_down')
    document.getElementsByClassName('alert_msg')[0].style.display = 'flex';
    setTimeout(() => {
        document.getElementsByClassName('alert_msg')[0].classList.add('fade_down');
        setTimeout(() => {
            document.getElementsByClassName('alert_msg')[0].style.display = 'none';
        }, 250);
    }, timeout);
}

// ############ user message
let user_inp = document.getElementById('user_text');
document.getElementById('send').addEventListener('click', () => {
    let msg = {
        txt: user_inp.value,
        sender: user_name,
        room: user_room
    }
    addnewMessageRow('user_msg', msg);
    socket.emit('message', msg);
})

function addnewMessageRow(by = 'user_msg', msg, stamp = '14:24') {
    let messages = document.getElementsByClassName('messages');
    let msg_row = document.createElement('section')
    if (by == 'bot_msg') {
        msg_row.innerHTML = `<div class="msg_box ${by}">
                            <div class="msg_content"><p class="msg_text">${msg.txt}</p></div>
                            <div class="msg_time ${by}"><span>${stamp}</span></div></div>`
    } else {
        msg_row.innerHTML = `<div class="msg_box ${by}">
                            <div class="msg_content"><strong id="msg_name">${msg.sender}</strong>
                                <p class="msg_text">${msg.txt}</p></div>
                            <div class="msg_time ${by}"><span>${stamp}</span></div></div>`
    }
    messages[0].appendChild(msg_row)
}