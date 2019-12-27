var socket = io("/");
var roomID;
var receiverID;
var users_temp = [];
var list_friends = [];
var idUserSelected;
var messages = [];

var userID = document.getElementById("userID").value;

socket.on("connect", function () {
    socket.emit("set-info-user", userID);
});

var ChatSocket = {
    Message: {
        addText: function (message, time, type) {
            var chat_body = $('.layout .content .chat .chat-body');
            if (chat_body.length > 0) {

                type = type ? type : '';
                message = message ? message : 'Null';

                $('.layout .content .chat .chat-body .messages').append('<div class="message-item ' + type + '"><div class="message-content">' + message + '</div><div class="message-action">' + time + ' ' + '' + (type ? '<i class="ti-check"></i>' : '') + '</div></div>');

                chat_body.scrollTop(chat_body.get(0).scrollHeight, -1).niceScroll({
                    cursorcolor: 'rgba(66, 66, 66, 0.20)',
                    cursorwidth: "4px",
                    cursorborder: '0px'
                }).resize();
            }
        },

        // Test add image:
        addImage: function (message, time, type) {
            var chat_body = $('.layout .content .chat .chat-body');
            if (chat_body.length > 0) {

                type = type ? type : '';
                message = message ? message : 'Null';

                $('.layout .content .chat .chat-body .messages').append('<div class="message-item ' + type + '"><img class="message-content" style="width:360px;" src="' + message + '" ></img><div class="message-action">' + time + ' ' + '' + (type ? '<i class="ti-check"></i>' : '') + '</div></div>');

                chat_body.scrollTop(chat_body.get(0).scrollHeight, -1).niceScroll({
                    cursorcolor: 'rgba(66, 66, 66, 0.20)',
                    cursorwidth: "4px",
                    cursorborder: '0px'
                }).resize();
            }
        }
    }
};

document.getElementById("customFile").onchange = function () {
    document.getElementById("label_choose_image").innerHTML = "1 file selected";
};

socket.on("set-all-request-friends", function (friends) {
    var json = JSON.parse(friends);
    let ul = document.getElementById("ul-list-request-friends");
    $('#ul-list-request-friends').empty();
    for (var i = 0; i < json.length; i++) {
        var friend = json[i].userID1;
        users_temp.push(friend._id);
        var li_item = document.createElement("li");
        li_item.className = "list-group-item";

        li_item.innerHTML = "" +
            "                            <div >\n" +
            "                                <figure class=\"avatar\">\n" +
            "                                    <img src=" + friend.avatar_url + " class=\"rounded-circle\">\n" +
            "                                </figure>\n" +
            "                            </div>\n" +
            "                            <div class=\"users-list-body\">\n" +
            "                                <h5 style=\"margin-bottom: 0.8rem\">" + friend.firstname + " " + friend.lastname + "</h5>\n" +
            "                                <div>\n" +
            "                                    <button type=\"button\" class=\"btn btn-primary btn-sm\">Confirm</button>\n" +
            "                                    &nbsp;\n" +
            "                                    <button type=\"button\" class=\"btn btn-secondary btn-sm\">Delete</button>\n" +
            "                                </div>\n" +
            "                            </div>"
        ul.appendChild(li_item);
    }
    $('#ul-list-request-friends li').click(function () {
        var index = $(this).index();
        $('#profileModal').modal();
        document.getElementById("user_fullname").innerHTML = json[index].userID1.firstname + " " + json[index].userID1.lastname;
        document.getElementById("user_email").innerHTML = json[index].userID1.email;
        document.getElementById("user_firstname").innerHTML = json[index].userID1.firstname;
        document.getElementById("user_lastname").innerHTML = json[index].userID1.lastname;
        document.getElementById("user_sex").innerHTML = json[index].userID1.sex;
        document.getElementById("user_avatar").src = json[index].userID1.avatar_url;
    });

    $('#ul-list-request-friends li button').click(function (event) {
        var index_li = $(this).parent().parent().parent().index();
        var index_button = $(this).index();
        event.stopPropagation();
        var id_request = json[index_li].userID1._id;
        if (index_button === 0) {
            socket.emit("confirm-request-friend", id_request);
            $(this).parent().html("&#10004; Done");
        }
        if (index_button === 1) {
            socket.emit("delete-request-friend", id_request);
            $(this).parent().html("&#10004; Deleted");
        }
    });
});

// Noti: confirm friend
socket.on("noti-confirm-request-friend", function (data) {
    socket.emit("set-info-user", userID);
    alert(data.userID2.firstname + " " + data.userID2.lastname + " accepted your friend request!");
});

// Noti: send request
socket.on("noti-sent-request-friend", function (data) {
    socket.emit("set-info-user", userID);
    alert(data.userID1.firstname + " " + data.userID1.lastname + " sent request friend!");
});

socket.on("get-all-users", function (data) {
    var json = JSON.parse(data);
    let ul = document.getElementById("ul-all-users");
    ul.innerHTML = "";
    for (var i = 0; i < json.length; i++) {
        var friend = json[i];
        var li_item = document.createElement("li");
        li_item.className = "list-group-item";

        li_item.innerHTML = "" +
            "                            <div >\n" +
            "                                <figure class=\"avatar\">\n" +
            "                                    <img src=" + friend.avatar_url + " class=\"rounded-circle\">\n" +
            "                                </figure>\n" +
            "                            </div>\n" +
            "                            <div class=\"users-list-body\">\n" +
            "                                <h5 style=\"margin-bottom: 0.8rem\">" + friend.firstname + " " + friend.lastname + "</h5>\n" +
            "                                <div>\n" +
            "                                    <button type=\"button\" class=\"btn btn-primary btn-sm\">Add Friend</button>\n" +
            "                                </div>\n" +
            "                            </div>"
        ul.appendChild(li_item);
    }
    $('#ul-all-users li').click(function () {
        var index = $(this).index();
        $('#profileModal').modal();
        document.getElementById("user_fullname").innerHTML = json[index].firstname + " " + json[index].lastname;
        document.getElementById("user_email").innerHTML = json[index].email;
        document.getElementById("user_firstname").innerHTML = json[index].firstname;
        document.getElementById("user_lastname").innerHTML = json[index].lastname;
        document.getElementById("user_sex").innerHTML = json[index].sex;
        document.getElementById("user_avatar").src = json[index].avatar_url;
    });

    $('#ul-all-users li button').click(function (event) {
        var index_li = $(this).parent().parent().parent().index();
        event.stopPropagation();
        var userID2 = json[index_li]._id;
        socket.emit("event-add-friend", userID2);
        $(this).hide();
        $(this).parent().html("&#10004; Sent Request");
    });
});

// Remove a friend
$('#btn_delete_friend').click(function () {
    $.ajax({
        url: "/delete_friend",
        type: "post",
        data: {userID1: idUserSelected},
        success: function (response) {
            window.location.replace("/");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
});

// Get all users
$(document).on('click', 'div.layout nav.navigation div.nav-group ul li.brackets', function (event) {
    users_temp.push(userID);
    socket.emit("send-users-temp", users_temp);
});

// Send message
$(document).on('submit', '.layout .content .chat .chat-footer form', function (e) {
    e.preventDefault();

    var input = $(this).find('input[type=text]');
    var message = input.val();

    message = $.trim(message);

    if (message) {
        console.log(new Date());
        ChatSocket.Message.addText(message, formatDate(new Date()), 'outgoing-message');
        input.val('');
        socket.emit("send-message-to-server", {message: message, userID: userID, type: "text", toUser: idUserSelected});
    } else {
        input.focus();
    }
});

// Send image
$("#input_image").change(function(){

    var data = new FormData();
    data.append('image', document.getElementById('input_image').files[0]);

    $.ajax({
        url: "/upload",
        type: "post",
        processData: false, // important
        contentType: false, // important
        data: data,
        success: function (response) {
            console.log(response);
            ChatSocket.Message.addImage(response.url, formatDate(new Date()), 'outgoing-message');
            socket.emit("send-message-to-server", {message: response.url, userID: userID, type: "image", toUser: idUserSelected});
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
});

socket.on("get-all-sent-request", function (data) {
    var json = JSON.parse(data);
    let ul = document.getElementById("ul-sent-requests");
    $('#ul-sent-requests').empty();
    for (var i = 0; i < json.length; i++) {
        var friend = json[i].userID2;
        users_temp.push(friend._id);
        var li_item = document.createElement("li");
        li_item.className = "list-group-item";

        li_item.innerHTML = "" +
            "                            <div >\n" +
            "                                <figure class=\"avatar\">\n" +
            "                                    <img src=" + friend.avatar_url + " class=\"rounded-circle\">\n" +
            "                                </figure>\n" +
            "                            </div>\n" +
            "                            <div class=\"users-list-body\">\n" +
            "                                <h5 style=\"margin-bottom: 0.8rem\">" + friend.firstname + " " + friend.lastname + "</h5>\n" +
            "                                <div>\n" +
            "                                    <button type=\"button\" class=\"btn btn-secondary btn-sm\">Cancel Request</button>\n" +
            "                                </div>\n" +
            "                            </div>"
        ul.appendChild(li_item);
    }

    $('#ul-sent-requests li').click(function () {
        var index = $(this).index();
        $('#profileModal').modal();
        document.getElementById("user_fullname").innerHTML = json[index].userID2.firstname + " " + json[index].userID2.lastname;
        document.getElementById("user_email").innerHTML = json[index].userID2.email;
        document.getElementById("user_firstname").innerHTML = json[index].userID2.firstname;
        document.getElementById("user_lastname").innerHTML = json[index].userID2.lastname;
        document.getElementById("user_sex").innerHTML = json[index].userID2.sex;
        document.getElementById("user_avatar").src = json[index].userID2.avatar_url;
    });

    $('#ul-sent-requests li button').click(function (event) {
        var index_li = $(this).parent().parent().parent().index();
        event.stopPropagation();
        var userID2 = json[index_li].userID2._id;
        socket.emit("cancel-request-friend", userID2);
        $(this).hide();
        $(this).parent().html("&#10004; Request Cancelled");
    });
});

socket.on("get-old-messages", function (json_data) {
    var data = JSON.parse(json_data);
    for (var i = 0; i < data.length; i++) {
        var message = data[i].content;
        var date = formatDate(new Date(data[i].created_at));

        if (data[i].sender._id === userID) {
            if (data[i].type === "text"){
                ChatSocket.Message.addText(message, date, 'outgoing-message');
            } else {
                ChatSocket.Message.addImage(message, date, 'outgoing-message');
            }
        } else {
            if (data[i].type === "text") {
                ChatSocket.Message.addText(message, date, '');
            } else {
                ChatSocket.Message.addImage(message, date, '');
            }
        }
    }
});

socket.on("emit-message-to-receiver", function (data) {
    var date = formatDate(new Date(data.created_at));
    if (data.type === "text"){
        ChatSocket.Message.addText(data.content, date, '');
    } else {
        ChatSocket.Message.addImage(data.content, date, '');
    }
});

socket.on("set-all-friends", function (friends) {
    var json = JSON.parse(friends);
    var ul_list_friends = document.getElementById("ul-list-friends");
    $('#ul-list-friends').empty();
    list_friends = [];

    for (var i = 0; i < json.length; i++) {
        let friend;
        if (userID !== json[i].userID1._id) {
            friend = json[i].userID1;
        } else {
            friend = json[i].userID2
        }
        users_temp.push(friend._id);
        let li_list_friends = document.createElement("li");
        li_list_friends.className = "list-group-item";
        li_list_friends.innerHTML = "" +
            "                            <figure class=\"avatar\">\n" +
            "                                <img src=\" " + friend.avatar_url + "\" class=\"rounded-circle\">\n" +
            "                            </figure>\n" +
            "                            <div class=\"users-list-body\">\n" +
            "                                <h5>" + friend.firstname + " " + friend.lastname + "</h5>\n" +
            "                                <p>Click me....</p>\n" +
            "                            </div>"

        ul_list_friends.appendChild(li_list_friends);
        list_friends.push(friend);
    }

    $('#ul-list-friends li').click(function () {
        $('.layout .content .chat .chat-body .messages').empty();
        var index = $(this).index();
        room_id = json[index]._id;
        idUserSelected = list_friends[index]._id;

        socket.emit("join-room", {userID: userID, room_id: room_id});

        document.getElementById("fr_chat_fullname").innerHTML = list_friends[index].firstname + " " + list_friends[index].lastname;
        document.getElementById("fr_chat_avatar").src = list_friends[index].avatar_url;

        document.getElementById("profile_friend_fullname").innerHTML = list_friends[index].firstname + " " + list_friends[index].lastname;
        document.getElementById("profile_friend_avt").src = list_friends[index].avatar_url;
        document.getElementById("profile_friend_email").innerHTML = list_friends[index].email;
        document.getElementById("profile_friend_firstname").innerHTML = list_friends[index].firstname;
        document.getElementById("profile_friend_lastname").innerHTML = list_friends[index].lastname;
    });
});

// Search Chats
$('#input_search_chat').keyup(function(){

    var that = this, $allListElements = $('#ul-list-friends > li');

    var $matchingListElements = $allListElements.filter(function(i, li){
        var listItemText = $(li).text().toUpperCase(), searchText = that.value.toUpperCase();
        return ~listItemText.indexOf(searchText);
    });

    $allListElements.hide();
    $matchingListElements.show();

});

// Search all users
$('#input_search_users').keyup(function(){

    var that = this, $allListElements = $('#ul-all-users > li');

    var $matchingListElements = $allListElements.filter(function(i, li){
        var listItemText = $(li).text().toUpperCase(), searchText = that.value.toUpperCase();
        return ~listItemText.indexOf(searchText);
    });

    $allListElements.hide();
    $matchingListElements.show();

});


function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var day = date.getDay();
    var month = date.getMonth();
    var year = date.getFullYear();
    var strTime = hours + ':' + minutes + ' ' + ampm + '  ';
    return strTime;
}
