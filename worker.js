
timedCount();

function timedCount(){
    
    self.postMessage('a');
    setTimeout(timedCount , 1000);
}

