$(function() {
    changeThemeToNeoLight()
    $('.theme-switch').on('click', function() {
        $('.switch-btn').toggleClass('switch-btn-checked')
        $('.switch-ball').toggleClass('switch-ball-checked')
        changeThemeToNeoDark()
        changeThemeToNeoLight()
        if ($('body').hasClass('neodark-body')) {
            $('.vol-icon').attr('src', './static/icons/voldark2.svg')
            $('.play-pause').css('background-color','#f00')
            $('.play-pause').css('color','#101111')
            $('.neo-nav-item-active').toggleClass('neodark-nav-item-active')
        }
        else {
            $('.neodark-nav-item-active').toggleClass('neodark-nav-item-active')
            $('.vol-icon').attr('src', './static/icons/vol2.svg')
            $('.play-pause').css('background-color','#000')
            $('.play-pause').css('color','#efeeee')
        }
    })
    menuInit()
    openTab()
    openInfo()
    $('.folder').click()
    $('.folder-list-item').click()
    
    musicSwitch()
})
function openInfo() {
    $('#openinfo-btn').on('click', function() {
        $('.information').toggleClass('information-active')
    })
}
function musicSwitch() {
    play_btn = document.getElementsByClassName('play-pause')[0]
    play_btn.addEventListener("click", function() {
        let pelem = document.getElementsByClassName('playyy')[0]
        let paelem = document.getElementsByClassName('pauseee')[0]
        let musicname = document.getElementsByClassName('music-item-name')[0]
        let playerinfo = document.getElementsByClassName('player-info')[0]
        v = $('.range').val()
        // выключает трек который проигрывается на данный момент
        if (!(pelem == undefined)) {
            pelem.pause()
            pelem.classList.toggle('playyy')
            pelem.classList.toggle('pauseee')
            play_btn.classList.toggle('paused')
        }
        else {
            // продолжает играть запаузенную песню
            if (!(paelem == undefined)) {
                paelem.play()
                paelem.volume = v/100
                paelem.classList.toggle('playyy')
                paelem.classList.toggle('pauseee')
                play_btn.classList.toggle('paused')
            }
            // включает первую песню из списка если нет запаузенных
            else {
                document.getElementsByClassName('music-audio')[0].play()
                document.getElementsByClassName('music-audio')[0].volume = v/100
                document.getElementsByClassName('music-audio')[0].classList.toggle('playyy')
                playerinfo.innerHTML = musicname.innerHTML
                play_btn.classList.toggle('paused')
            }
        }
    })
    
    $('.music-list-adding').on('click', '.music-item', function(e){
        let paelem = document.getElementsByClassName('pauseee')[0]
        let pelem = document.getElementsByClassName('playyy')[0]
        let elem = this.getElementsByClassName('music-audio')[0]
        let musicname = this.getElementsByClassName('music-item-name')[0]
        let playerinfo = document.getElementsByClassName('player-info')[0]
        v = $('.range').val()
        if (pelem == elem) {
            //элемент играет музыку и при этом тыкнут сам на себя
            elem.pause()
            elem.classList.toggle('playyy')
            elem.classList.toggle('pauseee')
            play_btn.classList.toggle('paused')
        }
        else {
            if (pelem == undefined) {
                // играющего элемента нету, тыкнутый начинает играть
                if (!(paelem == undefined)) {
                    paelem.classList.toggle('pauseee')
                }
                elem.play()
                elem.classList.toggle('playyy')
                play_btn.classList.toggle('paused')
                elem.volume = v/100
                playerinfo.innerHTML = musicname.innerHTML
            }
            else {
                // играющий элемент отключается, новый включается
                pelem.pause()
                pelem.classList.toggle('playyy')
                pelem.currentTime = 0;
                elem.play()
                elem.classList.toggle('playyy')
                elem.volume = v/100
                playerinfo.innerHTML = musicname.innerHTML
            }
        }
        
        
    });
    $('.range').on('input',function() {
        v = $('.range').val()
        let pelem = document.getElementsByClassName('playyy')[0]
        let source = 3
        let mode = ''
        if (v == 0) {
            source = 0
        }
        else if ((v < 0) || (v <= 25)) {
            source = 1
        }
        else if ((v < 25) || (v <= 50)) {
            source = 2
        }
        else if ((v < 50) || (v <= 75)) {
            source = 3
        }
        else if ((v < 75) || (v <= 100)) {
            source = 4
        }
        if ($('body').hasClass('neodark-body')) {
            mode = 'dark'
        }
        $('.vol-icon').attr('src','./static/icons/vol'+mode+source+'.svg')
        if (!(pelem == undefined)) {
            pelem.volume = v/100
        }
    })
    $('.pr-in-btn').on('click', function(e) {
        elems = document.getElementsByClassName('music-item')
        let pelemid = 0
        for (let i = 0; i < elems.length; i++) {
            el = document.getElementsByClassName('music-audio')[i]
            if ((el.classList.contains('playyy')) || (el.classList.contains('pauseee'))) {
                pelemid = i
            }
        }
        v = $('.range').val()
        if (this.classList.contains('previous')) {
            pelemid -= 1
        }
        else if (this.classList.contains('incoming')) {
            pelemid += 1
        }
        if (pelemid >= elems.length) {
            pelemid = 0
        }
        else if (pelemid < 0) {
            pelemid = elems.length-1
        }
        let pelem = document.getElementsByClassName('playyy')[0]
        let elem = document.getElementsByClassName('music-audio')[pelemid]
        let musicname = document.getElementsByClassName('music-item-name')[pelemid]
        let playerinfo = document.getElementsByClassName('player-info')[0]
        pelem.pause()
        pelem.classList.toggle('playyy')
        pelem.currentTime = 0;
        elem.play()
        elem.classList.toggle('playyy')
        elem.volume = v/100
        playerinfo.innerHTML = musicname.innerHTML
    })
}
function openTab() {
    let local_btn = $('#local-music'),
        playlist_btn = $('#playlist-music'),
        internet_btn = $('#internet-music'),
        settings_btn = $('#settings'),
        local_tab = $('.local-music'),
        playlist_tab = $('.playlist-music'),
        internet_tab = $('.internet-music'),
        settings_tab = $('.settings');
    let neomode = 'neo-'
    
    local_btn[0].addEventListener('click', function(event) {
        let mode = 'neo-'
        if ($('body').hasClass('neodark-body')) {
            mode = 'neodark-'
        }
        if (local_btn.hasClass(mode+'nav-item-active')) {
            
        }
        else {
            $('.'+mode+'nav-item-active').toggleClass(mode+'nav-item-active')
            $('.music-active').toggleClass('music-active')
            local_btn.toggleClass(mode+'nav-item-active')
            local_tab.toggleClass('music-active')
        }
    })
    playlist_btn[0].addEventListener('click', function(event) {
        let mode = 'neo-'
        if ($('body').hasClass('neodark-body')) {
            mode = 'neodark-'
        }
        if (playlist_btn.hasClass('mode'+'nav-item-active')) {
            
        }
        else {
            $('.'+mode+'nav-item-active').toggleClass(mode+'nav-item-active')
            $('.music-active').toggleClass('music-active')
            playlist_btn.toggleClass(mode+'nav-item-active')
            playlist_tab.toggleClass('music-active')
        }
    })
    internet_btn[0].addEventListener('click', function(event) {
        let mode = 'neo-'
        if ($('body').hasClass('neodark-body')) {
            mode = 'neodark-'
        }
        if (internet_btn.hasClass(mode+'nav-item-active')) {
            
        }
        else {
            $('.'+mode+'nav-item-active').toggleClass(mode+'nav-item-active')
            $('.music-active').toggleClass('music-active')
            internet_btn.toggleClass(mode+'nav-item-active')
            internet_tab.toggleClass('music-active')
        }
    })
    settings_btn[0].addEventListener('click', function(event) {
        let mode = 'neo-'
        if ($('body').hasClass('neodark-body')) {
            mode = 'neodark-'
        }
        if (settings_btn.hasClass(mode+'nav-item-active')) {
            
        }
        else {
            $('.'+mode+'nav-item-active').toggleClass(mode+'nav-item-active')
            $('.music-active').toggleClass('music-active')
            settings_btn.toggleClass(mode+'nav-item-active')
            settings_tab.toggleClass('music-active')
        }
    })
}
function menuInit() {
    $('#openmenu-btn')[0].addEventListener('click', function(event) {
        $('nav').toggleClass('menuactive')
        $('.burger').toggleClass('burger-active')
        $('.music-menu').toggleClass('music-menu-when-menu-active')
    })
}

function changeThemeToNeoLight() {
    $('#local-music').toggleClass('neo-nav-item-active')
    $('body').toggleClass('neo-body')
    $('.img-svg').toggleClass('neo-img-svg')
    $('.menu').toggleClass('neo-menu')
    $('.main-menu-item').toggleClass('neo-menu-item')
    $('.manage-menu-item').toggleClass('neo-menu-item')
    $('.burger').toggleClass('neo-elem')
    $('.minimize').toggleClass('neo-elem')
    $('.window').toggleClass('neo-elem-screen')
    $('.fullscreen').toggleClass('neo-elem-screen')
    $('.close').toggleClass('neo-elem')
    $('.nav').toggleClass('neo-nav')
    $('.nav-item').toggleClass('neo-nav-item')
    $('.local-folders').toggleClass('neo-local-folders')
    $('.opened-folder').toggleClass('neo-opened-folder')
    $('.player').toggleClass('neo-player')
    $('.settings-menu').toggleClass('neo-local-folders')
    $('.range').toggleClass('rangelight')
} 
function changeThemeToNeoDark() {
    $('#local-music').toggleClass('neodark-nav-item-active')
    $('body').toggleClass('neodark-body')
    $('.menu').toggleClass('neodark-block')
    $('.main-menu-item').toggleClass('neodark-menu-item')
    $('.manage-menu-item').toggleClass('neodark-menu-item')
    $('.burger').toggleClass('neodark-elem')
    $('.minimize').toggleClass('neodark-elem')
    $('.window').toggleClass('neodark-elem-screen')
    $('.fullscreen').toggleClass('neodark-elem-screen')
    $('.close').toggleClass('neodark-elem')
    $('.nav').toggleClass('neodark-nav')
    $('.nav-item').toggleClass('neodark-nav-item')
    $('.local-folders').toggleClass('neodark-local-folders')
    $('.opened-folder').toggleClass('neodark-opened-folder')
    $('.player').toggleClass('neodark-player')
    $('.range').toggleClass('darkrange')
    $('.play-pause').toggleClass('play-pause2')
    $('.logo-img').toggleClass('logo-img-dark')
    $('.information').toggleClass('information-dark')
    $('.social-imgs').toggleClass('social-imgs-dark')
} 