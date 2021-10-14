const jwt = require('jsonwebtoken')
const {JWTEMPLOYE,JWTRECRUITER} = require('../helper/env')
const {failed} = require('../helper/response')
module.exports = {
  authentikasi : (req,res,next) => {
    const token = req.headers.token
    if (token===undefined|| token==='') {
      failed(res,[],'Token is required')
    }else{
      next()
    }
  },
  employe : (req,res,next) => {
    const token = req.headers.token
    jwt.verify(token,JWTEMPLOYE, (err,decode) => {
      if (err && err.name === 'TokenExpiredError') {
        failed(res,[],'tokenExpired')
      }else if(err && err.name === 'JsonWebTokenError') {
        failed(res,[],'Failed authentication')
      }else{
       next()
      }
    })
  },
  recruiter : (req,res,next) => {
    const token = req.headers.token
    jwt.verify(token,JWTRECRUITER, (err,decode) => {
      if (err && err.name === 'TokenExpiredError') {
        failed(res,[],'tokenExpired')
      }else if(err && err.name === 'JsonWebTokenError') {
        failed(res,[],'Failed authentication')
      }else{
        next()
      }
    })
  }
}