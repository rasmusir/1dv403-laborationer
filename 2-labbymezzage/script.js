"use strict";

function Messageboard(name)
{
    var templatewrapper = document.querySelector("#boardtemplate");
    
    if (templatewrapper.content)
    {
        var template = templatewrapper.content.querySelector(".board");
    }
    
    
    var self = this;
    this.board = template.cloneNode(true);
    this.scroll = null;
    this.messages = [];
    this.counter = this.board.querySelector(".counter");
    Object.defineProperty(this,"count",{
        get: function()
        {
            return self.messages.length;
        },
        set: function(x)
        {
            this.counter.innerHTML = self.messages.length;
        }
    });
    
    
    this.elements = {
        messagebox: this.board.querySelector(".messages"),
        text: this.board.querySelector(".input .text"),
        post: this.board.querySelector(".input .post")
    };
    
    this.elements.text.addEventListener("keydown", function(e) {
        if (e.keyCode == 13)
        {
            if (!e.shiftKey)
            {
                e.preventDefault();
                self.addMessage(new Message(self,self.elements.text.value));
                self.elements.text.value = "";
            }
        }
    });

    this.elements.post.addEventListener("click",function(){
        self.addMessage(new Message(self,self.elements.text.value));
        self.elements.text.value = "";
    });
    
    this.scrollFunc = function()
    {
        var speed = (self.elements.messagebox.scrollHeight - (self.elements.messagebox.scrollTop + self.elements.messagebox.clientHeight))/5;
        speed = Math.max(1,speed);
        self.elements.messagebox.scrollTop += speed;
        var sb = self.elements.messagebox.scrollTop + self.elements.messagebox.clientHeight;
        var s = self.elements.messagebox.scrollHeight;
        if (s - sb <= 1)
        {
            self.elements.messagebox.scrollTop = self.elements.messagebox.scrollHeight;
            window.clearInterval(self.scroll);
        }
    };
    
}

Messageboard.prototype.addMessage = function(m)
{
    this.elements.messagebox.appendChild(m.element);
    m.id = this.messages.count;
    this.messages.push(m);
    if (this.scroll)
        window.clearInterval(this.scroll);
    this.scroll = window.setInterval(this.scrollFunc, 10);
    this.count = this.messages.length;
};

Messageboard.prototype.removeMessage = function(message)
{
    if (confirm("Säker på att du vill ta bort meddelandet? :C\n("+message.time.toLocaleString()+")"))
    {
        this.messages.splice(message.id,1);
        message.element.style.height = message.element.clientHeight+"px";
        message.element.style.minHeight = "0px";
        window.setTimeout(function() {
            message.element.classList.add("out");
            message.element.addEventListener('webkitAnimationEnd', function()
            {
                message.element.parentElement.removeChild(message.element);
            });
        },10)
        this.count = this.messages.length;
    }
};

function Message(owner,content)
{
    var template = document.querySelector("#boardtemplate").content.querySelector(".message");
    this.element = template.cloneNode(true);
    this.textelement = this.element.querySelector(".text");
    this.textelement.innerHTML = content;
    this.element.appendChild(this.textelement);
    this.remove = this.element.querySelector(".delete");
    this.timeelement = this.element.querySelector(".time");
    this.id = -1;
    var _time;
    var self = this;
    this.remove.addEventListener("click",function()
    {
        owner.removeMessage(self);
    });
    
    
    Object.defineProperty(this,"text",
    {
        get: function()
        {
            return this.textelement.innerHTML;
        },
        set: function(x)
        {
            this.textelement.innerHTML = x;
        }
    });
    
    Object.defineProperty(this,"time",
    {
        get: function()
        {
            return _time;
        },
        set: function(x)
        {
            _time = x;
            this.timeelement.innerHTML = _time.toLocaleTimeString();
        }
    });
    this.time = new Date();
}