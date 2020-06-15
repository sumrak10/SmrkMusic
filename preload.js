const remote = require('electron').remote;
const fs = require('fs');
const path = require('path');
const shell = require('electron').shell;
window.addEventListener('DOMContentLoaded', () => {
  var music_list = []
  var splitter = '*-*-*-*-*-*'
  initControls()
  if (localStorage.getItem('music_data_storage') !== null) {
    music_list = localStorage.getItem('music_data_storage');
    music_list = music_list.split(splitter+',')
    addMusic(music_list)
  }
  dragDrop(splitter)


  // assuming $ is jQuery
  $(document).on('click', 'a[href^="http"]', function(event) {
      event.preventDefault();
      shell.openExternal(this.href);
  });

})
function dragDrop(splitter) {
  let target = document.getElementsByTagName("body")[0];
  target.addEventListener("dragover", function(event) {
    event.preventDefault();
  }, false);
  target.addEventListener("dragenter", function(event) {
    event.preventDefault();
    $('.dragdrop-field').css('display', 'flex')
  }, false);
  target.addEventListener("mouseover", function(event) {
    event.preventDefault();
    $('.dragdrop-field').css('display', 'none')
  }, false);
  target.addEventListener("drop", function(event) {
    event.preventDefault();
    $('.dragdrop-field').css('display', 'none')
    let files = event.dataTransfer.files
    let path_ = ''
    for(let i = 0; i < files.length; i++) {
          let pathtofile = files[i].path
          pathtofile = pathtofile.replace(/\\/g, '///')
          pathtofile = pathtofile.split('//')
          for (let j = 0; j < pathtofile.length-1; j++) {
            path_ = path_ + pathtofile[j]
          }
          break
    }
    music_list = getMusic(path_)
    let music_data = []
    for (let i = 0; i < music_list.length-1; i++) {
      music_data.push(music_list[i]+splitter)
    }
    music_data.push(music_list[music_list.length-1])
    localStorage.setItem('music_data_storage', music_data)
    addMusic(music_list)
  }, false);
}
function getMusic(dir, files_){
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files){
      var name = dir + '/' + files[i];
      if (fs.statSync(name).isDirectory()){
          getMusic(name, files_);
      } else {
          name_ = name.split('.')
          if (name_[name_.length-1] == 'mp3') {
              files_.push(name);
          }
      }
  }
  return files_;
}; 
function addMusic(arr) {
  music_list = arr
  let min = 5000
  let max = 0
  for (let i in music_list) {
      if (music_list[i].split('/').length <= min) {
          min = music_list[i].split('/').length
      }
      if (music_list[i].split('/').length >= max) {
          max = music_list[i].split('/').length
      }
  }
  min = min - 2
  max = max - 2
  // ФАЙЛЫ И ПАПКИ
  let folder_id = 0
  let mainfolders = []
  for (let i = min; i <= max; i++) {
    folder_id = folder_id + 1
    for (let j in music_list) {
      let s = music_list[j].split('/')
      if (!(s[i] == undefined)) {
        if (!(isMusic(s[i]))) {
          mainfolders.push(s[i])
        }
      }
    }
  }
  mainfolders = unique(mainfolders)
  createMainFolder(mainfolders[0], 0)
  for (let i=1; i < mainfolders.length; i++) {
    createMainFolder(mainfolders[i], i, min)
  }
  // joinDataToMusic(music_list)
  openFolder()
  openFolderList()
}
function createMainFolder(foldername, folder_id, min) {
  // folder-active
  // folder-list-active
  let block_html = `<div class="folder-main">
  <div class="folder">
      <span class="folder-name">`+foldername+`</span>
      <div class="arrow">
          <span class="arrow-1 arrow-active-1"></span>
          <span class="arrow-2 arrow-active-2"></span>
      </div>
  </div>
  <div class="folder-list">
  </div>
</div>`
  if (folder_id == 0) {
    div = document.getElementsByClassName('local-folder')[0]
    div.insertAdjacentHTML('beforeend', block_html);
  }
  else {
    div = document.getElementsByClassName('folder-list')[0]
    div.insertAdjacentHTML('beforeend', `<span class="folder-list-item">`+foldername+`</span>`);
    div = document.getElementsByClassName('music-list-adding')[0]
    div.insertAdjacentHTML('beforeend', `<div class="music-list"></div`)
    for (let i in music_list) {
      let mcs = music_list[i].split('/')
      if (mcs[mcs.length-2] == foldername) {
        addMusicToMusicList(music_list[i], folder_id, min)
      }
    }
  }
}
function addMusicToMusicList(musicpath, music_list_id, min) {
  ID3.loadTags(musicpath, function() {
    showTags(musicpath, music_list_id, min)
  });
}
function showTags(musicpath, music_list_id, min) {
  let musicnamearr = musicpath.split('/')
  let musicroute = ''
  for (let i = musicnamearr.length-1; i > min; i--) {
    musicroute = musicnamearr[i] + '/' + musicroute
  }
  var tags = ID3.getAllTags(musicpath);
  musictitle = tags['title']
  musicartist = tags['artist']
  musicalbum = tags['album']
  if (musictitle == undefined) {
    musictitle = musicnamearr[musicnamearr.length-1]
  }
  if (musicartist == undefined) {
    musicartist = 'Неизвестный исполнитель'
  }
  if (musicalbum == undefined) {
    musicalbum = 'Неизвестный альбом'
  }
  let block_html = `<div class="music-item">
      <audio class="music-audio" src="`+musicpath+`"></audio>
      <div class="music-item-prop music-item-path">`+musicroute+`</div>
      <div class="music-item-prop music-item-name">`+musictitle+`</div>
      <div class="music-item-prop music-item-artist">`+musicartist+`</div>
      <div class="music-item-prop music-item-album">`+musicalbum+`</div>
  </div>`
  div = document.getElementsByClassName('music-list')[music_list_id-1]
  div.insertAdjacentHTML('beforeend', block_html);
}
function openFolderList() {
  folders_list = document.getElementsByClassName('folder')
  for (let i=0; i < folders_list.length; i++) {
      folders_list[i].addEventListener('click', function(event) {
          document.getElementsByClassName('arrow-1')[i].classList.toggle('arrow-active-1')
          document.getElementsByClassName('arrow-2')[i].classList.toggle('arrow-active-2')
          document.getElementsByClassName('folder')[i].classList.toggle('folder-active')
          document.getElementsByClassName('folder-list')[i].classList.toggle('folder-list-active')
      })
  }
}
function openFolder() {
  folders = document.getElementsByClassName('folder-list-item')
  for (let i=0; i < folders.length; i++) {
      folders[i].addEventListener('click', function(event) {
          $('.music-list-active').toggleClass('music-list-active')
          document.getElementsByClassName('music-list')[i].classList.toggle('music-list-active')
      })
  }
}
function unique(arr) {
  let result = [];

  for (let str of arr) {
    if (!result.includes(str)) {
      result.push(str);
    }
  }

  return result;
}
function isMusic(filename) {
  if (!(filename == '')) {
    s = filename[filename.length-4] + filename[filename.length-3] + filename[filename.length-2] + filename[filename.length-1]
    if (s == '.mp3') {
      return true
    }
    else {
      return false
    }
  }
  else {
    return false
  }
}
function initControls() {
  let window = remote.getCurrentWindow();
  const minButton = document.getElementById('minimize-btn'),
      windowButton = document.getElementById('window-btn'),
      fullscreenButton = document.getElementById('fullscreen-btn'),
      closeButton = document.getElementById('close-btn');

  minButton.addEventListener("click", event => {
      window.minimize();
  });
  fullscreenButton.addEventListener("click", event => {
      window.maximize();
      toggleMaxRestoreButtons();
  });
  windowButton.addEventListener("click", event => {
      window.unmaximize();
      toggleMaxRestoreButtons();
  });
  closeButton.addEventListener("click", event => {
      window.close();
  });
  toggleMaxRestoreButtons();
//   window.on('maximize', toggleMaxRestoreButtons);
//   window.on('unmaximize', toggleMaxRestoreButtons);
  function toggleMaxRestoreButtons() {
    window = remote.getCurrentWindow();
    if (window.isMaximized()) {
        fullscreenButton.style.display = "none";
        windowButton.style.display = "flex";
    } else {
        windowButton.style.display = "none";
        fullscreenButton.style.display = "flex";
    }
  }
}