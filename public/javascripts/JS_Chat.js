var socket = io("/");
var users_temp = [];
var list_friends = [];
var list_members_update = [];
var idUserSelected;
var messages = [];
var idConversationSelected;

var index_group_selected;
var list_groups;

var userID = document.getElementById("userID").value;
var my_firstname = document.getElementById("firstname").value;

socket.on("connect", function () {
    $('#tab_chat').hide();
    $('#tab_info').hide();
    socket.emit("set-info-user", userID);
});

var ChatSocket = {
    Message: {
        addText: function (message, time, type, firstname) {
            var chat_body = $('.layout .content .chat .chat-body');
            if (chat_body.length > 0) {

                type = type ? type : '';
                message = message ? message : 'Null';

                $('.layout .content .chat .chat-body .messages').append('<div class="message-item ' + type + '"><div class="message-action">' + firstname + '</div><div class="message-content">' + message + '</div><div class="message-action">' + time + ' ' + '' + (type ? '<i class="ti-check"></i>' : '') + '</div></div>');

                chat_body.scrollTop(chat_body.get(0).scrollHeight, -1).niceScroll({
                    cursorcolor: 'rgba(66, 66, 66, 0.20)',
                    cursorwidth: "4px",
                    cursorborder: '0px'
                }).resize();
            }
        },

        // Test add image:
        addImage: function (message, time, type, firstname) {
            var chat_body = $('.layout .content .chat .chat-body');
            if (chat_body.length > 0) {

                type = type ? type : '';
                message = message ? message : 'Null';

                $('.layout .content .chat .chat-body .messages').append('<div class="message-item ' + type + '"><div class="message-action">' + firstname + '</div><img class="message-content" style="width:360px;" src="' + message + '" ></img><div class="message-action">' + time + ' ' + '' + (type ? '<i class="ti-check"></i>' : '') + '</div></div>');

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
        if (index_button === 0) {
            socket.emit("confirm-request-friend", {idFriend: json[index_li]._id, userID: userID});
            $(this).parent().html("&#10004; Done");
        }
        if (index_button === 1) {
            socket.emit("delete-request-friend", json[index_li]._id);
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
    alert(data.userID1.firstname + " " + data.userID1.lastname + " sent request friend!");
    socket.emit("set-info-user", userID);
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
        var data = {
            userID1: userID,
            userID2: json[index_li]._id
        };
        socket.emit("event-add-friend", data);
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
        error: function (jqXHR, textStatus, errorThrown) {
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
        ChatSocket.Message.addText(message, formatDate(new Date()), 'outgoing-message', my_firstname);
        input.val('');
        socket.emit("send-message-to-server", {message: message, userID: userID, type: "text", toUser: idUserSelected});
    } else {
        input.focus();
    }
});

// Send image
$("#input_image").change(function () {

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
            ChatSocket.Message.addImage(response.url, formatDate(new Date()), 'outgoing-message', my_firstname);
            socket.emit("send-message-to-server", {
                message: response.url,
                userID: userID,
                type: "image",
                toUser: idUserSelected
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
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
        socket.emit("cancel-request-friend", json[index_li]._id);
        $(this).hide();
        $(this).parent().html("&#10004; Request Cancelled");
    });
});

socket.on("get-old-messages", function (json_data) {
    var data = JSON.parse(json_data);
    var total_messages_me = 0;
    for (var i = 0; i < data.length; i++) {
        var message = data[i].content;
        var date = formatDate(new Date(data[i].created_at));

        if (data[i].sender._id === userID) {
            total_messages_me += 1;
            if (data[i].type === "text") {
                ChatSocket.Message.addText(message, date, 'outgoing-message', data[i].sender.firstname);
            } else {
                ChatSocket.Message.addImage(message, date, 'outgoing-message', data[i].sender.firstname);
            }
        } else {
            if (data[i].type === "text") {
                ChatSocket.Message.addText(message, date, '', data[i].sender.firstname);
            } else {
                ChatSocket.Message.addImage(message, date, '', data[i].sender.firstname);
            }
        }
    }
    document.getElementById("total_messages").innerHTML = "Sent: " + total_messages_me + "; Received: " + (data.length - total_messages_me) + "; Total: " + data.length;
    document.getElementById("total_messages_group").innerHTML = "Sent: " + total_messages_me + "; Received: " + (data.length - total_messages_me) + "; Total: " + data.length;
});

socket.on("emit-message-to-receiver", function (data) {
    var date = formatDate(new Date(data.created_at));
    if (data.type === "text") {
        ChatSocket.Message.addText(data.content, date, '', data.sender.firstname);
    } else {
        ChatSocket.Message.addImage(data.content, date, '', data.sender.firstname);
    }
});

socket.on("set-all-friends", function (friends) {
    var json = JSON.parse(friends);
    var ul_list_friends = document.getElementById("ul-list-friends");
    $('#ul-list-friends').empty();
    $('#ul_list_friends_groupchat').empty();
    list_friends = [];

    for (var i = 0; i < json.length; i++) {
        let friend;
        if (userID !== json[i].userID1._id) {
            friend = json[i].userID1;
        } else {
            friend = json[i].userID2
        }
        users_temp.push(friend._id);
        // For list chat
        let li_list_friends = document.createElement("li");
        li_list_friends.className = "list-group-item";
        li_list_friends.innerHTML = "" +
            "                            <figure class=\"avatar\">\n" +
            "                                <img src=\" " + friend.avatar_url + "\" class=\"rounded-circle\">\n" +
            "                            </figure>\n" +
            "                            <div class=\"users-list-body\">\n" +
            "                                <h5>" + friend.firstname + " " + friend.lastname + "</h5>\n" +
            "                                <p>Offline</p>\n" +
            "                            </div>"

        ul_list_friends.appendChild(li_list_friends);

        // For create group chat
        var ul_list_friends_groupchat = document.getElementById("ul_list_friends_groupchat");
        let li_list_friends_group = document.createElement("li");
        li_list_friends_group.className = "list-group-item";
        li_list_friends_group.innerHTML = "<div class=\"custom-control custom-checkbox\">\n" +
            "                                <input type=\"checkbox\" class=\"custom-control-input\">\n" +
            "                                <label class=\"custom-control-label\">" + friend.firstname + " " + friend.lastname + "</label>\n" +
            "                            </div>";
        ul_list_friends_groupchat.appendChild(li_list_friends_group);
        list_friends.push(friend);
    }

    $('#ul-list-friends li').click(function () {
        $('#tab_chat').show();
        $('#tab_info').show();
        $('.layout .content .chat .chat-body .messages').empty();
        var index = $(this).index();
        room_id = json[index]._id;
        idUserSelected = list_friends[index]._id;

        socket.emit("join-room", {userID: userID, room_id: room_id});
        $('#div_info_group').hide();
        $('#div_profile_friend').show();
        document.getElementById("fr_chat_fullname").innerHTML = list_friends[index].firstname + " " + list_friends[index].lastname;
        document.getElementById("fr_chat_avatar").src = list_friends[index].avatar_url;

        document.getElementById("profile_friend_fullname").innerHTML = list_friends[index].firstname + " " + list_friends[index].lastname;
        document.getElementById("profile_friend_avt").src = list_friends[index].avatar_url;
        document.getElementById("profile_friend_email").innerHTML = list_friends[index].email;
        document.getElementById("profile_friend_firstname").innerHTML = list_friends[index].firstname;
        document.getElementById("profile_friend_lastname").innerHTML = list_friends[index].lastname;
    });

    // Select friend (Group chat)
    $('#ul_list_friends_groupchat li').click(function (event) {
        var checkbox = $(this).find("input[type='checkbox']");
        if (checkbox.is(':checked')) {
            checkbox.prop('checked', false);
        } else {
            checkbox.prop('checked', true);
        }
    });

    // Event create group chat
    $('#btn_create_group_chat').click(function () {
        var name = $('#group_name').val();
        var description = $('#description').val();
        var created_by = userID.trim();
        var participants = [];
        participants.push(userID);
        $('#ul_list_friends_groupchat').find("input:checkbox:checked").each(function () {
            var index = $(this).parent().parent().index();
            participants.push(list_friends[index]._id);
            $(this).prop('checked', false);
        });
        var data = {
            name: name,
            description: description,
            created_by: created_by,
            participants: participants
        };

        socket.emit("event-create-group-chat", data);
        $("#newGroup").modal('hide');
    });
});

// All groups
socket.on("set-all-groups", function (data) {
    var groups = JSON.parse(data);
    list_groups = groups;
    $('#ul-list-groups').empty();
    var ul_list_groups = document.getElementById("ul-list-groups");

    for (var i = 0; i < groups.length; i++) {
        let li_group = document.createElement("li");
        li_group.className = "list-group-item";
        li_group.innerHTML = "" +
            "                            <figure class=\"avatar\">\n" +
            "                                <img src=\" " + groups[i].avatar_url + "\" class=\"rounded-circle\">\n" +
            "                            </figure>\n" +
            "                            <div class=\"users-list-body\">\n" +
            "                                <h5>Group: " + groups[i].name + "</h5>\n" +
            "                                <p>Click me....</p>\n" +
            "                            </div>"

        ul_list_groups.appendChild(li_group);
    }

    $('#ul-list-groups li').click(function () {
        $('#tab_chat').show();
        $('#tab_info').show();
        $('.layout .content .chat .chat-body .messages').empty();
        var index = $(this).index();
        index_group_selected = index;
        $('#div_info_group').show();
        idConversationSelected = groups[index]._id;
        socket.emit("join-room", {userID: userID, room_id: groups[index]._id});

        document.getElementById("fr_chat_fullname").innerHTML = "Group: " + groups[index].name;
        document.getElementById("fr_chat_avatar").src = groups[index].avatar_url;

        document.getElementById("profile_friend_fullname").innerHTML = "Group: " + groups[index].name;
        document.getElementById("info_group_description").innerHTML = groups[index].description;
        document.getElementById("profile_friend_avt").src = groups[index].avatar_url;

        $('#div_profile_friend').hide();
        var ul_list_members = document.getElementById("ul_list_members");
        $('#ul_list_members').empty();

        var rule = "";
        console.log(groups[index]);
        for (var i = 0; i < groups[index].participants.length; i++) {
            if (i === 0) rule = "Admin";
            else rule = "Member";
            let li_member = document.createElement("li");
            li_member.className = "list-group-item";
            li_member.innerHTML = "" +
                "                            <figure class=\"avatar\">\n" +
                "                                <img src=\" " + groups[index].participants[i].avatar_url + "\" class=\"rounded-circle\">\n" +
                "                            </figure>\n" +
                "                            <div class=\"users-list-body\">\n" +
                "                                <h5>" + groups[index].participants[i].firstname + " " + groups[index].participants[i].lastname + "</h5>\n" +
                "                                <p>" + rule + "</p>\n" +
                "                            </div>"

            ul_list_members.appendChild(li_member);

        }
    });
});

// Update group
$('#btn_update_group').click(function () {
    $('#updateGroup').modal('toggle');
    $('#ul_list_friends_groupchat_update').empty();
    list_members_update = [];
    $('#group_name_update').val(list_groups[index_group_selected].name);
    $('#description_update').val(list_groups[index_group_selected].description);
    var ul_list_friends_groupchat_update = document.getElementById("ul_list_friends_groupchat_update");
    var list_members_temp = list_groups[index_group_selected].participants;
    for (var i = 0; i < list_friends.length; i++) {
        let li = document.createElement("li");
        li.className = "list-group-item";

        var length = list_members_temp.length;
        var checked = false;
        for (var j = 1; j < length; j++) {
            if (list_friends[i]._id === list_members_temp[j]._id) {
                li.innerHTML = "<div class=\"custom-control custom-checkbox\">\n" +
                    "                                <input type=\"checkbox\" class=\"custom-control-input\" checked>\n" +
                    "                                <label class=\"custom-control-label\">" + list_friends[i].firstname + " " + list_friends[i].lastname + "</label>\n" +
                    "                            </div>";
                list_members_update.push(list_friends[i]);
                list_members_temp.splice(j, 1);
                checked = true;
                break;
            }
        }
        if (checked === false) {
            li.innerHTML = "<div class=\"custom-control custom-checkbox\">\n" +
                "                                <input type=\"checkbox\" class=\"custom-control-input\">\n" +
                "                                <label class=\"custom-control-label\">" + list_friends[i].firstname + " " + list_friends[i].lastname + "</label>\n" +
                "                            </div>";
            list_members_update.push(list_friends[i]);
        }
        ul_list_friends_groupchat_update.appendChild(li);
    }
    for (var k = 1; k < list_members_temp.length; k++) {
        let li = document.createElement("li");
        li.className = "list-group-item";
        li.innerHTML = "<div class=\"custom-control custom-checkbox\">\n" +
            "                                <input type=\"checkbox\" class=\"custom-control-input\" checked>\n" +
            "                                <label class=\"custom-control-label\">" + list_members_temp[k].firstname + " " + list_members_temp[k].lastname + "</label>\n" +
            "                            </div>";
        ul_list_friends_groupchat_update.appendChild(li);
        list_members_update.push(list_members_temp[k]);
    }
});

// Select friend (update group chat)
$('#ul_list_friends_groupchat_update').on('click', 'li', function (event) {
    event.preventDefault();
    var checkbox = $(this).find("input[type='checkbox']");
    if (checkbox.is(':checked')) {
        checkbox.prop('checked', false);
    } else {
        checkbox.prop('checked', true);
    }
});

// Event update group chat:
$('#btn_update_group_chat').click(function () {
    // Event update group chat
    var name = $('#group_name_update').val();
    var description = $('#description_update').val();
    var created_by = userID.trim();
    var participants = [];
    participants.push(userID);
    $('#ul_list_friends_groupchat_update').find("input:checkbox:checked").each(function () {
        var index = $(this).parent().parent().index();
        participants.push(list_members_update[index]._id);
        $(this).prop('checked', false);
    });
    var data = {
        _id: idConversationSelected,
        name: name,
        description: description,
        created_by: created_by,
        participants: participants
    };

    socket.emit("event-update-group-chat", data);
    $("#updateGroup").modal('hide');
});

// Delete conversation
$('#btn_delete_group').click(function () {
    $('#deleteGroup').modal('toggle');
});

// Confirm remove conversation
$('#btn_confirm_delete_group').click(function () {
    $.ajax({
        url: "/delete_conversation",
        type: "POST",
        data: {_id: idConversationSelected},
        success: function (response) {
            window.location.replace("/");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
});

// Search Chats
$('#input_search_chat').keyup(function () {

    var that = this, $allListElements = $('#ul-list-friends > li');

    var $matchingListElements = $allListElements.filter(function (i, li) {
        var listItemText = $(li).text().toUpperCase(), searchText = that.value.toUpperCase();
        return ~listItemText.indexOf(searchText);
    });

    $allListElements.hide();
    $matchingListElements.show();

});

// Search friends in update group chat
$('#input_search_friends_update').keyup(function () {

    var that = this, $allListElements = $('#ul_list_friends_groupchat_update > li');

    var $matchingListElements = $allListElements.filter(function (i, li) {
        var listItemText = $(li).text().toUpperCase(), searchText = that.value.toUpperCase();
        return ~listItemText.indexOf(searchText);
    });

    $allListElements.hide();
    $matchingListElements.show();

});

// Search friends in group chat
$('#input_search_friends').keyup(function () {

    var that = this, $allListElements = $('#ul_list_friends_groupchat > li');

    var $matchingListElements = $allListElements.filter(function (i, li) {
        var listItemText = $(li).text().toUpperCase(), searchText = that.value.toUpperCase();
        return ~listItemText.indexOf(searchText);
    });

    $allListElements.hide();
    $matchingListElements.show();

});

// Search all users
$('#input_search_users').keyup(function () {

    var that = this, $allListElements = $('#ul-all-users > li');

    var $matchingListElements = $allListElements.filter(function (i, li) {
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
