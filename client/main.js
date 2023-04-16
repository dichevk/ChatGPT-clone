import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const gptContainer = document.querySelector("#gpt_container");

let loadInterval;

function loader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ".";
    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    }
    else{
      clearInterval(interval);
    }
  }, 20);
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return (
    `
    <div class="wrapper ${isAi && "ai"}">
    <div class="chat">
    <div class="profile">
    <img src = "${isAi ? bot : user}"/>
    </div>
    <div className="message" id=${uniqueId}>${value}</div>
    </div>
    </div> 
  `
  )
}

const handleSubmit = async(e) => {
  e.preventDefault();//avoid reloading the browser after submitting a form which is the default action 

  const data = new FormData(form);

  gptContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset(); //clear the input text

  const uniqueId = generateUniqueId(); 

  gptContainer.innerHTML += chatStripe(true, " ", uniqueId);

  gptContainer.scrollTop = gptContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId); 

  loader(messageDiv); 

  const response = await fetch('http://localhost:5000',{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })
  clearInterval(loadInterval);
  messageDiv.innerHTML = '';
  if (response.ok){
    const data = await response.json();
    const parsedData = data.bot.trim();

    typeText(messageDiv, parsedData);
  }
  else{
    const errorData = response.text();
    messageDiv.innerHTML=errorData;
    alert(errorData);
  }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup',(e)=>{
  if(e.keyCode===13){
    handleSubmit(e);
  }
});
