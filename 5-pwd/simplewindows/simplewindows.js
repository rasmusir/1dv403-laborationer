var sd;

window.addEventListener("load",function()
{
    sd = new Desktop();
    sd.installPackage("simplewindows/apps.json");
    
});

function Desktop()
{
    this.desktopElement = document.createElement("div");
    this.desktopElement.classList.add("desktop");
    
    this.blurCanvas = document.createElement("canvas");
    this.blur = this.blurCanvas.getContext("2d");
    this.background = new Image();
    this.background.src = "simplewindows/swirl_pattern.png";
    
    this.apps = [];
    this.instances = [];
    this.instanceID = 1;
    
    this.appbar = new Appbar(this);
    
    var self = this;
    this.desktopElement.addEventListener("contextmenu",function(e) { e.preventDefault(); self.openContextMenu(e);});
    
    document.body.appendChild(this.desktopElement);
    
    this.width = this.desktopElement.clientWidth;
    this.height = this.desktopElement.clientHeight;
}

Desktop.prototype.updateBackground = function()
{
    this.blur.width = 50;
    this.blur.height = 50;
    this.blurCanvas.width = 50;
    this.blurCanvas.height = 50;
    this.blur.drawImage(this.background,0,0,50,50);
    
    this.appbar.style.backgroundImage = "url(" + this.blurCanvas.toDataURL() + ")";
};

Desktop.prototype.closeWindow = function(w)
{
    w.element.classList.add("destroy");
    var self = this;
    setTimeout(function()
    {
        self.desktopElement.removeChild(w.element);
    },200);
};

Desktop.prototype.install = function(path)
{
    var self = this;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            var app = new App(self,JSON.parse(this.responseText));
            self.apps.push(app);
            self.appbar.add(app);
        }
    };
    xhr.open("GET",path,true);
    xhr.send(null);
};

Desktop.prototype.installPackage = function(url)
{
    var self = this;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            var json = JSON.parse(this.responseText);
            json.apps.forEach(function(app)
            {
                self.install(app);
            });
        }
    };
    xhr.open("GET",url,true);
    xhr.send(null);
};

Desktop.prototype.openContextMenu = function(e)
{
    var cm = new ContextMenu(this,{x:e.clientX,y:e.clientY});
};

function Appbar(handler)
{
    this.element = document.createElement("div");
    this.element.classList.add("appbar");
    handler.desktopElement.appendChild(this.element);
    
    this.apps = [];
}
Appbar.prototype.add = function(app)
{
    var appIcon = document.createElement("div");
    appIcon.classList.add("appicon");
    appIcon.style.backgroundImage = 'url("' + app.icon + '")';
    appIcon.addEventListener("click",function()
    {
        app.createInstance();
    });
    this.element.appendChild(appIcon);
};

function App(handler,meta)
{
    var self = this;
    this.UID = meta.UID;
    this.name = meta.name;
    this.icon = meta.icon;
    this.script = meta.script;
    this.compiledScript = null;
    this.handler = handler;
    
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            try
            {
                self.compiledScript = eval("(function() {\n"+this.responseText+"\nif (typeof main == 'function') this.main=main; this.__instance = {}; var __instance = this.__instance;\n})");
            }
            catch (e)
            {
                throw e;
            }
        }
    };
    
    xhr.open("GET",this.script,true);
    xhr.send(null);
}
App.prototype.createInstance = function()
{
    var instance = new AppInstance(this);
    instance.id = this.handler.instanceID;
    instance.script.__instance.id = this.handler.instanceID;
    this.handler.instances[this.handler.instanceID] = instance;
    this.handler.instanceID++;
    instance.main(this.handler);
};

function AppInstance(app)
{
    this.app = app;
    this.id = -1;
    this.script = new app.compiledScript(app.handler);
}
AppInstance.prototype.main = function(handler)
{
    if (this.script.main)
        this.script.main(handler);
    else
        console.log("No main function in "+this.app.UID);
};

function Window(handler)
{
    var self = this;
    this.handler = handler;
    this.element = document.createElement("div");
    this.element.classList.add("window");
    this.top = document.createElement("div");
    this.top.classList.add("top");
    this.closeElement = document.createElement("div");
    this.closeElement.classList.add("close");
    this.content = document.createElement("div");
    this.content.classList.add("content");
    this.label = document.createElement("label");
    this.label.classList.add("label");
    
    this.label.innerHTML = "Untitled";
    
    this.top.appendChild(this.label);
    this.top.appendChild(this.closeElement);
    this.element.appendChild(this.top);
    this.element.appendChild(this.content);
    
    this.width = this.element.clientWidth;
    this.height = this.element.clientHeight;
    
    var drag = function(e)
    {
        e.preventDefault();
        self.drag(e);
    };
    
    var stopdrag = function(e)
    {
        e.preventDefault();
        self.handler.desktopElement.removeEventListener("mousemove",drag,true);
        self.handler.desktopElement.removeEventListener("mouseup",stopdrag,true);
    };
    
    this.top.addEventListener("mousedown", function(e)
    {
        e.preventDefault();
        self.drag.offset = {x: e.clientX - self.element.offsetLeft, y: e.clientY - self.element.offsetTop};
        self.handler.desktopElement.addEventListener("mousemove",drag,true);
        self.handler.desktopElement.addEventListener("mouseup",stopdrag,true);
    });
    
    
    
    this.closeElement.addEventListener("mousedown",function(e) {e.stopImmediatePropagation();});
    
    this.closeElement.addEventListener("click",function(e)
    {
        e.preventDefault();
        self.close();
    });
}

Window.prototype.show = function()
{
    var self = this;
    this.element.classList.add("destroy");
    setTimeout(function() {self.element.classList.remove("destroy");}, 0);
    this.handler.desktopElement.appendChild(this.element);
    this.setPosition(this.handler.width/2 - this.element.clientWidth/2, this.handler.height/2 - this.element.clientHeight/2);
};

Window.prototype.setPosition = function(x,y)
{
    x = Math.max(x,0);
    y = Math.max(y,0);
    x = Math.min(x,this.handler.desktopElement.clientWidth-this.element.clientWidth);
    y = Math.min(y,this.handler.desktopElement.clientHeight-this.element.clientHeight);
    this.element.style.left = x+"px";
    this.element.style.top = y+"px";
};

Window.prototype.setSize = function(width,height)
{
    this.element.style.width = width+"px";
    this.element.style.height = height+"px";
};

Window.prototype.setResize = function(resize)
{
    if (resize)
    {
        this.element.classList.add("resize");
    }
    else
    {
        this.element.classList.remove("resize");
    }
};

Window.prototype.setTitle = function(title)
{
    this.label.innerHTML = title;
};

Window.prototype.drag = function(e)
{
    this.setPosition(e.clientX - this.drag.offset.x,e.clientY - this.drag.offset.y);
};

Window.prototype.close = function()
{
    if (this.onclose)
    {
        if (this.onclose())
            this.handler.closeWindow(this);
    }
    else
    {
        this.handler.closeWindow(this);
    }
};

Window.prototype.appendChild = function(node)
{
    this.content.appendChild(node);
};

function ContextMenu(handler,pos)
{
    this.element = document.createElement("div");
    this.element.classList.add("contextmenu");
    
    this.element.style.left = pos.x+"px";
    this.element.style.top = pos.y+"px";
    
    this.element.classList.add("destroy");
    var self = this;
    setTimeout(function() {self.element.classList.remove("destroy");}, 0);
    
    var close = function(e)
    {
        e.preventDefault();
        if (e.target != self.element)
        {
            window.removeEventListener("mousedown",close,true);
            self.element.classList.add("destroy");
            setTimeout(function()
            {
                handler.desktopElement.removeChild(self.element);
            },200);
        }
    };
    
    window.addEventListener("mousedown",close,true);
    
    handler.desktopElement.appendChild(this.element);
}

function Notification(handler)
{
    this.handler = handler;
    
    this.element = document.createElement("div");
    this.element.classList.add("notification");
}
Notification.prototype.show = function()
{
    this.handler.desktopElement.appendChild(this.element);
    var self = this;
    setTimeout(function() {self.element.classList.add("show");}, 0);
    setTimeout(function() {
        self.element.classList.remove("show");
        setTimeout(function()
        {
            self.handler.removeChild(self.element);
        },200);
    }, 5000);
};