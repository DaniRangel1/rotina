const blocos = ["manha", "tarde", "noite"]

const tarefasPadrao = {
  manha: [],
  tarde: [],
  noite: []
}

let tarefas = { ...tarefasPadrao }

function normalizarTarefas(valor) {
  const base = { ...tarefasPadrao }

  blocos.forEach(function (bloco) {
    const lista = Array.isArray(valor && valor[bloco]) ? valor[bloco] : []
    base[bloco] = lista
      .filter(function (tarefa) {
        return tarefa && typeof tarefa === "object"
      })
      .map(function (tarefa) {
        return {
          texto: String(tarefa.texto || "").trim(),
          feita: Boolean(tarefa.feita)
        }
      })
      .filter(function (tarefa) {
        return tarefa.texto !== ""
      })
  })

  return base
}

try {
  const guardado = localStorage.getItem("tarefas")
  if (guardado) {
    tarefas = normalizarTarefas(JSON.parse(guardado))
  }
} catch (erro) {
  console.warn("Não foi possível carregar as tarefas salvas.", erro)
  tarefas = { ...tarefasPadrao }
}

function salvar() {
  try {
    localStorage.setItem("tarefas", JSON.stringify(tarefas))
  } catch (erro) {
    console.warn("Não foi possível salvar as tarefas.", erro)
  }
}

function desenhar() {
  blocos.forEach(function (bloco) {
    const lista = document.querySelector("#" + bloco + " ul")
    if (!lista) return

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

      const apagar = document.createElement("button")
      apagar.textContent = "×"
      apagar.onclick = function () {
        tarefas[bloco].splice(posicao, 1)
        desenhar()
      }

      item.append(caixa, texto, apagar)
      lista.appendChild(item)
    })
  })
  salvar()
}

function adicionar(bloco) {
  const campo = document.querySelector("#" + bloco + " input[type=text]")
  if (!campo) return

  const texto = campo.value.trim()
  if (texto === "") return

  if (!Array.isArray(tarefas[bloco])) {
    tarefas[bloco] = []
  }

  tarefas[bloco].push({ texto: texto, feita: false })
  campo.value = ""
  desenhar()
}

blocos.forEach(function (bloco) {
  const secao = document.getElementById(bloco)
  if (!secao) return

  const botao = secao.querySelector(".adicionar button")
  const campo = secao.querySelector("input[type=text]")

  if (botao) {
    botao.onclick = function () { adicionar(bloco) }
  }

  if (campo) {
    campo.onkeydown = function (e) {
      if (e.key === "Enter") adicionar(bloco)
    }
  }
})

desenhar()
function destacarAtual() {
  const hora = new Date().getHours()
  let atual = "noite"
  if (hora < 12) atual = "manha"
  else if (hora < 18) atual = "tarde"

  blocos.forEach(function (bloco) {
    const secao = document.getElementById(bloco)
    if (secao) {
      secao.classList.toggle("agora", bloco === atual)
    }
  })
}

destacarAtual()
setInterval(destacarAtual, 60000)

const botaoNovoDia = document.getElementById("novo-dia")
if (botaoNovoDia) {
  botaoNovoDia.onclick = function () {
    blocos.forEach(function (bloco) {
      tarefas[bloco].forEach(function (tarefa) {
        tarefa.feita = false
      })
    })
    desenhar()
  }
}