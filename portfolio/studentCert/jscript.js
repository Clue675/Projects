// Declare any necessary variables.
var studentName = document.querySelector('#studentName')
var className = document.querySelector('#className')
var studentScores = document.querySelector('#studentScores')
var possibleScores = document.querySelector('#possibleScores')
var reset = document.querySelector('#reset')
var print = document.querySelector('#print')
var certStudentName = document.querySelector('#certStudentName')
var certClassName = document.querySelector('#certClassName')
var certGrade = document.querySelector('#certGrade')

let new_student
// Add am event listener that responds to the click of the "print" button by calling a function to instantiate
//  a new student object, and another function to print the certificate.
print.addEventListener("click",() => {
    new_student = newStudent()
    display()
})


// Add an event listener that responds to the click of the reset button by resetting all the values
// both in the form and in the certificate.
reset.addEventListener("click",() => {
    studentName.value = "",
    className.value = "",
    studentScores.value = "",
    possibleScores.value = "",
    certStudentName.value = "",
    certClassName.value = "",
    certGrade.value = ""
    
})


// Create a function that instantiates a new student object with the input from the HTML form.

function newStudent() {
    return new Student(
        studentName.value,
        className.value,
        makeArr(studentScores.value),
        makeArr(possibleScores.value)
    )
}

function display() {
    certStudentName.innerText = new_student.studentName
    certClassName.innerText = new_student.className
    certGrade.innerText = new_student.calcStudentGrade()
}

function makeArr(arr) {
    a = arr.split(",")
    return a.map((item) => Number(item))
}
// Create a function that fills in the student's name, class name, and calculated grade on the certificate .

// Create a function that converts the contents of a comma-separated text string to a numeric array.
// You can use this function when instantiating the arrays in the student object.