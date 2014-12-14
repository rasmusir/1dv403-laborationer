var handler;
var socket;
function main(_handler)
{
    handler = _handler;
    var w = new Window(handler);
    w.setTitle("Chat");
    w.setSize(400,400);
    
    var div = document.createElement("div");
    
    var butt = document.createElement("button");
    butt.innerHTML = "Ping Test";
    butt.onclick = pingTest;
    w.appendChild(butt);
    
    
    w.setOverflow("none","auto");
    
    w.appendChild(div);
    
    socket = new io("http://217.211.253.171:20000",{'force new connection': true });
    socket.on("connect",function(){
        var n = new Notification(handler,"Connected");
        n.show();
    });
    
    socket.on("eventmessage",function(data)
    {
        var m = document.createElement("div");
        m.innerHTML = data.message;
        m.style.color = data.color;
        div.appendChild(m);
    });
    
    socket.on("message", function(data)
    {
        var m = document.createElement("div");
        m.innerHTML = data.name + ": " + data.message;
        div.appendChild(m);
    });
    
    w.onclose = function()
    {
        var not = new Notification(handler,"Disconnected");
        not.show();
        socket.disconnect();
        socket.close();
        socket.destroy();
        __instance.destroy();
        return true;
    };
    
    w.show();
}


function pingTest()
{
    var time = (new Date()).getMilliseconds();
    var func = function()
    {
        var t = (new Date()).getMilliseconds();
        var n = (new Notification(handler,"Ping took: " + (t-time) + "ms")).show();
        socket.removeListener("ping",func);
    };
    
    socket.on("ping",func);
    socket.emit("ping",{});
}