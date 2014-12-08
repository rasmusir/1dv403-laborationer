window.onload = function()
{
    var quiz = new Quiz();
};

function Quiz()
{
    this.xmlhttp = new XMLHttpRequest();
    
    this.askQuestion("http://vhost3.lnu.se:20080/question/1");
    
    this.question = document.querySelector("#question");
    this.message = document.querySelector("#message");
    this.answer = document.querySelector("#answer");
    this.submit = document.querySelector("#submit");
    
    this.tries = [];
    this.questionCount = 0;
}

Quiz.prototype.askQuestion = function(adr)
{
    var self = this;
    this.xmlhttp.onreadystatechange = function()
    {
        if (this.readyState == 4)
        {
            self.processResponse(JSON.parse(this.responseText));
            this.questionCount++;
        }
    };
    
    this.xmlhttp.open("GET",adr,true);
    this.xmlhttp.send();
};

Quiz.prototype.processResponse = function(response)
{
    var self = this;
    this.message.innerHTML = response.message;
    
    if (this.xmlhttp.status != 400)
    {
        
        if (response.question)
        {
            this.question.innerHTML = response.question;
            
            this.submit.onclick = function()
            {
                self.tries[self.questionCount]++;
                self.sendAnswer(response.nextURL,self.answer.value);
            };
        }
        else if (response.nextURL)
        {
            this.askQuestion(response.nextURL);
        }
        else
        {
            console.log(this.tries);
        }
    }
};

Quiz.prototype.sendAnswer = function(adr,ans)
{
    var self = this;
    this.xmlhttp.onreadystatechange = function()
    {
        if (this.readyState == 4)
        {
            self.processResponse(JSON.parse(this.responseText));
        }
    };
    
    var json = {
        answer: ans
    };
    
    var jsonString = JSON.stringify(json);
    
    this.xmlhttp.open("POST",adr,true);
    this.xmlhttp.setRequestHeader("Content-Type","application/json");
    this.xmlhttp.send(jsonString);
};