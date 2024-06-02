const express = require("express");
const router = express.Router();
const handleError = require("../../utils/errorHandler");
const Student = require("../../models/Student");
const Teacher = require("../../models/Teacher");
const Class = require("../../models/Class");
const Grade = require("../../models/Grade");
const Subject = require("../../models/Subject");
const ObjectId = require("mongodb").ObjectId;

//POST - adding something new to the database / fetch something from the database
// PUT - updating a current existing document with new key/values
// GET - fetching data from the database
// DELETE - deleting a tiktok video from your profile

// req ---> request
// req.body ---> json object
// res ---> response

// api that adds a restaurant to the database
// you can see all of the restaurants that you have added in postman through mongodb -> database -> browse collections



// api that registers a new student in the database
// POST http://localhost:4002/v1/studentGradingPortal/students
router.post("/students", async (req, res) => {
  try {
    const studentName = req.body.name;
    const existingStudent = await Student.findOne({name : studentName}); // goes into the database and reports back whether there is an existing student with the same name. if there is, the database won't accept the post request
    if (existingStudent) {
      return res.status(400).json({message: "A student under this name has already been registered."}); // 400 status code means user error
    }
    const newStudent = new Student(req.body); // creates a new document
    newStudent.save().catch(err => console.log(err)); // saves document to the mongodb database
    return res.status(200).json(newStudent); // 200 status code means success
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
})



// api that registers a new teacher in the database
// POST http://localhost:4002/v1/studentGradingPortal/teachers
router.post("/teachers", async (req, res) => {
  try {
    const teacherName = req.body.name;
    const existingTeacher = await Teacher.findOne({name : teacherName});
    if (existingTeacher) {
      return res.status(400).json({message: "A teacher under this name has already been registered."});
    }
    const newTeacher = new Teacher(req.body);
    newTeacher.save().catch(err => console.log(err));
    return res.status(200).json(newTeacher);
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
})


// api that registers a new class in the database
// POST http://localhost:4002/v1/studentGradingPortal/class
router.post("/class", async (req, res) => {
  try {
    const newClass = new Class(req.body);
    newClass.save().catch(err => console.log(err));
    return res.status(200).json(newClass);
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
})



// api that registers a new subject in the database
// POST http://localhost:4002/v1/studentGradingPortal/subject
router.post("/subject", async (req, res) => {
  try {
    const subjectName = req.body.name;
    const existingSubject = await Subject.findOne({name : subjectName});
    if (existingSubject) {
      return res.status(400).json({message: "A subject under this name has already been registered."});
    }
    const newSubject = new Subject(req.body);
    newSubject.save().catch(err => console.log(err));
    return res.status(200).json(newSubject);
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
})


// adds a new grade for a student
// POST http://localhost:4002/v1/studentGradingPortal/grades
router.post("/grades", async (req, res) => {
  try {
    const newGrade = new Grade(req.body);
    newGrade.save().catch(err => console.log(err));
    return res.status(200).json(newGrade);
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
})


// updates a specific grade record
// PUT http://localhost:4002/v1/studentGradingPortal/grades/6652b08e0ff0574e59b25213             (gradeId of Sam Bajwa)
router.put("/grades/:gradeId", async (req, res) => {
  try {
    const gradeId = req.params.gradeId;
    
    // learned this function through chatgpt, as I tried this code, but it didn't work: Grade.findById(gradeId).select('grade') = req.grade;
    // code below does not return n updated document unless you add in the {new: true} according to chat gpt
    const updatedGradeDocument = await Grade.findByIdAndUpdate(gradeId, {'grade': req.body.grade}, {new: true});

    updatedGradeDocument.save().catch(err => console.log(err));
    return res.status(200).json(updatedGradeDocument);
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
})


// gets all the grades a student has
//GET http://localhost:4002/v1/studentGradingPortal/students/6652abcc8d70a0579cff5f41/grades     (studentId of Anika Prakash)
router.get("/students/:studentId/grades", async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const existingStudent = await Student.findById(studentId);
    if (!existingStudent) {
      return res.status(404).json({message: "This student can not be found."});
    }
    const studentGrades = await Grade.find({student_id : {$eq : studentId}}).select('grade');
    return res.status(200).json(studentGrades);
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
})



// lists all classes taught by a teacher
// GET http://localhost:4002/v1/studentGradingPortal/teachers/6652a5caaabc12acbabd2c6d/classes
router.get("/teachers/:teacherId/classes", async (req, res) => {
  try {
    const teacherId = req.params.teacherId;
    const existingTeacher = await Teacher.findById(teacherId);
    if (!existingTeacher) {
      return res.status(404).json({message: "This teacher can not be found."});
    }
    const teacherClasses = await Class.find({teacher_id : {$eq : teacherId}});
    return res.status(200).json(teacherClasses);
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
})



// enrolls students in a class
// PUT http://localhost:4002/v1/studentGradingPortal/classes/6652a75c8d70a0579cff5f1c/enroll (rowing, sem2, yr2024)
router.put("/classes/:classId/enroll", async (req, res) => {
  try {
    const classId = req.params.classId;
    const existingClass = await Class.findById(classId);
    if (!existingClass) {
      return res.status(404).json({message: "This class can not be found."})
    }

    // CHECK IF EACH STUDENT EXISTS INDIVIDUALLY
    let updatedStudentDocumentsList = [];
    for (const i in req.body.student_ids) {
      const studentId = req.body.student_ids[i];
      const existingStudent = await Student.findById(studentId);
      if (!existingStudent) {
        return res.status(404).json({message: `Student #${i} in the list does not exist.`});
      }
      // adds the students to the class by name (not id), if they have not been added already
      if (!existingClass.student_ids.includes(existingStudent.name)) {
        existingClass.student_ids.push(existingStudent.name);
      }
      // make sure you pass in ALL of the class info for the student document, not just the class id
      const updatedStudentDocument = await Student.findByIdAndUpdate(req.body.student_ids, {'class_enrollment_history': existingStudent.class_enrollment_history.concat({'class_id': classId, 'semester': existingClass.semester, 'year': existingClass.year})}, {new: true});
      updatedStudentDocument.save().catch(err => console.log(err));
      updatedStudentDocumentsList.push(updatedStudentDocument);
    }
    const updatedClassDocument = await Class.findByIdAndUpdate(classId, existingClass, {new: true});
    updatedClassDocument.save().catch(err => console.log(err));
    return res.status(200).json({updatedClassDocument, updatedStudentDocumentsList});
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
})



// drops a student from a class
// http://localhost:4002/v1/studentGradingPortal/classes/6652a75c8d70a0579cff5f1c/drop (rowing, sem2, yr2024)
router.delete("/classes/:classId/drop", async(req, res) => {
  try {
    // check if class exists
    const classId = req.params.classId;
    const existingClass = await Class.findById(classId);
    if (!existingClass) {
      return res.status(404).json({message: "This class could not be found in the database."});
    }
    //check if student exists
    const studentId = req.body.student_id;
    const existingStudent = await Student.findById(studentId);
    if (!existingStudent) {
      return res.status(404).json({message: "This student could not be found in the database."});
    }

    // remove student from class
    const studentIndex = existingClass.student_ids.indexOf(existingStudent.name);
    if (studentIndex > -1) {
      existingClass.student_ids.splice(studentIndex, 1);
      existingClass.save().catch(err => console.log(err));
    }

    // mark that the student did not complete the class
    // i was unsure about how to do this because i did not know how to edit an object in the Student.class_enrollment_history field when the only identification for the target object is the classId (which is stored INSIDE the object itself). chatgpt suggested this code:
    await Student.updateOne(
      { _id: studentId, 'class_enrollment_history.class_id': classId },
      { $set: { 'class_enrollment_history.$.completed': false } }
    );

    return res.status(200).json({message: "The student was successfully dropped from the class, and the class was marked incomplete in the student's record.", existingClass})
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
})




// gets all the grades for a class
// GET http://localhost:4002/v1/studentGradingPortal/grades/class/6652a9648d70a0579cff5f3e  // english, sem2, yr2025
router.get("/grades/class/:classId", async(req, res) => {
  try {
    const classId = req.params.classId;
    const existingClass = await Class.findById(classId);
    if (!existingClass) {
      res.status(404).json({message: "The class does not exist in the database"});
    }
    const gradesList = await Grade.find({class_id : {$eq : classId}});
    return res.status(200).json({gradesList});
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
})




// calculates the GPA for a specific semester
// GET http://localhost:4002/v1/studentGradingPortal/students/6652abcc8d70a0579cff5f41/gpa/2/2025 // Anika, sem2, yr2025
router.get("/students/:studentId/gpa/:semester/:year", async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const existingStudent = await Student.findById(studentId);
    if (!existingStudent) {
      return res.status(404).json({message: "This student can not be found."});
    }
    const semester = req.params.semester;
    const year = req.params.year;
    const studentGrades = await Grade.find({
      student_id : studentId,
      semester : semester,
      year : year
    }).select('grade');
    let gradePointSum = 0;
    for (let i in studentGrades) {
      gradePointSum += gradeToNumericEquivalent(studentGrades[i].grade);
    }
    const gpa = gradePointSum/studentGrades.length;
    return res.status(200).json({gpa});
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
})





// calculates the cumulative GPA across all semesters
router.get("/students/:studentId/gpa", async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const existingStudent = await Student.findById(studentId);
    if (!existingStudent) {
      return res.status(404).json({message: "This student can not be found."});
    }
    const studentGrades = await Grade.find({student_id : {$eq : studentId}}).select('grade');
    let gradePointSum = 0;
    for (let i in studentGrades) {
      gradePointSum += gradeToNumericEquivalent(studentGrades[i].grade);
    }
    const gpa = gradePointSum/studentGrades.length;
    return res.status(200).json({gpa});
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
})

function gradeToNumericEquivalent (grade) {
  if (grade == "A+")
    return 4.3;
  if (grade == "A")
    return 4;
  if (grade == "A-")
    return 3.7;
  if (grade == "B+")
    return 3.3;
  if (grade == "B")
    return 3;
  if (grade == "B-")
    return 2.7;
  if (grade == "C+")
    return 2.3;
  if (grade == "C")
    return 2;
  if (grade == "C-")
    return 1.7;
  if (grade == "D+")
    return 1.3;
  if (grade == "D")
    return 1;
  return 0;
}

module.exports = router;