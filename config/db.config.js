module.exports = {
  HOST: "localhost",//itm711-0000.czgadxekpf14.us-east-1.rds.amazonaws.com
  PORT: 3306,
  USER: "root",
  PASSWORD: "Lockdown@2021",
  DB: "student_details",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
//itm711-0000