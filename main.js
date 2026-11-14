const { app, BrowserWindow } = require('electron')
const path = require('path')

function criarJanela() {
  const janela = new BrowserWindow({
    width: 480,
    height: 720,
    icon: path.join(__dirname, 'icone.png')
  })
  janela.loadFile('index.html')
}

app.whenReady().then(criarJanela)

app.on('window-all-closed', () => app.quit())