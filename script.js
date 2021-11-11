requestUpdate();
// setInterval(requestUpdate,3000)

const chat = document.querySelector('.main');

function enteringRoom() {
    // const nome = prompt('Digite seu nick');
    const nome = 'jeremias'; 


    const participants = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants")

    participants.then(checkUser);
}

enteringRoom();


function checkUser(answer) {
    console.log(answer);
}












function requestUpdate() {
    const messages = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    messages.then(messagesReceived);
}

function messagesReceived(answer) {

    let elementoQueQueroQueApareca;
    
    for (let i = 0; i < answer.data.length; i++) {
        
        from = answer.data[i].from;
        to   = answer.data[i].to;
        text = answer.data[i].text;
        type = answer.data[i].type;
        time = answer.data[i].time;
        // console.log(elementoQueQueroQueApareca)

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
        } else {
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































