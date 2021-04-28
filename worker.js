
timedCount();

var lastSecond;

function timedCount(){

    var today = new Date();

    if(lastSecond == undefined){
        lastSecond = -1;
    }
    
    if(today.getSeconds() != lastSecond){

        self.postMessage('');
        
    }
    
    lastSecond = today.getSeconds();
    setTimeout(timedCount , 5);

}

