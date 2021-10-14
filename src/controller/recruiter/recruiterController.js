  // Call Model
const {getAllModelRecruiter,getDetailRecruiter,loginModelRecruiter,deleteModel,getDetailCompany,updateCompanyModel,updateRecruiterModel,updateWallpaperModel,getDetailCompany2} = require('../../model/recruiter/recruiterModel')
const recruiterModel = require('../../model/recruiter/recruiterModel')
// Call Response
const {success,failed,errorServer} = require('../../helper/response')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { JWT_REFRESH, JWTRECRUITER } = require('../../helper/env')
const sendEmail = require('../../helper/sendEmail')
const uploads = require('../../helper/upload')
const fs = require('fs')
const path = require('path')
module.exports = {
  getAllControllerRecruiter: async (req,res) => {
    try {
      const getRecruiter = await getAllModelRecruiter()
      success(res, getRecruiter, 'Success get all data Recruiter')
    } catch (error) {
      errorServer(res, [], error.message)
    }
  },
  getDetailController : async (req,res) => {
    const id = req.params.id
    try {
      const DetailRecruiter = await getDetailRecruiter(id)
      success(res, DetailRecruiter, 'Success get detail data Recruiter')
    } catch (error) {
      errorServer(res, [], error.message)
    }
  },
  getDetailCompany : async (req,res) => {
    const id = req.params.id
    try {
      const DetailCompany = await getDetailCompany(id)
      success(res, DetailCompany, 'Success get detail data Company')
    } catch (error) {
      errorServer(res, [], error.message)
    }
  },
  register: async (req, res) => {
    try {
      const body = req.body
      const passwords = req.body.password
      const salt = await bcrypt.genSalt(10)
      const hashPassword = await bcrypt.hash(passwords, salt)
      const data = {
        name_recruiter: body.name_recruiter,
        email_recruiter: body.email_recruiter,
        company_name: body.company_name,
        position: body.position,
        phone_number: body.phone_number,
        password: hashPassword
      }

      recruiterModel.register(data).then((result) => {
        const id =result.insertId

        success(res, result, 'Register success, please check your email for activation')
        sendEmail.sendEmailRecruiter(data.email_recruiter,id)
      }).catch((err) => {
        if (err.message = 'Duplicate entry') {
          failed(res, [], 'Email already exist')
        } else {
          failed(res, [], err.message)
        }
      })
    } catch (error) {
      errorServer(res, [], error.message)
    }
  },
  loginController : async (req,res) => {
    const body = req.body
    try {
      const recruiter = await loginModelRecruiter (body)
      
      if (recruiter.length>0) {
        const status = recruiter[0].status
          if (status!==0) {
        const PassDb = recruiter[0].password
        const email = recruiter[0].email_recruiter
        const idRecruiterDb = recruiter[0].id_recruiter
        const compani = await getDetailCompany2(idRecruiterDb)
        const idCompany = compani[0].id_company
        const role = 1
          const matchPass = await bcrypt.compare(body.password,PassDb)
          if (matchPass) {
            // Success
              jwt.sign({email:email,role:role},JWTRECRUITER, (err,tokenacc) => {
                success(res, {id:idRecruiterDb,idCompany:idCompany,email:email,role:role,tokenacc}, 'Success')
              })
          }else{
            failed(res,[],'Wrong password')
            }
          }else{
            failed(res,[],'Email has not been actived')

          }
        }else{
          failed(res,[],'Email has not been registered')
        }
      } catch (error) {
        errorServer(res, [], error.message)
      }
  },
  verify: (req, res) => {
    try {
      const token = req.params.token
      jwt.verify(token, JWTRECRUITER, (err, decode) => {
        if (err) {
          failed(res, [], 'Authorization failed')
        } else {
          const email = decode.email
          const id = decode.id
          recruiterModel.updateStatus(email,id).then((result) => {
            return res.render('index', { email })
          }).catch((err) => {
            failed(res, [], err.message)
          })
        }
      })
    } catch (error) {
      errorServer(res, [], 'Internal server error')
    }
  },
  // Update Company
updateCompany:  (req,res) => {
  uploads.single('image_company') (req,res, async (err) => {
    if (err) {
      if (err.code=== 'LIMIT_FILE_SIZE') {
        failed(res, [], 'File too large')
      }else{
        failed(res, [], 'File must be jpg | jpeg or png ')
      }
    }else {
      const id        = req.params.id
      const body  = req.body
      body.image_company = !req.file?'':req.file.filename
      try {
        const dataCompany = await getDetailCompany(id)
        const id_recruiter = dataCompany[0].id_recruiter
        // const dataEmploye = await getDetailRecruiter(id_recruiter)
        const companyName = body.company_name
        const newImage = body.image_company
        if (newImage) {
          //     // With Image
          if (dataCompany[0].image_company==='default.jpg') {
            // Change img Default
            const results = await updateCompanyModel(body,id)
            await updateRecruiterModel(companyName,id_recruiter)
            success(res, results, 'Update img default success')
          }else{
            // Change img after change default
            const result = await updateCompanyModel(body,id)
            // Delete Image
            let oldPath = path.join(__dirname + `/../../img/${dataCompany[0].image_company}`);
            fs.unlink(oldPath, function (err) {
              if (err) throw err;
              console.log('Deleted');
            })
            await updateRecruiterModel(companyName,id_recruiter)
            success(res, result, 'Update Image Company success')
          }
        }else{
          // Without Image
          body.image_company = dataCompany[0].image_company
          const result = await updateCompanyModel(body,id)
          await updateRecruiterModel(companyName,id_recruiter)
          success(res, result, 'Update Without Image success')
        }
      } catch (error) {
        errorServer(res, [], error.message)
      }
    }
  })
},

// Update Wallpaper
updateWallpaper:  (req,res) => {
  uploads.single('wallpaper_image') (req,res, async (err) => {
    if (err) {
      if (err.code=== 'LIMIT_FILE_SIZE') {
        failed(res, [], 'File too large')
      }else{
        failed(res, [], 'File must be jpg | jpeg or png ')
      }
    }else {
      const id        = req.params.id
      const body  = req.body
      body.wallpaper_image = !req.file?'':req.file.filename
     
      try {
        const dataCompany = await getDetailCompany(id)
        const newImage = body.wallpaper_image
        const {wallpaper_image} = body
        if (wallpaper_image !==''||wallpaper_image!==null) {
          if (newImage) {
            //     // With Image
            if (dataCompany[0].wallpaper_image==='' || dataCompany[0].wallpaper_image===null) {
              const results = await updateWallpaperModel(body,id)
              success(res, results, 'Update img default success')
            }else{
              // Change img after change default
              const result = await updateWallpaperModel(body,id)
              // Delete Image
              let oldPath = path.join(__dirname + `/../../img/${dataCompany[0].wallpaper_image}`);
              fs.unlink(oldPath, function (err) {
                if (err) throw err;
                console.log('Deleted');
              })
              success(res, result, 'Update Image Wallpaper success')
            }
          }else{
            // Without Image
            body.wallpaper_image = dataCompany[0].wallpaper_image
            const result = await updateWallpaperModel(body,id)
            success(res, result, 'Update Without Image success')
          }
        }else{
          failed(res,[],'Wallpaper image must be fill')
        }
        
      } catch (error) {
        errorServer(res, [], error.message)
      }
    }
  })
},

  deleteController : async (req,res) => {
    const id = req.params.id
    try {
      const deleteRecruiter = await deleteModel(id)
      success(res,deleteRecruiter,'Delete Recruiter success')
    } catch (error) {
      errorServer(res,[],error.message)      
    }
  },

  forgetPassword: (req, res) => {
    try {
      const body = req.body
      const email = body.email

      recruiterModel.getEmailRecruiter(email).then((result) => {
        const userKey = jwt.sign({ email: email }, JWTRECRUITER)

        recruiterModel.updateUserKey(userKey, email).then((result) => {
          success(res, result, 'Please check your email for password reset')
          sendEmail.sendEmailForgotRecruiter(email, userKey)
        }).catch((err) => {
          failed(res, [], err.message)
        })
      }).catch((err) => {
        failed(res, [], err.message)
      })
    } catch (error) {
      errorServer(res, [], error.message)
    }
  },

  resetPassword: async (req, res) => {
    try {
      const body = req.body

      const userKey = req.body.userKey

      if (!userKey) {
        failed(res, [], 'User key not found')
      } else {
        const pwd = body.password
        const salt = await bcrypt.genSalt(10)
        const pwdHash = await bcrypt.hash(pwd, salt)

        recruiterModel.newPassword(pwdHash, userKey).then((result) => {
          success(res, result, 'Reset Password Success')
        }).catch((err) => {
          failed(res, [], err.message)
        })
      }
    } catch (error) {
      errorServer(res, [], error.message)
    }
  }
}
