import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;
//AI loader
//This is going to render 3 dots one by one. Showing the AI is thinking of a solution.
function loader(element) {
  element.textContent += '';

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300);
}

//AI type text
function typeText(element, text) {
  let index = 0;
  //Index is going to get the character under a specific index in the text that the AI is going to return. 
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt[index];
      index++;
    } else{
      clearInterval(interval);
    }
  }, 20)
}

//AI timestamp
//This function below will generate a unique random ID
//Using time stamps is the most effective way.

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}


//AI and User stripe
//This will create different shades of stripes communicating between AI and user.
//Inside this function will render the value which is going to be that AI generated message.
function chatStripe (isAi, value, uniqueId) {
  return (
    `
    <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img
            src="${isAi ? bot : user}"
            alt="${isAi ? 'bot' : 'user'}"
          />
        </div>
        <div class="message" id=${uniqueId}>${value}</div>
      </div>
    </div>
    `
  )
}

//AI handler

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  //user's chat stripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  //AI chatstripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML == chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv); 

  //Fetch Data from the server => AI response

  const response = await fetch('http://localhost:5000', {
    method: 'POST',
    headers: {
      'Content=Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if(response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();

    // console.log({parsedData});

    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();

    messageDiv.innerHTML = "Something went wrong!";

    alert(err);
  }

}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
})
