function subclassOf(base)
{
    _subclassOf.prototype = base.prototype;
    return new _subclassOf();
}
function _subclassOf() {};

function LegacyWindow(handler)
{
    Window.call(this,handler);
    this.frame = document.createElement("iframe");
    this.frame.classList.add("legacyframe");
    this.content.classList.add("legacy");
    this.content.appendChild(this.frame);
}
LegacyWindow.prototype = subclassOf(Window);

LegacyWindow.prototype.appendChild = function()
{
    throw Error("Cannot append elements to a LegacyWindow");
};

LegacyWindow.prototype.setDocument = function()
{
    
};

LegacyWindow.prototype.loadURL = function(url)
{
    var self = this;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (this.readyState == 4)
        {
            var path = "";
            var urla = url.split("/");
            for (var i = 0; i<urla.length-1; i++)
            {
                path += urla[i]+"/";
            }
            self.frame.baseURI = "path";
            self.frame.contentWindow.alert = function(text)
            {
                var not = new Notification(self.handler,text);
                not.show();
            };
            var brta = this.responseText.split("<head>");
            var baseResponseText = brta[0] + '<head><base href="'+path+'">' + brta[1];
            self.frame.contentWindow.document.open();
            self.frame.contentWindow.document.write(baseResponseText);
            self.frame.contentWindow.document.close();
        }
    };

    //this.frame.src=url;
    //this.frame.contentWindow.data ="hi";
    
    xhr.open("GET",url,true);
    xhr.send(null);
};
