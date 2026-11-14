// ---------- Dados ----------
const blocos = ["manha", "tarde", "noite"]

let tarefas = {
  manha: [],
  tarde: [],
  noite: []
}

const guardado = localStorage.getItem("tarefas")
if (guardado) {
  tarefas = JSON.parse(guardado)
}

function salvar() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas))
}

// ---------- Tela ----------
function desenhar() {
  blocos.forEach(function (bloco) {
    const lista = document.querySelector("#" + bloco + " ul")
    lista.innerHTML = ""

    tarefas[bloco].forEach(function (tarefa, posicao) {
      const item = document.createElement("li")
      if (tarefa.feita) item.classList.add("feita")

      const caixa = document.createElement("input")
      caixa.type = "checkbox"
      caixa.checked = tarefa.feita
      caixa.onchange = function () {
        tarefa.feita = caixa.checked
        desenhar()
      }

      const texto = document.createElement("span")
      texto.textContent = tarefa.texto

      const foco = document.createElement("button")
      foco.textContent = "▶"
      foco.title = "Iniciar 25 minutos de foco"
      foco.onclick = function () {
        iniciarPomodoro(tarefa.texto)
      }

      const apagar = document.createElement("button")
      apagar.textContent = "×"
      apagar.onclick = function () {
        tarefas[bloco].splice(posicao, 1)
        desenhar()
      }

      item.append(caixa, texto, foco, apagar)
      lista.appendChild(item)
    })
  })
  salvar()
}

function adicionar(bloco) {
  const campo = document.querySelector("#" + bloco + " input[type=text]")
  const texto = campo.value.trim()
  if (texto === "") return

  tarefas[bloco].push({ texto: texto, feita: false })
  campo.value = ""
  desenhar()
}

blocos.forEach(function (bloco) {
  const secao = document.getElementById(bloco)
  const botao = secao.querySelector(".adicionar button")
  const campo = secao.querySelector("input[type=text]")

  botao.onclick = function () { adicionar(bloco) }
  campo.onkeydown = function (e) {
    if (e.key === "Enter") adicionar(bloco)
  }
})

// ---------- Bloco do horário atual ----------
function destacarAtual() {
  const hora = new Date().getHours()
  let atual = "noite"
  if (hora < 12) atual = "manha"
  else if (hora < 18) atual = "tarde"

  blocos.forEach(function (bloco) {
    document.getElementById(bloco).classList.toggle("agora", bloco === atual)
  })
}

// ---------- Novo dia ----------
document.getElementById("novo-dia").onclick = function () {
  blocos.forEach(function (bloco) {
    tarefas[bloco].forEach(function (tarefa) {
      tarefa.feita = false
    })
  })
  desenhar()
}

// ---------- Pomodoro ----------
const FOCO = 25 * 60
const PAUSA = 5 * 60

let relogio = null
let modo = "foco"
let restante = FOCO
let fim = 0
let nomeTarefa = ""

function formatar(segundos) {
  const m = Math.floor(segundos / 60)
  const s = segundos % 60
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0")
}

function atualizarPainel() {
  const etapa = modo === "foco" ? "Foco: " : "Pausa: "
  document.getElementById("pomo-rotulo").textContent = etapa + nomeTarefa
  document.getElementById("pomo-tempo").textContent = formatar(restante)
  document.title = formatar(restante) + " · Rotina"
}

function bipar() {
  try {
    const ctx = new AudioContext()
    const som = ctx.createOscillator()
    const volume = ctx.createGain()
    volume.gain.value = 0.1
    som.frequency.value = 660
    som.connect(volume)
    volume.connect(ctx.destination)
    som.start()
    som.stop(ctx.currentTime + 0.4)
  } catch (e) {}
}

function rodar() {
  clearInterval(relogio)
  fim = Date.now() + restante * 1000
  relogio = setInterval(function () {
    restante = Math.round((fim - Date.now()) / 1000)
    if (restante <= 0) {
      bipar()
      if (modo === "foco") {
        modo = "pausa"
        restante = PAUSA
        fim = Date.now() + restante * 1000
      } else {
        pararPomodoro()
        return
      }
    }
    atualizarPainel()
  }, 1000)
  document.getElementById("pomo-pausar").textContent = "Pausar"
  atualizarPainel()
}

function iniciarPomodoro(texto) {
  nomeTarefa = texto
  modo = "foco"
  restante = FOCO
  document.getElementById("pomodoro").hidden = false
  rodar()
}

function pararPomodoro() {
  clearInterval(relogio)
  relogio = null
  document.getElementById("pomodoro").hidden = true
  document.title = "Rotina"
}

// ---------- Início ----------
desenhar()
destacarAtual()
setInterval(destacarAtual, 60000)

document.getElementById("pomo-pausar").onclick = function () {
  if (relogio) {
    clearInterval(relogio)
    relogio = null
    this.textContent = "Continuar"
  } else {
    rodar()
  }
}

document.getElementById("pomo-parar").onclick = pararPomodoro
