
timedCount();

var lastSecond;

function timedCount(){

    var today = new Date();
    var curSecs = `${today.getSeconds()}:${today.getMilliseconds()}`;

    if(lastSecond == undefined){
        lastSecond = -1;
    }
    
    
    if(today.getSeconds() != lastSecond){
        console.log(lastSecond);
    console.log(curSecs);
        self.postMessage('');
        
    }
    

    lastSecond = today.getSeconds();
    setTimeout(timedCount , 5);

}

