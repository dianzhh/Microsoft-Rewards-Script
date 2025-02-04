import { Webhook } from './Webhook'

export function log(title: string, message: string, webhookBool: boolean = false, type?: 'log' | 'warn' | 'error') {
    /*
    * webhookBool true: send to webhook
    */
    const currentTime = new Date().toLocaleString()

    let str = ''

    switch (type) {
        case 'warn':
            str = `[${currentTime}] [PID: ${process.pid}] [WARN] [${title}] ${message}`
            console.warn(str)
            break

        case 'error':
            str = `[${currentTime}] [PID: ${process.pid}] [ERROR] [${title}] ${message}`
            console.error(str)
            break

        default:
            str = `[${currentTime}] [PID: ${process.pid}] [LOG] [${title}] ${message}`
            console.log(str)
            break
    }

    if (str && webhookBool) Webhook(str)
}