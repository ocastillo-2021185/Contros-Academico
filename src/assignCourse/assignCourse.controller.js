'use strint'

import AssingCourse from './assignCourse.model.js'
import User from '../user/user.model.js';
import Course from '../course/course.model.js'
//------------------------------------------------------------------------------------------------------------
export const assignCourse = async (req, res) => {
    try {
        const { studentId, courseId } = req.body;
        // Verify if the student exist
        const student = await User.findById(studentId);
        if (!student) {
            return res.status(404).send({ message: 'Student not found' });
        }
        // Verify if course exist
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).send({ message: 'Course not found' });
        }
        //Verify if the studet is already assigned in the course
        const existingAssignment = await AssingCourse.findOne({ student: studentId, course: courseId });
        if (existingAssignment) {
            return res.status(400).send({ message: 'The student is already assigned to this course' });
        }
        //Verify if the studet is already assigned in 3 courses
        const assignedCoursesCount = await AssingCourse.countDocuments({ student: studentId });
        if (assignedCoursesCount >= 3) {
            return res.status(400).send({ message: 'You have already been assigned to 3 courses' });
        }
        //Create and save the assignation of the course
        const newAssignment = new AssingCourse({ student: studentId, course: courseId });
        await newAssignment.save();
        return res.send({ message: `Correctly assigned to the course` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Not assigned correctly to the course', err: err });
    }
}
//------------------------------------------------------------------------------------------------------------
export const findCourseStudent = async (req, res) => {
    try {
        const { username } = req.body;
        //Search the ID of the student by his username
        const student = await User.findOne({ username });
        if (!student) return res.status(404).send({ message: 'Student not found' });
        // Buscar cursos en los que el estudiante está asignado  Search courses in those that the student is assigned
        const courses = await AssingCourse.find({ student: student._id }).populate('course', ['name', 'description', 'price', 'duration', 'teacher']);
        //Validate the answer
        if (!courses.length) return res.status(404).send({ message: 'The courses were not found' });
        //Respond is everything is OK
        return res.send({ message: 'The courses were found', courses });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error searching courses by student', err: err });
    }
};
