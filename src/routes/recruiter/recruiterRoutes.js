const express = require('express')
const router = express.Router()

// Call Controller
const {getAllControllerRecruiter,getDetailController,loginController,deleteController,updateCompany,updateWallpaper,getDetailCompany} = require('../../controller/recruiter/recruiterController')
const {authentikasi,recruiter} = require('../../helper/authentikasi')
const recruiterController = require('../../controller/recruiter/recruiterController')
router
.get('/getAll', getAllControllerRecruiter)
.get('/getDetail/:id', getDetailController)
.get('/getDetailCompany/:id', getDetailCompany)
.put('/updateCompany/:id', updateCompany)
.put('/updateWallpaper/:id', updateWallpaper)
.post('/login', loginController)
.delete('/delete/:id', deleteController)
.post('/register', recruiterController.register)
.get('/verify/:token', recruiterController.verify)
.post('/forgotPassword', recruiterController.forgetPassword)
.post('/resetPassword', recruiterController.resetPassword)
// .get('/detailMessage/:receiver', recruiterController.getDetailMessage)

module.exports = router