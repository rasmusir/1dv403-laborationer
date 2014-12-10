var sw;

window.addEventListener("load",function()
{
    sw = new Desktop();
    
    var w = new Window(sw);
    
    w.setPosition(100,100);
    w.show();
    var w2 = new Window(sw);
    
    w2.setPosition(300,100);
    w2.show();
});

function Desktop()
{
    this.desktopElement = document.createElement("div");
    this.desktopElement.classList.add("desktop");
    
    this.blurCanvas = document.createElement("canvas");
    this.blur = this.blurCanvas.getContext("2d");
    this.background = new Image();
    this.background.src = "simplewindows/swirl_pattern.png";
    
    this.appbar = document.createElement("div");
    this.appbar.classList.add("appbar");
    
    this.desktopElement.appendChild(this.appbar);
    document.body.appendChild(this.desktopElement);
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



function Window(handler)
{
    var self = this;
    this.handler = handler;
    this.element = document.createElement("div");
    this.element.classList.add("window");
    this.top = document.createElement("div");
    this.top.classList.add("top");
    this.close = document.createElement("div");
    this.close.classList.add("close");
    this.content = document.createElement("div");
    this.content.classList.add("content");
    this.label = document.createElement("label");
    this.label.classList.add("label");
    
    this.label.innerHTML = "Untitled";
    
    this.top.appendChild(this.label);
    this.top.appendChild(this.close);
    this.element.appendChild(this.top);
    this.element.appendChild(this.content);
    
    var drag = function(e)
    {
        self.drag(e);
    };
    
    this.top.addEventListener("mousedown", function(e)
    {
        self.drag.offset = {x: e.clientX - self.element.offsetLeft, y: e.clientY - self.element.offsetTop};
        self.handler.desktopElement.addEventListener("mousemove",drag,true);
    });
    
    this.handler.desktopElement.addEventListener("mouseup", function()
    {
        self.handler.desktopElement.removeEventListener("mousemove",drag,true);
    });
}

Window.prototype.show = function()
{
    this.handler.desktopElement.appendChild(this.element);
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

Window.prototype.drag = function(e)
{
    this.setPosition(e.clientX - this.drag.offset.x,e.clientY - this.drag.offset.y);
};