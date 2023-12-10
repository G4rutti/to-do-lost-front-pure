'use strict'

const nome = document.getElementById("nome")
const descricao = document.getElementById("descricao")
const atividades = document.getElementById("atividade")


const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

function clearFields() {
    document.getElementById('nome').value = '';
    document.getElementById('descricao').value = '';
}



async function get() {
    const APIResponse = await fetch('https://to-do-list-mongo-db-g4rutti.vercel.app/')
    if (APIResponse.status === 200) {
        const data = await APIResponse.json()
        atividades.innerHTML = ""
        data.forEach(element => {
            const divPrincipal = document.createElement("div")
            divPrincipal.id = `id='${element.nome}'`
            if(element.feito == "n"){
                divPrincipal.classList.remove('form-control-feito')
                divPrincipal.classList.add('form-control')
            }else{
                divPrincipal.classList.remove('form-control')
                divPrincipal.classList.add('form-control-feito')
            }
            atividades.appendChild(divPrincipal)

            divPrincipal.innerHTML += `
                <p class="title">${element.nome}</p>
                <p>${element.descricao}</p>
                <div class="actions" id="id-${element.nome}">
                    <button id="editar" onclick="abrirModalComDados('${element.nome}','${element.descricao}')">Editar</button>
                    <button id="excluir" onclick="deleteByName('${element.nome}')">Excluir</button>
                </div>
            `
            if (element.feito == "n") {
                const feitoButton = document.createElement('button')
                feitoButton.id = 'feito'
                feitoButton.onclick = () => updateDidOrNot(element.nome, element.descricao)
                feitoButton.innerText = 'Feito'
            
                document.getElementById(`id-${element.nome}`).appendChild(feitoButton)
            } else {
                const desfeitoButton = document.createElement('button')
                desfeitoButton.id = 'concluido'
                desfeitoButton.onclick = () => updateDidOrNot(element.nome, element.descricao)
                desfeitoButton.innerText = 'Desfeito'
            
                document.getElementById(`id-${element.nome}`).appendChild(desfeitoButton)
            }
        })
    }
}

async function post(){
    console.log(nome)
    data = {
        nome : nome.value,
        descricao : descricao.value,
        feito : "n"
    }

    try{
        const APIResponse = await fetch('https://to-do-list-mongo-db-g4rutti.vercel.app/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })

        const result = await APIResponse.json()
        console.log("Success:", result)

    }catch (error) {
        console.error("Error:", error)
    }
    await get()
    window.location.reload()
}

async function deleteByName(nome){
    try{
        const APIResponse = await fetch(`https://to-do-list-mongo-db-g4rutti.vercel.app/${nome}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })

        const result = await APIResponse.json()
        console.log("Success:", result)

    }catch (error) {
        console.error("Error:", error)
    }
    await get()
    window.location.reload()
}

async function updateDidOrNot(nome,descricao){
    let data = ''
    const feitoOuNao = await getByName(nome)
    if(feitoOuNao.feito == 'n'){
        data = {
            nome : nome,
            descricao : descricao,
            feito : "s"
        }
    }else{
        data = {
            nome : nome,
            descricao : descricao,
            feito : "n"
        }
    }

    try{
        const APIResponse = await fetch(`https://to-do-list-mongo-db-g4rutti.vercel.app/${data.nome}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })

        const result = await APIResponse.json()
        console.log("Success:", result)

    }catch (error) {
        console.error("Error:", error)
    }
    await get()
    window.location.reload()
}

async function updateThings(){
    const data = {
        nome : document.getElementById("nomeModal").value,
        descricao : document.getElementById("descricaoModal").value,
        feito : "n"
    }
    try{
        const APIResponse = await fetch(`https://to-do-list-mongo-db-g4rutti.vercel.app/${document.getElementById("nomeModal2").value}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })

        const result = await APIResponse.json()
        console.log("Success:", result)

    }catch (error) {
        console.error("Error:", error)
    }
    await get()
    window.location.reload()
}

async function getByName(nome){
    const APIResponse = await fetch(`https://to-do-list-mongo-db-g4rutti.vercel.app/${nome}`)
    if (APIResponse.status === 200){
        const data = await APIResponse.json()
        return data
    }
}

async function abrirModalComDados(nome, descricao){
    openModal()
    document.getElementById("nomeModal2").value = nome
    document.getElementById("nomeModal").value = nome
    document.getElementById("descricaoModal").value = descricao
}



get()

document.getElementById("salvar").addEventListener("click", updateThings)
document.getElementById('enviar').addEventListener("click", post)
document.getElementById('modalClose').addEventListener('click', closeModal)


