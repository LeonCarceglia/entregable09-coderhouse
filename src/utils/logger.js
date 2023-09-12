import winston from "winston"
import config from "../config/config"

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: "red",
        error: "orange",
        warning: "yellow",
        info: "blue",
        debug: "white"
    }
}

const devLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transport.Console({
            level: "debug",
            format: winston.format.combine(
                (winston.format.colorize({ colors: customLevelOptions.colors }),
                    winston.format.simple()))
        })
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transport.Console({
            level: "info",
            format: winston.format.combine(
                (winston.format.colorize({ colors: customLevelOptions.colors }),
                    winston.format.simple()))
        }),
        new winston.transports.File({
            filename: "./errors.log",
            level: "error",
            format: winston.format.simple()
        })
    ]
})

export const addLoger = (req, res, next) => {
    req.logger = (config.ENVIROMENT === 'development') ? devLogger : prodLogger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}