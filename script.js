
requestUpdate();
setInterval(requestUpdate,3000)
//setInterval(requestUpdate,20000);

const chat = document.querySelector('.main');

let namePicked;

function getName() {
    namePicked = prompt("Digite o seu nick:");
    //namePicked = "jeremias";
    const participants = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", {name: namePicked});

    participants.then(userAvaiable);
    participants.catch(userNotAvaiable);
}

// Apagar isso depois
function userAvaiable() {
    console.log('NICK DISPONIVEL');
    stillOnline();
    setInterval(stillOnline,5000);
}

function userNotAvaiable() {
    alert('NICK NAO DISPONIVEL');
    getName();
}

getName();

function requestUpdate() {
    const messages = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    messages.then(messagesReceived);
}

function messagesReceived(answer) {
    
    console.log('mensagens carregadas');
    let elementoQueQueroQueApareca;
    
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
            console.log(namePicked);
            console.log(to);
            chat.innerHTML += `
            <div class="private">
                <p class="message" data-identifier="message"> <span class="time"> (${time}) </span> <strong> ${from} </strong> reservadamente para <strong class="margin-right"> ${to}: </strong> ${text} </p>
            </div>
            `
        }
        
        elementoQueQueroQueApareca = document.querySelector('.main div:last-child');
        elementoQueQueroQueApareca.scrollIntoView();
    }    
}

function confirmation() {
    console.log('online')
}

function stillOnline() {
    const status = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", {name: namePicked});
    status.then(confirmation);
}

const input = document.querySelector('.footer input');
console.dir(input);

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

    
    console.log('clicado');
}




























