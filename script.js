// Vanilla
/*jshint esversion: 6 */
let list = document.getElementById('list');
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
document.addEventListener("DOMContentLoaded", function() {
"use strict";

    console.log("start");

    player.playing = false;
    player.autoplay = true;




    loadButton.addEventListener('click', function(e) {
        let urlString = urlInput.value;
        if(urlString === "") {
            console.log("Url empty");
        }
        else {
            let req = new XMLHttpRequest();
            req.open("GET", "https://crossorigin.me/" + urlString);


            req.onerror = function() {
                console.log("Échec de chargement "+ urlString);
            };
            req.onload = function() {
                if (req.status === 200) {
                    let xmlResponse = req.responseXML;
                    let title = xmlResponse.querySelector("channel > title").textContent;
                    let link = xmlResponse.querySelector("channel > link").textContent
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
                            length:enclosure.attributes.length.value,
                            type:enclosure.attributes.type.value,
                            element:option

                        }
                        listData.push(media);
                    });
                } else {
                    console.log("Erreur " + req.status);
                }
            };
            req.send();
        }
    })
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
    function playNew(){
        if(listData.length > 0){
                    Array.from(list.querySelectorAll(".playing")).forEach(function(e){
                        e.classList.remove('playing');
                    });
                    let firstSelected = listData.findIndex(function(elem){ return elem.element.selected});
                    if(firstSelected === -1){
                        firstSelected = 0;
                    }
                    listData[firstSelected].element.classList.add("playing");
                    listData[firstSelected].element.selected = false;

                    let playing = listData[firstSelected];

                    player.src = playing.url;
                    player.type = playing.type;
                }
    }
    playButton.addEventListener('click', function(e) {
        if(!player.playing){
            if(player.currentTime > 0){
                player.play();
            }else {
                playNew();                
            } 
        }else {
            player.pause()
        }
        

    });

    list.addEventListener('dblclick', function(e) {
        console.log(e.target);
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

   

});
