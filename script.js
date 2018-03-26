
function pad(n) {
    return (n < 10) ? ("0" + Math.trunc(n)): Math.trunc(n);
}
function secondToReadable(s){
    let hours = s / 3600;
    s %= 3600 ;
    let minutes = s / 60;
    s %=60 ;


    if( hours > 0){
        return pad(hours) + ":" + pad(minutes) + ":" + pad(s);
    } else {
        if(minutes > 0) {
            return pad(minutes) + ":" + pad(s);
        } else {
            return pad(s);
        }
    }
}

function indexPlaying(){
    return listData.findIndex(function(elem){ return elem.element.classList.contains("playing");});
}
document.addEventListener("DOMContentLoaded", function() {
"use strict";

    console.log("start");
    let list = document.getElementById('list');
    let title = document.getElementById('title');
    let player = document.getElementById('player');
    let loadButton = document.getElementById('loadButton');
    let urlInput = document.getElementById('urlInput');
    let listData = [];
    let playistTitle = document.querySelector('#playlist > h2');
    let removeButton = document.querySelector("#remove");
    let upButton = document.querySelector("#upButton");
    let downButton = document.querySelector("#downButton");
    let currentPlaying = null;
    let playButton = document.querySelector("#playButton");
    let prevButton = document.querySelector("#prev");
    let nextButton = document.querySelector("#next");
    let timer = document.querySelector("#timer");
    let progress = document.querySelector("#progress");
    let progressbar = document.querySelector("#progressbar");
    

    

    player.playing = false;
    player.autoplay = true;

    loadButton.addEventListener('click', function(e) {
        let urlString = urlInput.value;
        if(urlString === "") {
            console.log("Url empty");
        }
        else {
            localStorage.setItem('url', urlString);
            let req = new XMLHttpRequest();
            req.open("GET", "https://crossorigin.me/" + urlString);


            req.onerror = function() {
                console.log("Échec de chargement "+ urlString);
            };
            req.onload = function() {
                if (req.status === 200) {
                    let xmlResponse = req.responseXML;
                    let title = xmlResponse.querySelector("channel > title").textContent;
                    let link = xmlResponse.querySelector("channel > link").textContent;
                    playistTitle.innerHTML = "<a href='" + link + "' > " + title + "</a>";
                    Array.from(xmlResponse.getElementsByTagName('item')).forEach(function(elem) {
                        
                        let title = elem.querySelector("title").textContent;
                        let link = elem.querySelector("link").textContent;
                        let enclosure = elem.querySelector("enclosure");

                        let option = document.createElement('option');
                            option.textContent = title;
                        list.appendChild(option);

                        let media = {
                            title:title,
                            link:link,
                            url:enclosure.attributes.url.value,
                            duration:enclosure.getAttribute("length"),
                            type:enclosure.attributes.type.value,
                            element:option

                        };
                        listData.push(media);
                    });
                } else {
                    console.log("Erreur " + req.status);
                }
            };
            req.send();
        }
    });
    removeButton.addEventListener("click", function(e) {
        listData = listData.filter(function(e) {
            if(e.element.selected){
                list.removeChild(e.element);
                return false;
            } else {
                return true;
            }
        });

    });

    upButton.addEventListener("click", function(e){

        for (let i = 1 ; i < listData.length; i++) {
            let current = listData[i];
            
            if(current.element.selected && !listData[i-1].element.selected)
            {

                list.insertBefore(current.element,listData[i-1].element);

                listData[i] = listData[i-1];
                listData[i-1] = current;
            }
        }

    });

    downButton.addEventListener("click", function(e){
        for (let i = listData.length-2 ; i >= 0; i--) {

            let current = listData[i];
            
            if(current.element.selected && !listData[i+1].element.selected)
            {

                list.insertBefore(current.element,listData[i+1].element.nextSibling);

                listData[i] = listData[i+1];
                listData[i+1] = current;

            }
        }

    });
    function playNew(index){
        if(listData.length > 0){
                    Array.from(list.querySelectorAll(".playing")).forEach(function(e){
                        e.classList.remove('playing');
                    });
                    let firstSelected = null;

                    if(index !== undefined){
                        firstSelected = index;
                    }else {
                        firstSelected = listData.findIndex(function(elem){ return elem.element.selected;});
                    }
                    if(firstSelected === -1){
                        firstSelected = 0;
                    }
                    listData[firstSelected].element.classList.add("playing");
                    listData[firstSelected].element.selected = false;

                    let playing = listData[firstSelected];

                    player.src = playing.url;
                    player.type = playing.type;
                    title.textContent = listData[firstSelected].title;
        }

    }
    function playListener(e){
         if(!player.playing){
            if(player.currentTime > 0){
                player.play();
            }else {
                playNew();                
            } 
        }else {
            player.pause();
        }
        
    }
    playButton.addEventListener('click', playListener);
    player.addEventListener('click', playListener);

    list.addEventListener('dblclick', function(e) {
        e.target.selected = true;
        playNew();
    });

    player.addEventListener('playing',function(e) {
        player.playing = true;
        playButton.textContent = "pause";
    });
    player.addEventListener('pause',function(e) {
        player.playing = false;
        playButton.textContent = "play";
    });

    player.addEventListener('ended',function(e){
        let index = indexPlaying();
        if(index < listData.length - 1){
            playNew(index+1);
        }
                
    });

    player.addEventListener('timeupdate', function(e){
        if(Number.isNaN(player.duration)){
            timer.textContent =  "Loading...";
        }else{
            timer.textContent =  secondToReadable(player.currentTime) + " / " + secondToReadable(player.duration);
        }
        progress.style.width = (player.currentTime/player.duration)*100 + "%";

    });
    progressbar.addEventListener('click', function(e){
        if(!Number.isNaN(player.duration)){
            let advance = e.offsetX/parseInt(getComputedStyle(progressbar).width);
            player.currentTime = player.duration * advance;
        }
    });

    prevButton.addEventListener('click', function(e){
        let index = indexPlaying();
        if(index > 0){
            playNew(index-1);
        }
    });
    nextButton.addEventListener('click', function(e){
        let index = indexPlaying();
        if(index < listData.length - 1){
            playNew(index+1);
        }
    });

    if(localStorage.getItem("url")){
        urlInput.value = localStorage.getItem("url");
    }



});
/*
- add image cov
- add justification in repositorie
- add some design

*/