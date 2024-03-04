'use strict'

import { Router } from "express"
import { 
    validateJwt,
    isTeacher
} from '../middlewares/validate-jwt.js';
import { addACourse, deleteACourse, updateACourse, searchCoursesByTheTeacher, getAllCourses } from './course.controller.js'

const api = Router()

api.post('/addACourse', [validateJwt, isTeacher], addACourse)
api.delete('/deleteACourse/:id', [validateJwt, isTeacher], deleteACourse)
api.put('/updateACourse/:id', [validateJwt, isTeacher], updateACourse)
api.post('/searchCoursesByTheTeacher', [validateJwt, isTeacher], searchCoursesByTheTeacher)
api.get('/getCourses', getAllCourses)

export default api