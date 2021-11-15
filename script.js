
requestUpdate();
setInterval(requestUpdate,3000);
getParticipants();
setInterval(getParticipants,10000);

const chat = document.querySelector('.main');

let namePicked;

function getName() {
    do {
        namePicked = prompt("Digite o seu nick:");
    } while (namePicked === "Todos")

    const participants = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", {name: namePicked});

    // Apagar isso depois
    participants.then(userAvaiable);
    participants.catch(userNotAvaiable);
}

// Apagar isso depois
function userAvaiable() {
    console.log(namePicked);
    stillOnline();
    setInterval(stillOnline,5000);
}

function userNotAvaiable() {
    // Apagar isso depois
    alert('NICK NAO DISPONIVEL');

    getName();
}

getName();

function requestUpdate() {
    const messages = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    messages.then(messagesReceived);
}

function messagesReceived(answer) {
    
    // console.log('mensagens carregadas');
    let elementoQueQueroQueApareca;
    
    chat.innerHTML = "";
    for (let i = 0; i < answer.data.length; i++) {
        
        from = answer.data[i].from;
        to   = answer.data[i].to;
        text = answer.data[i].text;
        type = answer.data[i].type;
        time = answer.data[i].time;

        if (type === 'status') {
            chat.innerHTML += `
            <div class="in-out">
                <p class="message"  data-identifier="message"> <span class="time"> (${time}) </span> <strong class="margin-right"> ${from} </strong> ${text} </p>
            </div>
            `
        } else if (to === 'Todos') {
            chat.innerHTML += `
            <div class="everyone">
                <p class="message" data-identifier="message"> <span class="time"> (${time}) </span> <strong> ${from} </strong> para <strong class="margin-right"> ${to}: </strong> ${text} </p>
            </div>
            `
        } else if (namePicked === to) {
            // console.log(namePicked);
            // console.log(to);
            chat.innerHTML += `
            <div class="private">
                <p class="message" data-identifier="message"> <span class="time"> (${time}) </span> <strong> ${from} </strong> reservadamente para <strong class="margin-right"> ${to}: </strong> ${text} </p>
            </div>
            `
        }
    }    
    elementoQueQueroQueApareca = document.querySelector('.main div:last-child');
    elementoQueQueroQueApareca.scrollIntoView();
}

function confirmation() {
    // console.log('online')
}

function stillOnline() {
    const status = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", {name: namePicked});
    status.then(confirmation);
}

const input = document.querySelector('.footer input');

function sendMessage() {
    const text = input.value;

    // se for vazio nem faz nada na funcao
    if (text === "") {
        return;
    }

    const send = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", {from: namePicked, to: 'Todos', text: text, type: "message"});

    send.then(requestUpdate);
    send.catch(() => window.location.reload());

    input.value = "";

    // console.log('clicado');
}

input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
     event.preventDefault();
     document.querySelector(".send-button").click();
    }
})

const body = document.querySelector('body')
const participantsTab = document.querySelector('.participants-tab');

function openParticipantsTab() {
    // faz o scroll parar
    body.classList.add('stop-scroll');
    chat.classList.add('stop-scroll');

    participantsTab.classList.remove('hidden');
    participantsTab.classList.add('show');
}

function closeParticipantsTab() {
    // faz o scroll voltar
    body.classList.remove('stop-scroll');
    chat.classList.remove('stop-scroll');

    participantsTab.classList.add('hidden');
    participantsTab.classList.remove('show');
}

function getParticipants() {
    // console.log('participantes atualizados')

    const participantsList = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
    participantsList.then(displayParticipants);
}

let checkUpName;

function displayParticipants(usersOnline) {
    const usersList = document.querySelector('.users');

    // ion-icon que tem o check 
    const ionIcon = document.querySelector('.users div .show')
    
    if (ionIcon !== null) {
        checkUpName = ionIcon.parentNode.querySelector('p').innerHTML
    }
    
    usersList.innerHTML = '';
    
    if (checkUpName === "Todos") {
        usersList.innerHTML = `
        <div onclick="selectParticipant(this)">
        <ion-icon name="people-sharp"></ion-icon>
        <p>Todos</p>
        <ion-icon class="check show" name="checkmark-sharp"></ion-icon>
        </div>
        `
    } else {
        usersList.innerHTML = `
        <div onclick="selectParticipant(this)">
        <ion-icon name="people-sharp"></ion-icon>
        <p>Todos</p>
        <ion-icon class="check hidden" name="checkmark-sharp"></ion-icon>
        </div>
        `
    }
    
    for (let i = 0; i < usersOnline.data.length; i++) {
        
        if (checkUpName === usersOnline.data[i].name) {
            usersList.innerHTML += `
            <div onclick="selectParticipant(this)">
            <ion-icon name="person-circle-sharp"></ion-icon>
            <p>${usersOnline.data[i].name}</p>
            <ion-icon class="check show" name="checkmark-sharp"></ion-icon>
            </div>
            `
        } else {
            usersList.innerHTML += `
            <div onclick="selectParticipant(this)">
            <ion-icon name="person-circle-sharp"></ion-icon>
            <p>${usersOnline.data[i].name}</p>
            <ion-icon class="check hidden" name="checkmark-sharp"></ion-icon>
            </div>
            `
        }
    }
    
}

function selectParticipant(participant) {
    // console.log('clicou num mano ai');
    const check = participant.querySelector('.check');
    
    
    if (check.classList.contains("show")) {
        return;
    } else { 
        // tira o check do que estiver
        if (document.querySelector('.users div .show') !== null) {
            document.querySelector('.users div .show').classList.add('hidden');
            document.querySelector('.users div .show').classList.remove('show');
        }
        
        // coloca o check no que foi clicado
        check.classList.add('show');
        check.classList.remove('hidden');
    }
}








