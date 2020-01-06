const http = require('http')
const app = require('./app')
const port = 3000
const server = http.createServer(app)
const check_auth_socket = require('./middleware/check_auth_socket')
var io = require('socket.io')(server)
var {User} = require('./models/user')
server.listen(port)

global.io = io
global.sockets = {}

app.get('/', function(req,res){
    res.sendFile(__dirname + '')
});
io.use(check_auth_socket)
io.on('connection', function(socket){
    console.log('Someone connected', socket.id, socket.userData)

    let {_id: user_id} = socket.userData
    sockets[user_id] ? sockets[user_id].push(socket.id) : (sockets[user_id] = [socket.id])
   console.log(sockets)
    socket.on('disconnect', reason => {
        console.log('Person disconnected: ', socket.id)
        sockets[user_id].forEach((element, index) => {
            if(element == socket.id){
                sockets[user_id].splice(index, 1)
            }
        })
    })
    var sendDataToUser = () => {
        io.to(socket.id).emit('test',{sockets: Object.keys(sockets)})
    }

    socket.on('new_message', async function(message){
      let sender_user =  await User.findOne({_id: user_id})
       sockets[message.user_id].forEach(socket_id => {
            io.to(socket_id).emit('new_message', {
                message: message.message,sender_user
            })
       })
    })
   // setInterval(sendDataToUser,1000)
    update_online_users()
})


var update_online_users = () => {
    let online_users_id = Object.keys(sockets)
    if(online_users_id.length > 0){
        User.find({_id: {$in: online_users_id}})
        .select('username email tel picture _id')
        .exec()
        .then(online_users => {
            Object.keys(sockets).forEach(key => {
                sockets[key].forEach(id => {
                    io.to(id).emit('online_users', {online_users, online_users});
                })
            })
        }).catch(console.log)
    }
}