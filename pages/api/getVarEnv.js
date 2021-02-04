import getUserUrl from './getUserUrl'

require('dotenv').config()

export default async function getVarEnv(req,res){
    res.statusCode = 200
    res.json(process.env.USER_URL)
}