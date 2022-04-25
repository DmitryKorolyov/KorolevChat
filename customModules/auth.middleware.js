const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    if (req.method == 'OPTIONS') {
        return next()
    }
    try{
        const jwtToken = req.headers.authorization.split(' ')[1]
        if (!jwtToken){
            return res.status(401).json({message: 'Нет авторизации!'})
        }
        const decrypted = jwt.verify(jwtToken, config.get('JWTSecret'))
        req.user = decrypted
        next()
    }
    catch(e){
        res.status(401).json({message: e.message})
    }
}