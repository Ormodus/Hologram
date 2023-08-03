
import { create, byId } from 'Document'
// import { driver, session } from 'Neo4j'


let recognition, currentTopic;
const { random, floor } = Math;

const italianKeywords = [
    ['intro'],
    ['matematica', 'scienza', 'fibonacci'],
    // ['università', 'napoli', 'studio', 'lezione'],
    ['corte', 'possedimenti', 'personaggi'],
    ['lingue', 'culture', 'testi', 'traduzioni', 'arabo'],
    ['medico', 'medicina', 'scuola medica salernitana', 'dottori', 'chirurgia'],
    ['nascita', 'nato', 'stupor Mundi', 'missione'],
    ['arte', 'poesia', 'poeti', 'scuola', 'siciliana', 'letterati', 'volgare']
]

const italianVideos = [
    "Videos/Intro.mp4",
    "Videos/Matematica.mp4",
    // "Videos/Studio.mp4",
    "Videos/Corte.mp4",
    "Videos/Traduzioni.mp4",
    "Videos/Medicina.mp4",
    "Videos/Nascita.mp4",
    "Videos/Poesia.mp4",
]

const italianContents = [
    "Contents/Intro.txt",
    "Contents/Matematica.txt",
    // "Contents/Studio.txt",
    "Contents/Corte.txt",
    "Contents/Traduzioni.txt",
    "Contents/Medicina.txt",
    "Contents/Nascita.txt",
    "Contents/Poesia.txt"
]

const repeatKeywords = [
    "ripeti", "ancora", "ricomincia", "nuovo", "repeat"
]

const randomInt = (minimum, maximum) =>
floor(random() * (maximum - minimum + 1) + minimum);

const sleep = (millis) =>
new Promise((resolve) => setTimeout(resolve, millis));

const inputField = byId("text-input");
const mic = byId("mic");
const micWrapper = byId("mic-wrapper");
const videoPlayer = byId("video-player");
const clearButton = byId("clear");
const chatContainer = byId("chat");
const sendButton = byId("send-button");
const noAnswer = "Non posso fornire informazioni in merito ;')";
const greeting = "Ciao, sono Federico II e ti aiuterò in questo percorso"
const lettersRegex = /[a-zA-Z]+/g;

if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window){
    recognition =  new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "it-IT";
    recognition.continuous = true;
}
else {
    recognition = none;
}

let isMouseDown = false;

mic.addEventListener("mousedown", () => {
    if (recognition){
        recognition.start();
    }
    isMouseDown = true;
    micWrapper.style.backgroundColor = "#e9483f";
});

document.addEventListener("mouseup", () => {
    if (isMouseDown) {  
        if (recognition){
            recognition.stop();
        }
        isMouseDown = false;
        micWrapper.style.backgroundColor = "";
        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript;
            if (/\s/g.test(inputField.value[-1])){
                inputField.value += " ";
            }
            inputField.value += transcript + " ";
            
        };
    }
});


// Typing animation
function typingMessage(container, message, timeout) {
    const newMessageDiv = create("div");
    newMessageDiv.classList.add("out");
    container.appendChild(newMessageDiv);
    
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
        newMessageDiv.textContent = message.slice(0, currentIndex++);
        if (newMessageDiv.scrollHeight > newMessageDiv.clientHeight) {
            newMessageDiv.style.height = newMessageDiv.scrollHeight + "px";
        }

        if (currentIndex > message.length) {
            clearInterval(typingInterval);
            container.scrollTop = container.scrollHeight;
        }
        }, timeout);
}


// Submit input
function submitInput() {
    const messageContent = inputField.value.trim();
    let answerProvided = false;
    if (messageContent !== "") {
        inputField.value = "";
        typingMessage(chatContainer, messageContent, 20);
        messageContent.split(' ').forEach(word => {
            word = word.match(lettersRegex)?.[0]?.toLowerCase();
            if (word){
                if (repeatKeywords.includes(word)){
                    videoPlayer.currentTime = 0;
                    videoPlayer.play();
                    answerProvided = true;
                    typingMessage(chatContainer, currentTopic, 50);
                    return;
                }
                for (let index = 0; index < italianKeywords.length; index++) {
                    if (italianKeywords[index].includes(word)){
                        videoPlayer.src = italianVideos[index];
                        fetch(italianContents[index])
                            .then((res) => res.text())
                            .then((text) => {
                                currentTopic = text;
                                typingMessage(chatContainer, currentTopic, 50);
                            })
                            .catch((e) => console.error(e));
                        answerProvided = true;
                        return;
                    }
                }
            }
        });
        if (!answerProvided){
            typingMessage(chatContainer, noAnswer, 30);
        }
    }
}

// Chat
document.addEventListener("DOMContentLoaded", () => {
    inputField.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            submitInput();
        }
    });
})

document.addEventListener("DOMContentLoaded", () => {  
    sendButton.addEventListener("click", () => {
        submitInput();
    });
})

// Clear content
document.addEventListener("DOMContentLoaded", () => {
    clearButton.addEventListener("click", () => {
        chatContainer.innerHTML = "";
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
        typingMessage(chatContainer, greeting, 10);
    });
});