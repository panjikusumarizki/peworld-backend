const express = require('express')
const router = express.Router()
    // const {
    //   updateandinsert,
    //   profilEdit,
    //   imageedit,
    // } = require("../../controller/employe/employeController");

// Call Controller
const {
  getAllControllerEmploye,
  getDetailController,
  loginController,
  register,
  verification,
  refreshtoken,
  logoutController,
  deleteController,
  updateandinsert,
  profilEdit,
  imageedit,
  displayPortofolio,
  getSkillController,
  getPortfolioController,
  getWorkExperienceController,
  forgetPassword,
  resetPassword
} = require("../../controller/employe/employeController");
// const {authentikasi,employe,recruiter } = require('../../helper/authentikasi')
// const {getAllControllerEmploye,getDetailController,loginController,register,verification,refreshtoken,logoutController,deleteController,getSkillController,getPortfolioController,getWorkExperienceController, forgetPassword, resetPassword} = require('../../controller/employe/employeController')
const {authentikasi,employe,recruiter} = require('../../helper/authentikasi')
router
.get('/getAll', getAllControllerEmploye)
.get('/getDetail/:id', getDetailController)
.get('/getSkill/:id', getSkillController)
.get('/getPortfolio/:id', getPortfolioController)
.get('/getWorkExperience/:id', getWorkExperienceController)
.get('/register/:token', verification ) 
.post('/login', loginController)
.post('/register', register ) 
.post('/refreshtoken', refreshtoken ) 
.delete('/logout/:id', logoutController ) 
.delete('/delete/:id', deleteController ) 
  // edit profilie
  .put("/edit/:id", updateandinsert)
  .post("/portofolio", profilEdit)
  .put("/image/:id", imageedit)
  .get("/getall/profile/:id", displayPortofolio)
  //end edit profile
  //forget password
  .post('/forgotPassword', forgetPassword)
  .post('/resetPassword', resetPassword)

module.exports = router