const express =require("express")
const authRouter = require('../modules/auth/auth.routing')
const serviceRouter =require('../modules/Salonservices/service.routing')
const appintmentRoute=require('../modules/appointment/appointment.routing')
const appointmentRouting = require("../modules/appointment/appointment.routing")
const bulkRouting = require ("../modules/bulk/bulk.routes")
const templateRouting = require("../modules/notification/template.routes")
const logsRouting = require("../modules/logs/logs.routing")
const mainRoute=express.Router()
console.log("Checking router types:");
console.log("authRouter is function:", typeof authRouter === 'function');
console.log("serviceRouter is function:", typeof serviceRouter === 'function');
console.log("appointmentRouting is function:", typeof appointmentRouting === 'function');
console.log("bulkRouting is function:", typeof bulkRouting === 'function');
console.log("templateRouting is function:", typeof templateRouting === 'function');
console.log("logsRouting is function:", typeof logsRouting === 'function'); // This is likely false
mainRoute.use('/auth',authRouter)
mainRoute.use('/services',serviceRouter)
mainRoute.use('/appointment',appointmentRouting)
mainRoute.use('/bulk', bulkRouting)
mainRoute.use('/notification',templateRouting)
mainRoute.use('/logs',logsRouting)

module.exports=mainRoute