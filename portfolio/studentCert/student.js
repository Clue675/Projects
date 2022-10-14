// Create a class called Student whose constructor maintains all four data inputs from the HTML page.
class Student {
    constructor(...args) {
        this.studentName = args[0],
        this.className = args[1],
        this.studentScores = args[2],
        this.possibleScores = args[3]
    }

    addStudentScores() {
        let studentTotalScore = this.studentScores.reduce((currentScore,score) => {
            return currentScore + score
        },0)
        return studentTotalScore
        

    }


    addPossibleScores() {
        let possibleTotalScores = this.possibleScores.reduce((currentScore,score) => {
            return currentScore + score
        },0)
        return possibleTotalScores

    }

    calcStudentGrade(){
        console.log('click')
        let gradeSum = this.addStudentScores() / this.addPossibleScores()
        if (Number(gradeSum) >= Number(0.9)){
            return "A"
        }
        if (Number(gradeSum) < Number(0.9) && Number(gradeSum) >= Number(0.8)){
            return "B"
        }
        if (Number(gradeSum) < Number(0.7) && Number(gradeSum) >= Number(0.6)){
            return "C"
        }
        if (Number(gradeSum) < Number(0.5) && Number(gradeSum) >= Number(0.4)){
            return "D"
        }else {
            return "F"
        }

    }

   


}
// The class should also contain the following methods:
// - a method that adds up all the student's scores
// - a method that adds up all the possible scores
// - a method that calculates the student's letter grade (divide the student's score by the possible scores and use the resulting decimal to determine grade)