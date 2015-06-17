// Copyright 2009 FriendFeed
//
// Licensed under the Apache License, Version 2.0 (the "License"); you may
// not use this file except in compliance with the License. You may obtain
// a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

$(document).ready(function() {
    if (!window.console) window.console = {};
    if (!window.console.log) window.console.log = function() {};



    $("#messageform").live("submit", function() {
        newMessage($(this));

        return false;
    });
    $("#messageform").live("keypress", function(e) {
        if (e.keyCode == 13) {
            newMessage($(this));
            return false;
        }
    });
    $("#message").select();

    updater.start();
});




function newMessage(form) {
    var message = form.formToDict();
    console.log("form" + form);
    updater.socket.send(JSON.stringify(message));
    form.find("input[type=text]").val("").select();
}

jQuery.fn.formToDict = function() {
    var fields = this.serializeArray();

    var json = {}
    for (var i = 0; i < fields.length; i++) {
        json[fields[i].name] = fields[i].value;
    }

    if (json.next) delete json.next;
    json['action'] = "create"
    json['left'] = 0
    json['top'] = 0

    console.log(json);


    return json;
};

var updater = {
    socket: null,

    start: function() {
        var url = "ws://" + location.host + "/chatsocket";
        updater.socket = new WebSocket(url);
        updater.socket.onmessage = function(event) {
            updater.showMessage(JSON.parse(event.data));
        }
    },

    showMessage: function(message) {

        console.log("MESSAGE" + message.toSource());

        var existing = $("#m" + message.id);
         console.log("EXISTING" + existing.toSource());

        existing.css("left",message.left);
        existing.css("top",message.top);

        $('html,body').animate({top: message.top, left: message.left-5}, 1000);

        console.log("position=" + existing.position());

        if (existing.length > 0) return;
        var node = $(message.html).draggable({
        stop: function(event, ui) {
              console.log("node="+ node.position());
              send_move(message["id"], node.position().top, node.position().left)
        }});

        node.hide();
        box = $("#inbox").append(node);

        node.slideDown();
        //node.offset({top:100, left:100});
    }


};

 function send_move(id, top, left) {
              message = {}
              message['id'] = id
              message['left'] = left
              message['top'] = top
              message['action'] = "move"
              console.log("SEND" + message.toSource());

              updater.socket.send(JSON.stringify(message));
 }