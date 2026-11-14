const { app, BrowserWindow } = require('electron')

function criarJanela() {
  const janela = new BrowserWindow({ width: 480, height: 720 })
  janela.loadFile('index.html')
}

app.whenReady().then(criarJanela)

app.on('window-all-closed', () => app.quit())