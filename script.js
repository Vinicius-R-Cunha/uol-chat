
requestUpdate();
setInterval(requestUpdate,3000);
getParticipants();
setInterval(getParticipants,10000);

const body = document.querySelector('body');
const chat = document.querySelector(".main");

let namePicked;
const nameInputed = document.querySelector(".login-input");
const enterButton = document.querySelector(".enter");
const loading = document.querySelector(".loading");

function getName() {

    if (nameInputed.value !== "Todos") {
        namePicked = nameInputed.value;
    } else {
        userNotAvaiable();
    }
    const participants = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", {name: namePicked});

    // show loading gif
    nameInputed.classList.add("hidden");
    enterButton.classList.add("hidden");
    loading.classList.remove("hidden");
    
    participants.then(userAvaiable);
    participants.catch(userNotAvaiable);
}

nameInputed.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
     event.preventDefault();
     document.querySelector(".enter").click();
    }
})

function userAvaiable() {
    const loginScreen = document.querySelector('.login-screen');

    stillOnline();
    setInterval(stillOnline,5000);

    loginScreen.classList.add('hidden');
}

function userNotAvaiable() {
    nameInputed.value = "";
    nameInputed.placeholder = "Nome não disponível";

    nameInputed.classList.remove("hidden");
    enterButton.classList.remove("hidden");
    loading.classList.add("hidden");

    setTimeout(changePlaceholder,1500);
}

function changePlaceholder() {
    nameInputed.placeholder = "Digite seu nome";
}

function requestUpdate() {
    const messages = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    messages.then(messagesReceived);
}

function messagesReceived(answer) {
    
    let elementToScroll;
    
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
        } else if (namePicked === to || namePicked === from) {
            chat.innerHTML += `
            <div class="private">
                <p class="message" data-identifier="message"> <span class="time"> (${time}) </span> <strong> ${from} </strong> reservadamente para <strong class="margin-right"> ${to}: </strong> ${text} </p>
            </div>
            `
        }
    }    
    elementToScroll = document.querySelector('.main div:last-child');
    elementToScroll.scrollIntoView();
}

function confirmation() {
}

function stillOnline() {
    const status = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", {name: namePicked});
    status.then(confirmation);
}


let input = document.querySelector('.footer div input');
let nameSelected;

function sendMessage() {
    const text = input.value;
    let send;

    // if text is empty do nothing
    if (text === "") {
        return;
    }

    if (nameSelected === undefined || nameSelected ==="Todos") {
        send = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", {from: namePicked, to: 'Todos', text: text, type: "message"});
    } else {
        send = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", {from: namePicked, to: nameSelected, text: text, type: "private_message"});
    }
    
    send.then(requestUpdate);
    send.catch(() => window.location.reload());

    input.value = "";
}

input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
     event.preventDefault();
     document.querySelector(".send-button").click();
    }
})

const participantsTab = document.querySelector('.participants-tab');
const leftTransparent = document.querySelector('.left-transparent');

function openParticipantsTab() {
    // stop scroll
    body.classList.add('stop-scroll');
    chat.classList.add('stop-scroll');

    participantsTab.classList.add('participants-tab-show');
    setTimeout(removeTransparentDelay,140);
}

function removeTransparentDelay() {
    leftTransparent.classList.remove('transparent');
}

function closeParticipantsTab() {
    leftTransparent.classList.add('transparent');
    participantsTab.classList.remove('participants-tab-show');

    // bring scroll back
    body.classList.remove('stop-scroll');
    chat.classList.remove('stop-scroll');

}

function getParticipants() {
    const participantsList = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
    participantsList.then(displayParticipants);
}

const ionPublic = document.querySelector('.ion-public');
const ionPrivate = document.querySelector('.ion-private');
let checkUpName;

function displayParticipants(usersOnline) {
    const usersList = document.querySelector('.users');
    
    // ion-icon with check 
    let ionIcon = document.querySelector('.users div .show');

    if (ionIcon !== null) {
        checkUpName = ionIcon.parentNode.querySelector('p').innerHTML
    }
    
    usersList.innerHTML = '';
    
    if (checkUpName === "Todos") {
        usersList.innerHTML = `
        <div data-identifier="participant" onclick="selectParticipant(this)">
            <ion-icon name="people-sharp"></ion-icon>
            <p>Todos</p>
            <ion-icon class="check show" name="checkmark-sharp"></ion-icon>
        </div>
        `
    } else {
        usersList.innerHTML = `
        <div data-identifier="participant" onclick="selectParticipant(this)">
            <ion-icon name="people-sharp"></ion-icon>
            <p>Todos</p>
            <ion-icon class="check hidden" name="checkmark-sharp"></ion-icon>
        </div>
        `
    }
    
    for (let i = 0; i < usersOnline.data.length; i++) {
        
        if (checkUpName === usersOnline.data[i].name) {
            usersList.innerHTML += `
            <div data-identifier="participant" onclick="selectParticipant(this)">
                <ion-icon name="person-circle-sharp"></ion-icon>
                <p>${usersOnline.data[i].name}</p>
                <ion-icon class="check show" name="checkmark-sharp"></ion-icon>
            </div>
            `
        } else {
            usersList.innerHTML += `
            <div data-identifier="participant" onclick="selectParticipant(this)">
                <ion-icon name="person-circle-sharp"></ion-icon>
                <p>${usersOnline.data[i].name}</p>
                <ion-icon class="check hidden" name="checkmark-sharp"></ion-icon>
            </div>
            `
        }
    }

    // renew ion-icon, to use below
    ionIcon = document.querySelector('.users div .show');

    if (ionIcon === null) {
        ionPrivate.classList.add('hidden');
        ionPublic.classList.add('hidden');
    }
}

function selectParticipant(participant) {

    const check = participant.querySelector('.check');
    nameSelected = participant.querySelector('p').innerHTML;
    const ionIconShowing = document.querySelector('.users div .show');

    const inputDiv = document.querySelector('.footer div');

    if (check.classList.contains("show")) {
        return;
    } else if (nameSelected === "Todos") {

        if (ionIconShowing !== null) {
            ionIconShowing.classList.add('hidden');
            ionIconShowing.classList.remove('show');
        }
        
        // check the clicked one
        check.classList.add('show');
        check.classList.remove('hidden');

        ionPrivate.classList.add('hidden');
        ionPublic.classList.remove('hidden');

        // changes input
        inputDiv.classList.remove('send-private');
        inputDiv.classList.add('send-to-all');

        inputDiv.innerHTML = `
            <input type="text" placeholder="Escreva aqui...">
        `
    } else { 
        // removes check of last
        if (ionIconShowing !== null) {
            ionIconShowing.classList.add('hidden');
            ionIconShowing.classList.remove('show');
        }
        
        // check the clicked one
        check.classList.add('show');
        check.classList.remove('hidden');

        ionPublic.classList.add('hidden');
        ionPrivate.classList.remove('hidden');

        // changes input
        inputDiv.classList.remove('send-to-all');
        inputDiv.classList.add('send-private');

        inputDiv.innerHTML = `
            <input type="text" placeholder="Escreva aqui...">
            <div class="send-to"><p>Enviando para ${nameSelected} (reservadamente)</p></div>
        `
    }
    // update input every click
    input = document.querySelector('.footer div input');

    // update enter funcionality
    input.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
         event.preventDefault();
         document.querySelector(".send-button").click();
        }
    })
}



