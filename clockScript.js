var timerOn = 0;
var elemArray = [];
var elemText = [];
var audio = new Audio();
var ww;

function start(){
    loadOptions();
    displayTime();
}


function setOptions(){
    
    localStorage.removeItem(elemText);
    localStorage.setItem('clockSelectedSound', document.getElementById("sounds").value);
    localStorage.setItem('clockSoundVolume', document.getElementById("rangeValue").value)
    localStorage.setItem('elemText', JSON.stringify(elemText));
}

function loadOptions(){

    

    if(localStorage.getItem('elemText')){
        var tempText = JSON.parse(localStorage.getItem('elemText'));

        for(var i = 0; i < tempText.length; i++){
            document.getElementById("startTimeBox").value = tempText[i];
            addAlarm();
        }

    }
    else{
        document.getElementById("startTimeBox").value = "14:30";
        addAlarm();
        document.getElementById("startTimeBox").value = "44:30";
        addAlarm();
    }
    if(localStorage.getItem('clockSelectedSound')){
        document.getElementById("sounds").value = localStorage.getItem('clockSelectedSound');
        document.getElementById("soundValue").value = localStorage.getItem('clockSoundVolume');
        document.getElementById("rangeValue").value = localStorage.getItem('clockSoundVolume')
    }
    else{
        document.getElementById("sounds").value = "Level Up";
        document.getElementById("soundValue").value = 50;
        document.getElementById("rangeValue").value = 50;
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
    }

    
    audio.volume = document.getElementById("soundValue").value / 100;
    audio.play();
}

function pauseSound(){
    audio.pause();
}


//convert HH:MM:SS to seconds
function convertSecs(inputTime){
    
    var secondsGiven = 0;

    if(inputTime.includes(":")){

        var a = inputTime.split(':');
        var i;
        
        for(i = 0; i < a.length; i++){
            secondsGiven *= 60;
            secondsGiven +=parseInt(a[i]);
        }

    }else{
        secondsGiven = inputTime;
    }
        
    return secondsGiven;
    
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




function addAlarm(){
    
    document.getElementById("startButton").innerHTML = "Start Alarm";
    timerOn = 0;
    document.getElementById("nextAlarm").innerHTML = "--:--"
    document.getElementById("nextTime").innerHTML = "--:--"

    var li = document.createElement("li");
    var inputValue = document.getElementById("startTimeBox").value;
    var y = document.createTextNode(inputValue);
    li.appendChild(y);

    var newTime = convertSecs(inputValue);

    if(inputValue == "" || !inputValue.includes(":")){
        alert("Enter a time in the format MM:SS")
        return;
    }
    else if(newTime > 3599 || newTime < 0){
        return;
    }
    else{
        

        if(elemArray.length == 0){
            document.getElementById("setAlarms").appendChild(li);
            elemArray[0] = newTime;
            elemText[0] = document.getElementById("startTimeBox").value;
        }
        else{
            var i;
            for(i = 0; i < elemArray.length; i++){
                if(elemArray[i] == newTime){
                    
                    return;
                }
            }
            i = 0;
            while(elemArray[i] < newTime && elemArray[i] != undefined){
                i++;
            }
            elemArray.splice(i, 0, newTime);
            elemText.splice(i, 0, document.getElementById("startTimeBox").value);

            var list = document.getElementById("setAlarms");
            list.insertBefore(li, list.childNodes[i+1]);

        }
        
    }

    document.getElementById("startTimeBox").value = "";

    let deleteButton = document.createElement("button");

    deleteButton.className = "delete";
    deleteButton.innerText = "Delete";
    deleteButton.type = "button";
    deleteButton.value = newTime;
    deleteButton.onclick = deleteTask;
    li.appendChild(deleteButton);

}

function deleteTask(){

    
    for(var i = 0; i < elemArray.length; i++){
        if(elemArray[i] == convertSecs(this.value)){
            elemArray.splice(i, 1);
            elemText.splice(i, 1);
        }
    }

    let listItem = this.parentNode;
    let ul = listItem.parentNode;
    
    ul.removeChild(listItem);

    document.getElementById("startButton").innerHTML = "Start Alarm";
    timerOn = 0;
    document.getElementById("nextAlarm").innerHTML = "--:--"
    document.getElementById("nextTime").innerHTML = "--:--"
}

function displayTime(){

    var today = new Date();
    
    var time = `${appendZeroes(today.getHours())}:${appendZeroes(today.getMinutes())}:${appendZeroes(today.getSeconds())}`;
    document.getElementById("output").innerHTML = time;

    if(timerOn){        
        countdown();
    }

    if(ww == null){
        ww = new Worker('worker.js');
    }

    ww.postMessage('a');
    
    ww.onmessage = function (e){
        displayTime();
    }
}

function appendZeroes(timeValue){
    if(timeValue < 10){
        return `0${timeValue}`;
    }
    return timeValue;
}

function startAlarms() {
    
    if(!timerOn){
        document.getElementById("startButton").innerHTML = "Stop Alarm";
        timerOn = 1;
        audio.src = `sounds/whistle.mp3`;
        audio.volume = 0.001;
        audio.play();
    }
    else{
        document.getElementById("startButton").innerHTML = "Start Alarm";
        timerOn = 0;
        document.getElementById("nextAlarm").innerHTML = "--:--"
        document.getElementById("nextTime").innerHTML = "--:--:--"
    }
    
}

function countdown(){ 

    //find input time closest to current time
    var today = new Date();
    var curSecs = today.getMinutes() * 60 + today.getSeconds();
    
    var i = 0;
    

    while(curSecs > elemArray[i] && elemArray[i] != undefined){
        i++;
    }
    
    var alarmTime;

    //if curent time is past all input times, set next alarm to first input time
    if(i == elemArray.length){
        i = 0;
    }
    

    alarmTime = elemArray[i] - curSecs;
    var curHour = today.getHours();

    if(alarmTime < 0){
        curHour++;
        alarmTime += 3600;
        
    }
    
    var secs = new Date(alarmTime * 1000).toISOString().substr(11, 8);
    var result = secs.replace(/^0(?:0:0?)?/, '');

    

    document.getElementById("nextAlarm").innerHTML = result;
    document.getElementById("nextTime").innerHTML = `${curHour}:${elemText[i]}`;
    document.title = `${result} Hourly`

    if(alarmTime == 0){

        playSound();
        
    }

}


window.addEventListener("keydown", function(event){
    if(event.code == "Enter"){
        addAlarm();
    }
})