require('dotenv').config();

module.exports = {
    // Config PORT
    PORT: process.env.PORT,
    // COnfig Database
    DB_HOST: process.env.DB_HOST,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DATABASE: process.env.DATABASE,
    DATE: process.env.DATE,
    JWTEMPLOYE:process.env.JWTEMPLOYE,
    JWTRECRUITER:process.env.JWTRECRUITER,
    JWT_REFRESH:process.env.JWT_REFRESH,
    EMAIL:process.env.EMAIL,
    PASSWORD:process.env.PASSWORD,
    JWT_REGIS:process.env.JWT_REGIS, 
    URL:process.env.URL, 
    URL_LOKAL:process.env.URL_LOKAL, 

}