var secondsGiven = 0;
var timerOn = 0;
var t;
var checkedBox = 0;
var audio = new Audio();

//show or hide loop box
function showLoops(){
    var checkBox = document.getElementById("loop");
    var loops = document.getElementById("loops");
    var loopbox = document.getElementById("loopbox");
    if(checkBox.checked == true){
        loops.style.display = "inline";
        loopbox.style.display = "inline";
        checkedBox = 1;
    }else{
        loops.style.display = "none";
        loopbox.style.display = "none";
        checkedBox = 0;
    }
}


//start clock if stopped, stop if running
function startStop(){
    
    var inputTime = document.getElementById("output").innerHTML;

    //reset if clock is at zero
    if(inputTime == "0:00"){
        document.getElementById("output").innerHTML = inputTime = document.getElementById("startTimeBox").value;
        if(checkedBox){

        }
    }
   
    if(!timerOn){ //start function
        timerOn = 1;
        document.getElementById("1").innerHTML = "Pause";
        
        convertSecs(inputTime);
        countdown();
        
    
    }
    else{ //stop function
        timerOn = 0;
        document.getElementById("1").innerHTML = "Start";
        clearTimeout(t);
    }

    
}


function countdown(){ 
    
    if(secondsGiven > 0){
        var secs = new Date(secondsGiven * 1000).toISOString().substr(11, 8);
        var result = secs.replace(/^0(?:0:0?)?/, '');
        document.getElementById("output").innerHTML = result;
        document.title = `${result} Looper`

    }

    if(secondsGiven == 0){
        setZero();
        timerOn = 1;
        if(!checkedBox){
            document.getElementById("1").innerHTML = "Start";
        }
        //implement play sound
        
        playSound();

        
        
        
    }
   

    if(secondsGiven == -1){
        
        if(checkedBox){
            if(document.getElementById("loopbox").value == ""){
                setTimer();
                document.getElementById("1").innerHTML = "Pause";
                timerOn = 1;
            }else if(document.getElementById("loopbox").value > 0){
                document.getElementById("loopbox").value--;
                setTimer();
                document.getElementById("1").innerHTML = "Pause";
                timerOn = 1;
            }else{
                document.getElementById("1").innerHTML = "Start";
                timerOn = 0;
            };
            
        }
        else{
            timerOn = 0;
        }
    }

    secondsGiven--;
    if(timerOn){
        t = setTimeout(countdown,1000);
    }
    
}

//play audio file selected
function playSound(){

    if(!audio.paused){
        audio.pause();
    }
    
    var soundFile = document.getElementById("sounds").value;
    
    if(soundFile == "uploadSound"){

        var sound = URL.createObjectURL(document.getElementById("inputFile").files[0]);
        audio.src = sound;

        
        
    }else{

        audio.src = `sounds/${soundFile}.mp3`;
        //audio = new Audio(`sounds/${soundFile}.mp3`);
    }

    
    audio.volume = document.getElementById("soundValue").value / 100;
    audio.play();
}

function pauseSound(){
    audio.pause();
}



//convert HH:MM:SS to seconds
function convertSecs(inputTime){
    
    if(inputTime.includes(":")){
        var a = inputTime.split(':');
        var i;
        secondsGiven = 0;
        for(i = 0; i < a.length; i++){
            secondsGiven *= 60;
            secondsGiven +=parseInt(a[i]);
        }
        
    }
    else{
          secondsGiven = inputTime;
    }
}

//set timer to zero and stop the clock
function setZero(){

    timerOn = 0;
    clearTimeout(t);
    
    document.getElementById("output").innerHTML = "0:00";

}

//set or reset main timer
function setTimer(){
    
    setZero();
    document.getElementById("1").innerHTML = "Start";
    var inputTime = document.getElementById("startTimeBox").value;
    convertSecs(inputTime);
    if(secondsGiven > 86399 || secondsGiven <= 0){
        secondsGiven = 86399;
    }
    var secs = new Date(secondsGiven * 1000).toISOString().substr(11, 8);
    var result = secs.replace(/^0(?:0:0?)?/, '');

    document.getElementById("startTimeBox").value = result;
    document.getElementById("output").innerHTML = result;
}

//change range to match value of text input
function changeRange(){
    if(document.getElementById("soundValue").value >= 100){
        document.getElementById("rangeValue").value = 100;
    }else if(document.getElementById("soundValue").value <= 0){
        document.getElementById("rangeValue").value = 0;
    }else{
        document.getElementById("rangeValue").value = document.getElementById("soundValue").value;
    }
    audio.volume = document.getElementById("rangeValue").value / 100;
}

function changeVol(){
    document.getElementById("soundValue").value = document.getElementById("rangeValue").value;
    audio.volume = document.getElementById("rangeValue").value / 100;
}


