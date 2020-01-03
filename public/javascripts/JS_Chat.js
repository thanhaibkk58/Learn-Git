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

function refreshClient(){
    users_temp = [];
    list_friends = [];
    list_members_update = [];
    idUserSelected = "";
    messages = [];
    idConversationSelected = -1;

    index_group_selected = -1;
    list_groups = [];
    socket.emit("set-info-user", userID);
    $('#tab_chat').hide();
    $('#tab_info').hide();
}

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

                $('.layout .content .chat .chat-body .messages').append('<li style="list-style-type: none" class="message-item ' + type + '"><div class="message-action">' + firstname + '</div><div class="message-content">' + message + '</div><div class="message-action">' + time + ' ' + '' + (type ? '<i class="ti-check"></i>' : '') + '</div></li>');

                chat_body.scrollTop(chat_body.get(0).scrollHeight, -1).niceScroll({
                    cursorcolor: 'rgba(66, 66, 66, 0.20)',
                    cursorwidth: "4px",
                    cursorborder: '0px'
                }).resize();
            }
        },

        // Add image:
        addImage: function (message, time, type, firstname) {
            var chat_body = $('.layout .content .chat .chat-body');
            if (chat_body.length > 0) {

                type = type ? type : '';
                message = message ? message : 'Null';

                $('.layout .content .chat .chat-body .messages').append('<li style="list-style-type: none" class="message-item ' + type + '"><div class="message-action">' + firstname + '</div><div><img class="message-content" style="width:360px;" src="' + message + '" ></img></div><div class="message-action">' + time + ' ' + '' + (type ? '<i class="ti-check"></i>' : '') + '</div></li>');

                chat_body.scrollTop(chat_body.get(0).scrollHeight, -1).niceScroll({
                    cursorcolor: 'rgba(66, 66, 66, 0.20)',
                    cursorwidth: "4px",
                    cursorborder: '0px'
                }).resize();
            }
        },

        // Add Sticker
        addSticker: function (message, time, type, firstname) {
            var chat_body = $('.layout .content .chat .chat-body');
            if (chat_body.length > 0) {

                type = type ? type : '';
                message = message ? message : 'Null';

                $('.layout .content .chat .chat-body .messages').append('<li style="list-style-type: none" class="message-item ' + type + '"><div class="message-action">' + firstname + '</div><div aria-label=" peeping, character peeping around corner sticker" class="_2poz _ui9" data-testid="sticker" role="img" tabindex="0" style="' + message + '"></div><div class="message-action">' + time + ' ' + '' + (type ? '<i class="ti-check"></i>' : '') + '</div></li>');


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
    var noti = data.userID2.firstname + " " + data.userID2.lastname + " accepted your friend request!";
    $('#message-noti').text(noti);
    $('#notificationModal').modal('show');
    refreshClient();
});

// Noti: send request
socket.on("noti-sent-request-friend", function (data) {
    var noti = data.userID1.firstname + " " + data.userID1.lastname + " sent request friend!";
    $('#message-noti').text(noti);
    $('#notificationModal').modal('show');
    refreshClient();
});

// Noti: delete friend
socket.on("noti-delete-friend", function (data) {
    var noti = "";
    if (userID === data.userID1._id){
        noti = data.userID2.firstname + " " + data.userID2.lastname + " has been removed from your friends list.";
    } else {
        noti = data.userID2.firstname + " " + data.userID2.lastname + " has been removed from your friends list.";
    }
    $('#message-noti').text(noti);
    $('#notificationModal').modal('show');
    refreshClient();
});

// Noti: create group chat
socket.on("noti-create-groupchat", function (data) {
    var noti = "";
    if (userID !== data.created_by._id){
        noti = data.created_by.firstname + " " + data.created_by.lastname + " has added you to a group.";
        $('#message-noti').text(noti);
        $('#notificationModal').modal('show');
    }
    refreshClient();
});

// Noti: update group chat
socket.on("noti-update-groupchat", function (data) {
    console.log(data);
});

socket.on("noti-delete-groupchat", function (data) {
    var noti = "Group \"" + data + "\" has been deleted.";
    $('#message-noti').text(noti);
    $('#notificationModal').modal('show');
    refreshClient();
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
    $('#deleteFriend').modal('show');
});

// Confirm: remove a friend
$('#btn_confirm_delete_friend').click(function () {
    var data = {
        userID1: idUserSelected,
        userID2: userID
    };
    socket.emit("event-delete-friend", data);
    $('#deleteFriend').modal('hide');
});


// Get all users
$(document).on('click', 'div.layout nav.navigation div.nav-group ul li.brackets', function (event) {
    users_temp.push(userID);
    socket.emit("send-users-temp", users_temp);
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
    messages = data;
    var total_messages_me = 0;
    for (var i = 0; i < data.length; i++) {
        var message = data[i].content;
        var date = formatDate(new Date(data[i].created_at));

        if (data[i].sender._id === userID) {
            total_messages_me += 1;
            if (data[i].type === "text") {
                ChatSocket.Message.addText(message, date, 'outgoing-message', data[i].sender.firstname);
            } else if (data[i].type === "sticker"){
                ChatSocket.Message.addSticker(message, date, 'outgoing-message', data[i].sender.firstname);
            } else {
                ChatSocket.Message.addImage(message, date, 'outgoing-message', data[i].sender.firstname);
            }
        } else {
            if (data[i].type === "text") {
                ChatSocket.Message.addText(message, date, '', data[i].sender.firstname);
            } else if (data[i].type === "sticker"){
                ChatSocket.Message.addSticker(message, date, '', data[i].sender.firstname);
            }  else {
                ChatSocket.Message.addImage(message, date, '', data[i].sender.firstname);
            }
        }
    }
    document.getElementById("total_messages").innerHTML = "Sent: " + total_messages_me + "; Received: " + (data.length - total_messages_me) + "; Total: " + data.length;
    document.getElementById("total_messages_group").innerHTML = "Sent: " + total_messages_me + "; Received: " + (data.length - total_messages_me) + "; Total: " + data.length;
});

var index_message;
$('#ul_list_message').on('click', 'li', function (event) {
    event.stopPropagation();
    index_message = $(this).index();
    $('#deleteMessage').modal('toggle');
});

$('#btn_delete_message').click(function () {
    socket.emit("event-delete-message", messages[index_message]._id);
    $('#deleteMessage').modal('hide');
});

socket.on("emit-delete-message", function (idMessage) {
    for (var i = 0; i < messages.length; i++){
        if (messages[i]._id === idMessage){
            $('#ul_list_message li').eq(i).remove();
            messages.splice(i, 1);
        }
    }
});

// Send message
$(document).on('submit', '.layout .content .chat .chat-footer form', function (e) {
    e.preventDefault();

    var input = $(this).find('input[type=text]');
    var message = input.val();

    message = $.trim(message);

    if (message) {
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
            socket.emit("send-message-to-server", {
                message: response.url,
                userID: userID,
                type: "image",
                toUser: idUserSelected
            });
            $("#input_image").val(null);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
});

// Send sticker
$('#btn_send_sticker').click(function (event) {
    event.stopPropagation();
    $('#stickerModal').modal('toggle');
});

$('#table_stikers').on('click', 'td', function (event) {
    event.stopPropagation();
    var index_sticker = $(this).index() + $(this).parent().index() * 4;
    var sticker;
    switch (index_sticker) {
        case 0:
            sticker = "background-image: url(&quot;https://scontent.xx.fbcdn.net/v/t39.1997-6/53604616_2313955348840625_1262474566865780736_n.png?_nc_cat=111&amp;_nc_ohc=DxY2dJ4AUocAQkdk48DM65as4CfmrAJ0paQJSPDTUeyGtf3ZCphCiO53Q&amp;_nc_ad=z-m&amp;_nc_cid=0&amp;_nc_zor=9&amp;_nc_ht=scontent.xx&amp;oh=798bacd0ee3f2db98e0731427abefabf&amp;oe=5EAF32F5&quot;); background-size: 576px 432px; cursor: pointer; height: 120px; width: 120px; background-position: -12px -12px; image-rendering: -webkit-optimize-contrast;";
            break;
        case 1:
            sticker = "background-image: url(&quot;https://scontent.xx.fbcdn.net/v/t39.1997-6/53725816_2313954778840682_3653047002972815360_n.png?_nc_cat=111&amp;_nc_ohc=3RIYGQupbnEAQmH4f_g2MWSTbEiKVDwQLcqh0xeAj08_0KRXs026VlPXQ&amp;_nc_ad=z-m&amp;_nc_cid=0&amp;_nc_zor=9&amp;_nc_ht=scontent.xx&amp;oh=917a4251ea0e496c1c9d3c1301d3d4a4&amp;oe=5EAF1C58&quot;); background-size: 576px 432px; cursor: pointer; height: 120px; width: 120px; background-position: -156px -12px; image-rendering: -webkit-optimize-contrast;";
            break;
        case 2:
            sticker = "background-image: url(&quot;https://scontent.xx.fbcdn.net/v/t39.1997-6/53596069_2313955192173974_874375618282651648_n.png?_nc_cat=110&amp;_nc_ohc=FnIAmOZ0xEMAQmnYWNt7rLPeziOtWC1jSBmN2JUjDxzrP5mu_c4kE32cw&amp;_nc_ad=z-m&amp;_nc_cid=0&amp;_nc_zor=9&amp;_nc_ht=scontent.xx&amp;oh=6dbbf2a50158513ee3a0462d8ada1052&amp;oe=5EA4D4C1&quot;); background-size: 576px 432px; cursor: pointer; height: 120px; width: 120px; background-position: -444px -12px; image-rendering: -webkit-optimize-contrast;";
            break;
        case 3:
            sticker = "background-image: url(&quot;https://scontent.xx.fbcdn.net/v/t39.1997-6/53742771_2313955015507325_4224406098632769536_n.png?_nc_cat=105&amp;_nc_ohc=fFjd3Cs4f3kAQlahMysDUpPoeeov8jXz7iUEytA-ADFeywT-6-5NzZqTA&amp;_nc_ad=z-m&amp;_nc_cid=0&amp;_nc_zor=9&amp;_nc_ht=scontent.xx&amp;oh=210890a77057a9dbb5fbb5dafc11bc79&amp;oe=5E9D1745&quot;); background-size: 576px 432px; cursor: pointer; height: 120px; width: 120px; background-position: -12px -12px; image-rendering: -webkit-optimize-contrast";
            break;
        case 4:
            sticker = "background-image: url(&quot;https://scontent.xx.fbcdn.net/v/t39.1997-6/53683326_2313955542173939_9100309296700194816_n.png?_nc_cat=106&amp;_nc_ohc=VZrTZOcBf2oAQmnKHFeGq-Q483pHQ72zHGz0a6yTL23-NIVdtXy-qCcTA&amp;_nc_ad=z-m&amp;_nc_cid=0&amp;_nc_zor=9&amp;_nc_ht=scontent.xx&amp;oh=5408f90bb6fd36634e3bd9b66d1cf19a&amp;oe=5EABD7DF&quot;); background-size: 576px 432px; cursor: pointer; height: 120px; width: 120px; background-position: -12px -12px; image-rendering: -webkit-optimize-contrast;";
            break;
        case 5:
            sticker = "background-image: url(&quot;https://scontent.xx.fbcdn.net/v/t39.1997-6/53640982_2313954495507377_8604057578340614144_n.png?_nc_cat=109&amp;_nc_ohc=YvkPYRJa0EEAQn5toRdCWXutYcJJ30k20zyoE9Tfv9Wm-MZZB8Y3PkUTA&amp;_nc_ad=z-m&amp;_nc_cid=0&amp;_nc_zor=9&amp;_nc_ht=scontent.xx&amp;oh=f03bedf19ce0cacab4ed070fe0050647&amp;oe=5E6B50F0&quot;); background-size: 576px 432px; cursor: pointer; height: 120px; width: 120px; background-position: -12px -12px; image-rendering: -webkit-optimize-contrast;";
            break;
        case 6:
            sticker = "background-image: url(&quot;https://scontent.xx.fbcdn.net/v/t39.1997-6/53449099_2313955895507237_108886899946422272_n.png?_nc_cat=100&amp;_nc_ohc=35qTDPFXh24AQkqy9QCxqiqwvVhC3nHCZs6sDTrx8B_Le-dAsQry6JQow&amp;_nc_ad=z-m&amp;_nc_cid=0&amp;_nc_zor=9&amp;_nc_ht=scontent.xx&amp;oh=04dcadbe865d169d468c5f89ca4577bb&amp;oe=5E9BEA00&quot;); background-size: 576px 432px; cursor: pointer; height: 120px; width: 120px; background-position: -12px -12px; image-rendering: -webkit-optimize-contrast;";
            break;
        case 7:
            sticker = "background-image: url(&quot;https://scontent.xx.fbcdn.net/v/t39.1997-6/53570619_2313954322174061_3110237216354336768_n.png?_nc_cat=102&amp;_nc_ohc=8lXS-wx3CG8AQnU2DgBAeGpAD3jvslcGbw-fgOVhFScGIde7_bGS7gPog&amp;_nc_ad=z-m&amp;_nc_cid=0&amp;_nc_zor=9&amp;_nc_ht=scontent.xx&amp;oh=901d1d497ad15aeb71f9bbdc45daa61c&amp;oe=5E9CC283&quot;); background-size: 576px 432px; cursor: pointer; height: 120px; width: 120px; background-position: -12px -12px; image-rendering: -webkit-optimize-contrast;";
            break;
        case 8:
            sticker = "background-image: url(&quot;https://scontent.xx.fbcdn.net/v/t39.1997-6/53666578_2313956045507222_1146202109876633600_n.png?_nc_cat=111&amp;_nc_ohc=MC1dk-b89-8AQmG46Lgc6udEKv_gyVANJJcyEGPPlvwlpUqvAjaTkijUA&amp;_nc_ad=z-m&amp;_nc_cid=0&amp;_nc_zor=9&amp;_nc_ht=scontent.xx&amp;oh=7ea27bb4fc788d26a2e54bf789969c26&amp;oe=5EB30732&quot;); background-size: 576px 432px; cursor: pointer; height: 120px; width: 120px; background-position: -12px -12px; image-rendering: -webkit-optimize-contrast;";
            break;
        case 9:
            sticker = "background-image: url(&quot;https://scontent.xx.fbcdn.net/v/t39.1997-6/53673963_2313956205507206_1117656670600691712_n.png?_nc_cat=107&amp;_nc_ohc=71bhGfKAuIwAQlyLZxN0oZhKLUXpChLcdYC1wVTbbBsoZq0IvPATnlY2g&amp;_nc_ad=z-m&amp;_nc_cid=0&amp;_nc_zor=9&amp;_nc_ht=scontent.xx&amp;oh=b058c1e8b830b86673e8a82ccf055cbf&amp;oe=5EA08A91&quot;); background-size: 576px 432px; cursor: pointer; height: 120px; width: 120px; background-position: -156px -12px; image-rendering: -webkit-optimize-contrast;";
            break;
        case 10:
            sticker = "background-image: url(&quot;https://scontent.xx.fbcdn.net/v/t39.1997-6/53695748_2313956508840509_2686562027161255936_n.png?_nc_cat=103&amp;_nc_ohc=Rd8Em3bfqZQAQmOm1y-Yxtj-mrIjsn1Nv6sAR4zHngbOz0d4T_xKTkmDg&amp;_nc_ad=z-m&amp;_nc_cid=0&amp;_nc_zor=9&amp;_nc_ht=scontent.xx&amp;oh=d8630ae4bf65b2f6db5d4c0181378130&amp;oe=5EAE550A&quot;); background-size: 576px 432px; cursor: pointer; height: 120px; width: 120px; background-position: -12px -12px; image-rendering: -webkit-optimize-contrast;";
            break;
        case 11:
            sticker = "background-image: url(&quot;https://scontent.xx.fbcdn.net/v/t39.1997-6/53576079_2313956838840476_5029162856847769600_n.png?_nc_cat=110&amp;_nc_ohc=Fer9aQvQ9xMAQlk3Km02xqKbHOJCYZrL9DiMik95JK1ZlzxEx6WM-lnBg&amp;_nc_ad=z-m&amp;_nc_cid=0&amp;_nc_zor=9&amp;_nc_ht=scontent.xx&amp;oh=ce4bbba5ff44f01734cc033cbf07b3f4&amp;oe=5EAB282B&quot;); background-size: 576px 432px; cursor: pointer; height: 120px; width: 120px; background-position: -12px -12px; image-rendering: -webkit-optimize-contrast;";
            break;
        case 12:
            sticker = "background-image: url(&quot;https://scontent.xx.fbcdn.net/v/t39.1997-6/53662946_2313957122173781_4796252114735071232_n.png?_nc_cat=107&amp;_nc_ohc=Al_M9Li0WM4AQnrYET4at2q6XkMrfzCkDQUsiLJsg_FzcOtlmJcYa3CfQ&amp;_nc_ad=z-m&amp;_nc_cid=0&amp;_nc_zor=9&amp;_nc_ht=scontent.xx&amp;oh=e8d46e652cb1d01eaebac16c879241d3&amp;oe=5EA39D81&quot;); background-size: 576px 432px; cursor: pointer; height: 120px; width: 120px; background-position: -12px -12px; image-rendering: -webkit-optimize-contrast;";
            break;
        case 13:
            sticker = "background-image: url(&quot;https://scontent.xx.fbcdn.net/v/t39.1997-6/53585124_2313956672173826_1846191108070047744_n.png?_nc_cat=107&amp;_nc_ohc=8GNyiQoW7w8AQnczWz3MTdSiFBxnUGXfm_zHWTFzRtez5cG2gmF6SV_VA&amp;_nc_ad=z-m&amp;_nc_cid=0&amp;_nc_zor=9&amp;_nc_ht=scontent.xx&amp;oh=32c05aacff93593e438d06ca41e7e464&amp;oe=5E6711D6&quot;); background-size: 576px 432px; cursor: pointer; height: 120px; width: 120px; background-position: -12px -12px; image-rendering: -webkit-optimize-contrast;";
            break;
        case 14:
            sticker = "background-image: url(&quot;https://scontent.xx.fbcdn.net/v/t39.1997-6/53624079_2313956985507128_5117085256918237184_n.png?_nc_cat=102&amp;_nc_ohc=5EHgZoF1EwYAQk43gHCENqUOCuGFltwnjYfHsZAX_ddfEx9yLeX5fOBUA&amp;_nc_ad=z-m&amp;_nc_cid=0&amp;_nc_zor=9&amp;_nc_ht=scontent.xx&amp;oh=905e5821c304c4a1d3a6ee44071f8ce2&amp;oe=5EAD265C&quot;); background-size: 576px 432px; cursor: pointer; height: 120px; width: 120px; background-position: -12px -12px; image-rendering: -webkit-optimize-contrast;";
            break;
        case 15:
            sticker = "background-image: url(&quot;https://scontent.xx.fbcdn.net/v/t39.1997-6/53524962_2313957425507084_560995618747580416_n.png?_nc_cat=105&amp;_nc_ohc=3Ph5PDU8mXcAQlUXKHjo-qK6XcX_tajsvV6L_Yl2-QnQNIz1LVK7BGWmA&amp;_nc_ad=z-m&amp;_nc_cid=0&amp;_nc_zor=9&amp;_nc_ht=scontent.xx&amp;oh=2aeaf18c09fee57a836cb87015aef04c&amp;oe=5E97F890&quot;); background-size: 576px 432px; cursor: pointer; height: 120px; width: 120px; background-position: -12px -12px; image-rendering: -webkit-optimize-contrast;";
            break;
        case 16:
            sticker = "background-image: url(&quot;https://scontent.fhan2-3.fna.fbcdn.net/v/t39.1997-6/53613012_2313957242173769_2233453431383654400_n.png?_nc_cat=107&amp;_nc_oc=AQlbtj5o7vuSDLr_1ODS0bKrMibpfdrnljCt-nuIsPnvdUp5dVMh-z3Xj0eRwcbNhg0&amp;_nc_ht=scontent.fhan2-3.fna&amp;oh=47d050c6c3cb99ad8d33993bb0317233&amp;oe=5EAEF9C0&quot;); background-size: 576px 432px; cursor: pointer; height: 120px; width: 120px; background-position: -12px -12px; image-rendering: -webkit-optimize-contrast;";
            break;
        case 17:
            sticker = "background-image: url(&quot;https://scontent.fhan2-1.fna.fbcdn.net/v/t39.1997-6/53651915_2313957735507053_840801700016029696_n.png?_nc_cat=106&amp;_nc_oc=AQlOXd3HmQ639SiBN7gZuFEP7BC2AyZuirhFJxT0EH-dFeGm_6TVm1fc5reiMXR1yf8&amp;_nc_ht=scontent.fhan2-1.fna&amp;oh=765c8c684f76a8e8d586079ce8e8c69c&amp;oe=5E9E2C4A&quot;); background-size: 576px 432px; cursor: pointer; height: 120px; width: 120px; background-position: -12px -12px; image-rendering: -webkit-optimize-contrast;";
            break;
        case 18:
            sticker = "background-image: url(&quot;https://scontent.fhan2-3.fna.fbcdn.net/v/l/t39.1997-6/53561531_2313957558840404_4162334522601373696_n.png?_nc_cat=108&amp;_nc_oc=AQn0KYysKdho8GkysGiavRCsg1bECw1ENmMvze8PvO6xD5vUyz_ehKmX8JvjK50GhQ8&amp;_nc_ht=scontent.fhan2-3.fna&amp;oh=aa0e27227ea2c2b8b6f5afcf14aca1c6&amp;oe=5EADF26C&quot;); background-size: 576px 432px; cursor: pointer; height: 120px; width: 120px; background-position: -444px -300px; image-rendering: -webkit-optimize-contrast;";
            break;
        case 19:
            sticker = "background-image: url(&quot;https://scontent.fhan2-1.fna.fbcdn.net/v/t39.1997-6/53629973_2313958098840350_5663473240920555520_n.png?_nc_cat=101&amp;_nc_oc=AQkdfhU61Ro7FVrn3Sr4c5tJHgUqt-gH5mfSR8oSC9xmxITxOgoSQSd7a8-UEzP62Lc&amp;_nc_ht=scontent.fhan2-1.fna&amp;oh=90db414b223b7672d705335c8fb52c5c&amp;oe=5E6E8BCB&quot;); background-size: 576px 432px; cursor: pointer; height: 120px; width: 120px; background-position: -444px -156px; image-rendering: -webkit-optimize-contrast;";
            break;
    }
    socket.emit("send-message-to-server", {message: sticker, userID: userID, type: "sticker", toUser: idUserSelected});
    $('#stickerModal').modal('hide');
});

socket.on("emit-message-to-receiver", function (data) {
    messages.push(data);
    var date = formatDate(new Date(data.created_at));
    if (data.sender._id === userID){
        if (data.type === "text") {
            ChatSocket.Message.addText(data.content, date, 'outgoing-message', data.sender.firstname);
        } else if (data.type === "sticker"){
            ChatSocket.Message.addSticker(data.content, date, 'outgoing-message', data.sender.firstname);
        } else {
            ChatSocket.Message.addImage(data.content, date, 'outgoing-message', data.sender.firstname);
        }
    } else {
        if (data.type === "text") {
            ChatSocket.Message.addText(data.content, date, '', data.sender.firstname);
        } else if (data.type === "sticker"){
            ChatSocket.Message.addSticker(data.content, date, '', data.sender.firstname);
        }else {
            ChatSocket.Message.addImage(data.content, date, '', data.sender.firstname);
        }
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
        idUserSelected = list_friends[index]._id;

        socket.emit("join-room", {userID: userID, room_id: json[index]._id});
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
            "                                <p>Online</p>\n" +
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

        if (groups[index].participants[0]._id ===  userID){
            $('#isAdminGroup').show();
        } else {
            $('#isAdminGroup').hide();
        }

        $('#div_profile_friend').hide();
        var ul_list_members = document.getElementById("ul_list_members");
        $('#ul_list_members').empty();

        var rule = "";
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
    socket.emit("event-delete-conversation", {_id: idConversationSelected});
    $('#deleteGroup').modal('hide');
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
