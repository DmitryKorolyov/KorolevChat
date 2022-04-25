const {Router} = require('express')
const {check, validationResult} = require('express-validator')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const createError = require('http-errors')

const config = require('config')
const User = require('../models/User')

const router = Router()

router.get('/test',
    async (req, res) => {
        try {
            res.json({message:"Hello from object!"})
        }
        catch(e) {
            res.status(500).json({message: 'Ошибка!'})
            console.log(`Ошибка ${e}`)
        }
    })


router.post(
    '/login',
    jsonParser,
    [
        check('email', 'Некорректные данные').normalizeEmail().isEmail(),
        check('password', 'Некорректные данные').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({type: 'ERROR', errorInfo: 'Некорректные данные при входе в систему!'})    
            }

            const {email, password} = req.body
            const user = await User.findOne({email})
            if (!user) {
                return res.status(400).json({type: 'ERROR', errorInfo: 'Пользователь не найден!'})
            }
            const isMatch = await bcrypt.compare(password, user.password)            
            if (!isMatch) {
                return res.status(400).json({type: 'ERROR', errorInfo: 'Некорректные данные!'})
            }
            const token = jwt.sign(
                {userId: user.id},
                config.get('JWTSecret'),
                // {expiresIn: '24h'}
                {expiresIn: '365d'}
            )
            res.json({token, userId: user.id, nickname: user.email})
        }
        catch(e) {
            res.status(500).json({type: 'ERROR', errorInfo: 'Ошибка!'})
            console.log(`Ошибка ${e}`)
        }



    })

router.post(
    '/register',
    jsonParser,
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длина пароля равна 8 символам').isLength({min: 6})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({type: 'ERROR', errorInfo: 'Некорректные данные при регистрации!'})    
            }


            const {email, password} = req.body
            const candidate = await User.findOne({email})
            if (candidate) {
                res.status(400).json({type: 'ERROR', errorInfo:"Данный пользователь уже существует"})
            }
            const hashedPassword = await bcrypt.hash(password, 12)
            const newUser = new User({email, password: hashedPassword})
            await newUser.save()

            const user = await User.findOne({email})
            console.log(user)
            const token = jwt.sign(
                {userId: user.id},
                config.get('JWTSecret'),
                // {expiresIn: '1h'}
                {expiresIn: '365d'}
            )
            res.json({token, userId: user.id, nickname: user.email})
        }
        catch(e) {
            res.status(500).json({type: 'ERROR', errorInfo: 'Ошибка!'})
            console.log(`Ошибка ${e}`)
        }
})

module.exports = router