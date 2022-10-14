var to_do = document.getElementById('to-do')
var des = document.getElementById('des')
var add_todo = document.getElementById('add_todo')
var container = document.getElementById('container')
var count_div = document.getElementById('count_div')

//Later will be used to toggle the edit feature on and off
editToggle = false

//Gets data from API and passes the dat to our showData()
function getTodos(){
  axios.get("http://api.bryanuniversity.edu/cedrickwilliams/list/")
  .then(response =>{
    console.log('got todos')
    showData(response.data)
    
  })
  .catch(error => console.log(error))
  
}
//Calling getData()
getTodos()

//The showData function show's the Data the way I like it.
function showData(data){
  //This counter adds up our todos that are set to false. Now we can show the user how many "Open" cases they have.
  var counter = 0
  container.innerHTML = ''
  
  data.forEach((todo) =>{
    if(todo.isComplete === false){
      counter += 1
    }

  var h3 = document.createElement('h3')
  
  //The header boolean is used to make sure our username only prints once.
  header = false
  if(header === false){
  var first = todo.user.slice(1,7)
  var fir_letter =todo.user.charAt(0).toUpperCase()
  var last = todo.user.slice(8,19)
  var last_letter = todo.user.charAt(7).toUpperCase()
  container.appendChild(h3)
  h3.innerHTML = `User: ${fir_letter}${first} ${last_letter}${last}`
}
header = true
count_div.innerHTML = `${counter}`

  var todo_div = document.createElement('div')
  var complete = document.createElement('h5')
  var date = document.createElement('h6')
  var new_date = todo.createdAt.slice(0,10)
  var update_date = document.createElement('h6')
  var new_update = todo.updatedAt.slice(0,10)
  var done = document.createElement('input')
  done.setAttribute("type", "checkbox")
  var del = document.createElement('button')
  
  //This is how we toggle the edit on and off
  if(editToggle === false){
    var todo_text = document.createElement('h5')
    var description = document.createElement('h5')
    todo_div.appendChild(todo_text)
    todo_div.appendChild(description)
    todo_text.innerHTML = `Todo: ${todo.name}`
    description.innerHTML = `Description: ${todo.description}`
    complete.innerHTML = `Complete ${todo.isComplete}`
    date.innerHTML = `Date ${new_date}`
    update_date.innerHTML = `Updated: ${new_update}`
    var edit = document.createElement('button')
    edit.style.color = 'green'
    edit.style.display = 'block'
    edit.innerHTML = 'EDIT'
    todo_div.appendChild(edit)
  }
  if(editToggle === true){
    var todo_text = document.createElement('input')
    var description = document.createElement('input')
    todo_div.appendChild(todo_text)
    todo_div.appendChild(description)
    todo_text.value = todo.name
    description.value = todo.description
    complete.innerHTML = `Complete ${todo.isComplete}`
    date.innerHTML = `Date ${new_date}`
    var edit = document.createElement('button')
    edit.style.color = 'green'
    edit.style.display = 'block'
    edit.innerHTML = 'SAVE'
    todo_div.appendChild(edit)
    todo_div.style.backgroundColor ='red'
    
  }
  //Crosses out our isComplete Boolean
  if(todo.isComplete === true){
    complete.style.textDecoration = 'line-through'
    todo_div.style.backgroundColor = 'grey'
  } 
  if(todo.isComplete === false){
    complete.style.textDecoration = 'none'
    todo_div.style.backgroundColor = 'white'
  } 
  //Our put request attached to our button to update our todo.isComplete to true or false
  done.addEventListener('change', ()=>{
    console.log('test')
     if(todo.isComplete === false){
       axios.put(`http://api.bryanuniversity.edu/cedrickwilliams/list/${todo._id}`, {"isComplete": true})
       .then(()=>{
        setTimeout(window.location.reload(), 1000)
      })
       
     }
     if(todo.isComplete === true){
       axios.put(`http://api.bryanuniversity.edu/cedrickwilliams/list/${todo._id}`, {"isComplete": false})
       .then(()=>{
        setTimeout(window.location.reload(), 1000)
      })
     }
  })
  //Style function just cuts down on the lines of code in our showData()
  style(done,todo_div, del,container, complete, date, update_date)
  //Our delete function
  delete_todo(del, todo._id, todo_div, container, h3)
  //Our complete todo function
  complete_todo(done, todo._id, todo.isComplete)
  //Our edit todo function
  editTodo(edit, data, todo_text, description, todo._id)
})



}
    
function editTodo(edit, data,todo_text, description,id){

  edit.addEventListener('click', ()=>{
    if(editToggle === false){
      editToggle = !editToggle 
      getTodos()
      showData(data)
    }
    else if(editToggle === true){
      console.log(todo_text.value)
      axios.put(`http://api.bryanuniversity.edu/cedrickwilliams/list/${id}`, {'name': todo_text.value, 'description': description.value, 'isComplete': false})
      .then(()=>{
        setTimeout(window.location.reload(), 1000)
      })
    }
  })
}
function style(done,todo_div, del, container, complete, date, update_date){
  
  complete.style.display = 'inline'
  todo_div.appendChild(complete)
  todo_div.appendChild(done)

  todo_div.appendChild(date)
  todo_div.appendChild(update_date)

  todo_div.style.border = '1px solid black'
  todo_div.style.width = '160px'
  container.appendChild(todo_div)

  del.style.color = 'red'
  del.innerHTML = 'DELETE'
  todo_div.appendChild(del)
}

function delete_todo(del, id){
del.addEventListener('click',()=>{
  axios.delete(`http://api.bryanuniversity.edu/cedrickwilliams/list/${id}`)
  .then((res) =>{
    console.log(res);
    setTimeout(window.location.reload(), 1000)
  })
 })
}
function complete_todo(done, id, complete){
done.addEventListener('change', ()=>{
 if(this.checked){
  console.log('test')
  if(complete === false){
    axios.put(`http://api.bryanuniversity.edu/cedrickwilliams/list/${id}`, {"isComplete": true})
    getTodos()
    
  }
  if(complete === true){
    axios.put(`http://api.bryanuniversity.edu/cedrickwilliams/list/${id}`, {"isComplete": false})
    getTodos()
  }
 }
})

}

