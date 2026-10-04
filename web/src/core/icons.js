



const VeyraIcons = {
  finder: 'assets/icons/finder.svg',
  browser: 'assets/icons/browser.svg',
  mail: 'assets/icons/mail.svg',
  notes: 'assets/icons/notes.svg',
  calendar: 'assets/icons/calendar.svg',
  photos: 'assets/icons/photos.svg',
  music: 'assets/icons/music.svg',
  appstore: 'assets/icons/appstore.svg',
  calculator: 'assets/icons/calculator.svg',
  texteditor: 'assets/icons/texteditor.svg',
  terminal: 'assets/icons/terminal.svg',
  settings: 'assets/icons/settings.svg',
  downloads: 'assets/icons/downloads.svg',
  trash: 'assets/icons/trash.svg',
  launchpad: 'assets/icons/launchpad.svg',
  filemanager: 'assets/icons/filemanager.svg',
  veyraHD: 'assets/icons/veyrahd.svg',
  textFile: 'assets/icons/textfile.svg'
};


function iconImg(path, alt = '') {
  return `<img src="${path}" alt="${alt}" class="app-icon-img" loading="lazy">`;
}

window.VeyraIcons = VeyraIcons;
window.iconImg = iconImg;
