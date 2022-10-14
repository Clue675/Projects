var container = document.querySelector('#container')
var container2 = document.querySelector('#container2')

const getData = async() => {
  const pokemon = await axios.get("https://pokeapi.co/api/v2/pokemon/")
  const pokemonData = pokemon.data.results
  const pending1 = []
  for(i=0; i < pokemonData.length; i++) {
    pending1.push(pokemonData[i])
  }
  Promise.all(pending1)
  .then (console.log(pending1))
  .then (showData(pending1))
  .catch(err => console.log(err))
}
getData()

//create a h1 or span and set it to inertext to the pokemons name 
//MAke a function called getTodos = same thing as the getData function but will make a get get request to the BYU API, (Make different getData function) then make a showData but will be for Todos. 
//Then show your todos insides container 2 (Name and description + edit button and delete button)
function showData(data) {
  console.log(data);
  for(i=0; i < data.length; i++) {
    var newDiv = document.createElement('div')
    newDiv.style.border = '1px solid black'
    container.appendChild(newDiv)
    var h1Text = document.createElement("h1")
    h1Text.innerText = data[i].name
    newDiv.appendChild(h1Text)
    var addBtn = document.createElement('button')
    addBtn.innerHTML = "Add Pokemon"
    newDiv.appendChild(addBtn)
    save(addBtn,h1Text)
  }
}

function save(addBtn,h1Text){
  var newPost = {
    name: h1Text.innerText,
    description: "Gotta Catch'em all", isComplete: false
  }
  addBtn.addEventListener('click', () => {
    console.log('Click')
    axios.post('http://api.bryanuniversity.edu/cedrickwilliams/list/', newPost)
    .then (response => {
      addBtn.innerText = "Pokemon Successfully Caught!"
      console.log(response)
    })
    .catch (err => console.log(err))
  })
}
