var secondsGiven = 0;
var timerOn = 0;
var t;
var checkedBox = 0;
var audio = new Audio();
var w = new Worker('worker.js');

w.onmessage = function (){
    if(timerOn){
        countdown();
    }
}


function setLoad(){

    
    if(localStorage.getItem('checked') == "true"){
        document.getElementById("loop").checked = localStorage.getItem('checked');
        showLoops();
        document.getElementById("loopbox").value = localStorage.getItem('loopTimes');
    }
    if(localStorage.getItem('startTime')){
        document.getElementById("output").innerHTML = localStorage.getItem('startTime');
        document.getElementById("startTimeBox").value = localStorage.getItem('startTime');
    }
    if(localStorage.getItem('selectedSound')){
        document.getElementById("sounds").value = localStorage.getItem('selectedSound');
        document.getElementById("soundValue").value = localStorage.getItem('soundVolume');
        document.getElementById("rangeValue").value = localStorage.getItem('soundVolume')
    }
    else{
        document.getElementById("sounds").value = "Level Up";
        document.getElementById("soundValue").value = 50;
        document.getElementById("rangeValue").value = 50;
    }
    
}

function setOptions(){
    
    localStorage.setItem('checked', document.getElementById("loop").checked);
    localStorage.setItem('loopTimes', document.getElementById("loopbox").value);
    localStorage.setItem('startTime', document.getElementById("startTimeBox").value);
    localStorage.setItem('selectedSound', document.getElementById("sounds").value);
    localStorage.setItem('soundVolume', document.getElementById("rangeValue").value)

}

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
        
    }
   
    if(!timerOn){ //start function
        timerOn = 1;
        document.getElementById("1").innerHTML = "Pause";
        audio.src = `sounds/whistle.mp3`;
        audio.volume = 0.001;
        audio.play();
        convertSecs(inputTime);

    }
    else{ //stop function
        timerOn = 0;
        document.getElementById("1").innerHTML = "Start";

    }

    
}



function countdown(){ 
    
    
    if(secondsGiven >= 0){
        var secs = new Date(secondsGiven * 1000).toISOString().substr(11, 8);
        var result = secs.replace(/^0(?:0:0?)?/, '');
        document.getElementById("output").innerHTML = result;
        document.title = `${result} Looper`

    }

    if(secondsGiven == 0){
        
        if(!checkedBox){
            document.getElementById("1").innerHTML = "Start";
        }
        
        playSound();

    }

    if(secondsGiven == -1){

        var loopbox = document.getElementById("loopbox").value;
        
        if(checkedBox){
            if(loopbox == "" || loopbox > 0){
                if(loopbox > 0){
                    document.getElementById("loopbox").value--;
                }
                setTimer();
                
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

function buttonSet(){
    timerOn = 0;

    document.getElementById("1").innerHTML = "Start";
    setTimer();
}


//set or reset main timer
function setTimer(){
    
    
    
    var inputTime = document.getElementById("startTimeBox").value;
    
    convertSecs(inputTime);
    if(secondsGiven > 86399 || secondsGiven <= 0){
        secondsGiven = 86399;
    }
    var secs = new Date(secondsGiven * 1000).toISOString().substr(11, 8);
    var result = secs.replace(/^0(?:0:0?)?/, '');

    document.getElementById("startTimeBox").value = result;
    document.getElementById("output").innerHTML = result;
    document.title = `${result} Looper`
}

//change range to match value of text input
function changeRange(){
    if(document.getElementById("soundValue").value >= 100){
        document.getElementById("rangeValue").value = 100;
    }else if(document.getElementById("soundValue").value <= 0 || document.getElementById("soundValue") == ""){
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


window.addEventListener("keydown", function(event){
    if(event.code == "Enter"){
        buttonSet();
    }
})