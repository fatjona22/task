var socket = null;
    $(document).ready(function(){
        document.getElementById('online_users_ul').addEventListener("click", ul_clicked)
        $('#form_Login').on('submit',function(event){
            console.log('Form Submitting')
            event.preventDefault()
            var name = $("#txt_username").val();
            var pass = $("#txt_password").val();
            var loginData = {
                "username": name,
                 "password": pass
              }
            $.ajax({
                type: 'POST',
                url : 'api/users/login',
               data : JSON.stringify(loginData),
               headers: {
                  'x-auth-token': localStorage.getItem('token')
               },
               contentType: "application/json",
              success: function(data, status, req){
                 
                  
                  localStorage.setItem('token', data.token)
                  connectSocket()
              },
              error: function(){
                  alert("Username or password are wrong")
              }
            })
        })
    })


    var connectSocket = () => {
        let token = localStorage.getItem('token')
        console.log('Token: ', token)
        if(token !== null){
            //connect socket
            socket = io.connect('?token='+token)
            socket.on('new_message', function(data){
                 new_message_arrived(data)
              })

              socket.on("online_users", function(online_users){
                  displayOnline_users(online_users)
              })
        }
    }


    var displayOnline_users = (online_users) => {
      var online_users_ul = document.getElementById('online_users_ul')
        online_users_ul.innerHTML = ''
          online_users.online_users.forEach(element => {
              var new_li = document.createElement('li')
              new_li.innerHTML = element.username
              new_li.dataset.user_id = element._id
              online_users_ul.append(new_li)
          });
    }


    var ul_clicked = (event) => {
        let user_id = event.target.dataset.user_id
        var message = prompt('Type the message: ')
        socket.emit('new_message',{user_id, message})
    }



    var new_message_arrived = data => {
        var messages = document.getElementById('messages')
        var newP = document.createElement('p')
        newP.innerHTML = `New message from ${data.sender_user.username}: ${data.message}`
        messages.append(newP)
    }