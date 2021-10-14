// Call Model
const {
  getAllModelEmploye,
  getDetailEmploye,
  loginModelEmploye,
  register,
  verification,
  UpdateRefreshToken,
  logoutModel,
  deleteModel,
  updateEmploye,
  insertExpreience,
  insertPortofolio,
  inseertSkill,
  updateEmployeimage,
  getallPortofolio,
  getEmailEmploye,
  newPassword,
  updateUserKey,
  getWorkExperience,
  getSkill,
  getPortfolio
} = require("../../model/employe/employeModel");
// Call Response
const {success,failed,errorServer,dataTable} = require('../../helper/response')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {sendEmailEmploye, sendEmailForgotEmploye} = require('../../helper/sendEmail')
const { JWTEMPLOYE, JWT_REFRESH } = require('../../helper/env')
const upload = require('../../helper/uploadEmploye')
const path = require('path')
const fs = require('fs-extra')

module.exports = {
  getAllControllerEmploye: async (req,res) => {
    const where = !req.query.where?'name':req.query.where
    const name = !req.query.name?'':req.query.name
    const orderby = !req.query.orderby?'name_skill':req.query.orderby
    const sort = !req.query.sort?'asc':req.query.sort
     // Pagination
     const jmlhDataPerhalaman = !req.query.limit ? 10 : parseInt(req.query.limit);
     const pagesActive = !req.query.pages ? 1 : parseInt(req.query.pages);
     const start = pagesActive === 1 ? 0 : (jmlhDataPerhalaman * pagesActive) - jmlhDataPerhalaman
    try {
      const getEmploye = await getAllModelEmploye(where,name,orderby,sort,start,jmlhDataPerhalaman)
      if (getEmploye.length===0) {
        failed(res,[],'Data not found')
      }
      const countData = getEmploye[0].count;
      const totalPage = Math.ceil(countData / jmlhDataPerhalaman)
            const coundDatabase = {
                  totalRow: countData,
                  totalPage,
                  pagesActive
            }
              dataTable(res, getEmploye, coundDatabase, `Get All data employe Success`)
    } catch (error) {
      errorServer(res, [], error.message)
    }
  },
  getDetailController : async (req,res) => {
    const id = req.params.id
    try {
      const DetailEmploye = await getDetailEmploye(id)
      success(res, DetailEmploye, 'Success get detail data Employe')
    } catch (error) {
      errorServer(res, [], error.message)
    }
  },
  getSkillController : async (req,res) => {
    const id = req.params.id
    try {
      const DetailSkill = await getSkill(id);
      success(res, DetailSkill, 'Success get detail skill Employe')
    } catch (error) {
      errorServer(res, [], error.message)
    }
  },
  getPortfolioController : async (req,res) => {
    const id = req.params.id
    try {
      const DetailEmploye = await getPortfolio(id)
      success(res, DetailEmploye, 'Success get detail Portfolio Employe')
    } catch (error) {
      errorServer(res, [], error.message)
    }
  },
  getWorkExperienceController : async (req,res) => {
    const id = req.params.id
    try {
      const DetailEmploye = await getWorkExperience(id)
      success(res, DetailEmploye, 'Success get detail WorkExperience Employe')
    } catch (error) {
      errorServer(res, [], error.message)
    }
  },
  loginController : async (req,res) => {
    const body = req.body
    try {
      const employe = await loginModelEmploye (body)
      if (employe.length>0) {
        const statusDb = employe[0].status
        const PassDb = employe[0].password
        const email = employe[0].email
        const idEmployeDb = employe[0].id_employe
        const role = 0
        if (statusDb!==0) {
          const matchPass = await bcrypt.compare(body.password,PassDb)
          if (matchPass) {
            // Success
            const refreshtoken = jwt.sign({email:email,role:role}, JWT_REFRESH)
            UpdateRefreshToken(refreshtoken, idEmployeDb)
             jwt.sign({email:email,role:role},JWTEMPLOYE,{expiresIn:3600}, (err,tokenacc) => {
              success(res, {id:idEmployeDb,email:email,role:role,tokenacc,refreshtoken:refreshtoken}, 'Success')
            })
         }else{
           failed(res,[],'wrong password')
          }
        }else{
          failed(res,[],'Employe has not been actived')
        }
       }else{
         failed(res,[],'Employe has not been registered')
       }
      } catch (error) {
        errorServer(res, [], error.message)
      }
  },
     
  register: async (req,res) => {
    try {
      const {name, email, phone_number, password} = req.body
      const hashpas = bcrypt.hashSync(password, 10)
      sendEmailEmploye(email)
      const regis  = await register(name, email, phone_number, hashpas)
      success(res, regis, 'berhasil register')
    } catch (error) {
      failed(res,error.message,'Email has been registered')
    }
  },
  verification: (req,res) => {
    try {
      const {token} = req.params
      if(token) {
        jwt.verify(token, JWTEMPLOYE, async (err, decode) => {
          if(err) {
            failed(res,[],err.message)
          } else {
            const email = decode.email
             await verification(email)
             return res.render("sendEmploye", { email });
          }
        })
      }
    } catch (error) {
      failed(res, error, 'error sob')
    }
  },
  refreshtoken : (req,res) => {
    const newToken = req.body.token
    if (newToken) {
      jwt.verify(newToken,JWT_REFRESH, (err,decode) => {
        if (decode.role===0) {
          const refreshtoken = jwt.sign({email:decode.email,role:decode.role},JWTEMPLOYE,{expiresIn:3600})
          success(res,{tokenNew:refreshtoken}, 'Success refresh token')
        }else{
          failed(res,[],'Failed refresh token')
        }
      }) 
    }else{
      failed(res,[], 'Token is required!')
    }
  },
  logoutController : async (req,res) => {
    const id = req.params.id
    try {
      const logoutEmploye = await logoutModel(id)
      success(res,logoutEmploye,'Logout Employe success')
    } catch (error) {
      errorServer(res,[],err.message)      
    }
  },
  deleteController : async (req,res) => {
    const id = req.params.id
    try {
      const deleteEmploye = await deleteModel(id)
      success(res,deleteEmploye,'Delete Employe success')
    } catch (error) {
      errorServer(res,[],error.message)      
    }
  },
  updateandinsert: async (req,res) => {
    try {
            const {id} = req.params
            const data2 = await getDetailEmploye(id)
             const { email, work_experience, skill} = req.body
             const name = !req.body.name ? data2[0].name : req.body.name
             const jobdesk = !req.body.jobdesk ? data2[0].jobdesk : req.body.jobdesk
             const domisili = !req.body.domisili ? data2[0].domisili : req.body.domisili
             const workplace = !req.body.workplace ? data2[0].workplace : req.body.workplace
             const description = !req.body.description ? data2[0].description : req.body.description
             const instagram = !req.body.instagram ? data2[0].instagram : req.body.instagram
             const linkedin = !req.body.linkedin ? data2[0].linkedin : req.body.linkedin
             const github = !req.body.github ? data2[0].github : req.body.github
             const phone_number = !req.body.phone_number ? data2[0].phone_number : req.body.phone_number

            //  console.log(work_experience)
             await updateEmploye(name, jobdesk,domisili , email, workplace, description, instagram, github, linkedin, phone_number, id)
             const skill2 = skill.map( async (dt) => {
                const id = dt.id_employe
                const name = dt.name_skill
                await inseertSkill(name, id)
             })
           const insert1 = work_experience.map(async (dt) => {
              try {
                const position = dt.position
              const company_name = dt.company_name
              const month_year = dt.month_year
              const description = dt.description
              const id_employe = dt.id_employe
             await insertExpreience(position, company_name, month_year, description, id_employe)
              } catch (error) {
               return res.send(error.message)
              }
            })
          Promise.all([insert1, skill2]).then((resolve)=>{
              res.send({
               message: "berhasil insert update and edit databasse"
             })
            }).catch((err) =>{
              res.send(err.message)
            }) 
    } catch (error) {
      res.send(error.message)
      
    }
  },
  profilEdit: (req, res) => {
    try {
      upload.uploadsingle(req,res, async (err) =>{
        try {
          if(err) {
            res.send({
              message: err
            })
          } else {
            const {apk_name, link_repo, type_portofolio, id_employe} = req.body
            const image = req.file.filename
            console.log(apk_name, link_repo, type_portofolio, id_employe)
           const data =  await insertPortofolio(apk_name, link_repo, type_portofolio, image, id_employe)
            success(res, data, 'berhasil insert')
         }
       } catch (error) {
        failed(res, error.message, 'error update image')
       }
     })
    } catch (error) {
      
    }
  },
  forgetPassword: (req, res) => {
    try {
      const body = req.body
      const email = body.email

      getEmailEmploye(email).then((result) => {
        const userKey = jwt.sign({ email: email }, JWTEMPLOYE)

        updateUserKey(userKey, email).then((result) => {
          success(res, result, 'Please check your email for password reset')
          sendEmailForgotEmploye(email, userKey)
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

        newPassword(pwdHash, userKey).then((result) => {
          success(res, result, 'Reset password success')
        }).catch((err) => {
          failed(res, [], err.message)
        })
      }
    } catch (error) {
      errorServer(res, [], error.message)
    }
  },
  imageedit: (req, res) => {
    try {
      upload.uploadsingle(req,res, async (err) => {
        try {
          if(err) {
            res.send({
              message: err
            })
          } else {
            const {id} = req.params
            const image = req.file.filename
            const data2 = await getDetailEmploye(id)
            const img = data2[0].image_employe
            if (img && img !== "default.jpg") {
              const data = await updateEmployeimage(image, id);
              await fs.unlink(path.join(`public/images/${img}`));
              res.send(data);
            } else if (img === "default.jpg") {
              const data = await updateEmployeimage(image, id);
              success(res, data, "berhasil update image sob");
            } else {
              await updateEmployeimage(image, id);
              success(res, data, "berhasil update image sob");
            }
          }
        } catch (error) {
          failed(res, error.message, "update failed")
        }
      })
    } catch (error) {
      failed(res, error.message, "failed update")
    }
  },

  displayPortofolio: async (req,res) => {
    try {
      const {id} = req.params
      const data = await getallPortofolio(id)
      success(res, data, "getall success")
    } catch (error) {
      failed(res, error.message, "failed")
    }
  }
}
