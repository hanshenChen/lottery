//by chen, 2016-1

var players = [
    "洪1","刘2","傅3","姚4","叶5",
    "尤6","袁7","蔡8","陈9","章10","赵11","缪12",
    "陈13","潘14","徐15","周16","方17",
    "吴18","朱19","沈20","应21"];

var winners=[];
var counter = 0;
var timeHandle;
var timers =30;
var bFall=false;
var mode="";//抽奖模式
var winnerId=0;//获奖编号

function init()
{
    //添加按钮事件
    document.getElementById("WinnerButton").onmousedown=rotateConstantSpeed;
    document.getElementById("WinnerButton").onmouseup=rotateFallingSpeed;
    //转盘内容显示
    dispWheel(counter);
    document.getElementById("radio1").click();
    //存储数据读取
    var rddate=getCookie("winner");
    if(rddate!=null){
        winners=rddate.split(",");
        for(var i=0;i<winners.length;i++)
            dispTableRow(i+1,winners[i]);
    }
}

function playmusic(){
    var musicObj = document.getElementById("musicId");
    musicObj.play();
}

function stopmusic(){
    var musicObj = document.getElementById("musicId");
    musicObj.pause();
}

function rotateConstantSpeed(){
    playmusic();
    timers =20;
    bFall=false;
    rotate();
}

function rotateFallingSpeed(){
    bFall=true;
    //setTimeout(ctrlStop,3000);
}

function ctrlStop(){
    //clearTimeout(timeHandle);
    stopmusic();
    var winner =document.getElementById("wheellocate3").innerHTML+" ";
    document.getElementById("winnerOutput").innerHTML=winner;
    speakout(winner);
    winners.push(winner);
    winnerId++;
    dispTableRow(winnerId,winner);
    if(mode=="singlePrize")
        players.splice((counter+2)%players.length,1);
}

function dispTableRow(row,content)
{
    var targetArea =document.getElementById("tableOutput");
    var tdElement =document.createElement("tr");
    var trElement1 =document.createElement("td");
    var textNode1 =document.createTextNode(row+"");
    trElement1.appendChild(textNode1);
    var trElement2 =document.createElement("td");
    var textNode2 =document.createTextNode(content);
    trElement2.appendChild(textNode2);
    tdElement.appendChild(trElement1);
    tdElement.appendChild(trElement2);
    targetArea.appendChild(tdElement);
}

function rotate() {
    counter++;
    dispWheel(counter);
    if(bFall==true)
    {
        timers = timers+(1.4*Math.log(timers));
        if(timers>300){
            clearTimeout(timeHandle);
            ctrlStop();
        }

        else
            timeHandle=setTimeout(rotate,timers)
    }
    else
    {
        timeHandle=setTimeout(rotate,timers)
    }

}

function dispWheel(subLocate)
{
    document.getElementById("wheellocate1").innerHTML = players[subLocate%players.length];
    document.getElementById("wheellocate2").innerHTML = players[(subLocate+1)%players.length];
    document.getElementById("wheellocate3").innerHTML = players[(subLocate+2)%players.length];
    document.getElementById("wheellocate4").innerHTML = players[(subLocate+3)%players.length];
    document.getElementById("wheellocate5").innerHTML = players[(subLocate+4)%players.length];
}

function radioClick(obj){
    mode=obj.value;
    //alert(mode);
}

function saveWinner(){
    var writeContent= "winner="+winners.join(",")+";";
    var date = new Date();
    date.setTime(date.getTime()+2*24*60*60*1000);
    writeContent += "expires="+date.toGMTString()+";";
    document.cookie=writeContent;
}

function getCookie(name) {
    var nameEquals = name + "=";
    var crumbs = document.cookie.split(';');
    for (var i = 0; i < crumbs.length; i++) {
        var crumb = crumbs[i].trim();
        if (crumb.indexOf(nameEquals) == 0) {
            return unescape(crumb.substring(nameEquals.length, crumb.length));
        }
    }
    return null;
}

function speakout(instr){
    var msg = new SpeechSynthesisUtterance(instr);
    msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == 'Google 普通话（中国大陆）'; })[0];
    speechSynthesis.speak(msg);
}
