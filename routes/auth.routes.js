const {Router} = require('express')
const {check, validationResult} = require('express-validator')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/User')
const Participant = require('../models/Participant')
const router = Router()

const Room = require('../models/Room')
const Message = require('../models/Message')
const Dialog = require('../models/Dialog')

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
        check('nickname', 'Некорректные данные').exists(),
        check('password', 'Некорректные данные').exists()
    ],
    async (req, res) => {
        // const count = await User.deleteOne({nickname: 'DmitryKorolev'})
        // await Dialog.deleteOne({_id: '6276deca517af13885df6e32'})
        // console.log('count', count)
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({type: 'ERROR', errorInfo: 'Некорректные данные при входе в систему!'})    
            }

            const {nickname, password} = req.body
            const user = await User.findOne({nickname})
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
                {expiresIn: '365d'}
            )
            res.json({token, userId: user.id, nickname: user.nickname})
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
        check('nickname', 'Минимальная длина никнейма равна 6 символам').isLength({min: 6}),
        check('password', 'Минимальная длина пароля равна 8 символам').isLength({min: 8})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({type: 'ERROR', errorInfo: 'Некорректные данные при регистрации!'})    
            }

            const {nickname, password} = req.body
            const candidate = await User.findOne({nickname})
            if (candidate) {
                res.status(400).json({type: 'ERROR', errorInfo:"Данный пользователь уже существует"})
            }
            const hashedPassword = await bcrypt.hash(password, 12)
            const newUser = new User({nickname, password: hashedPassword})
            await newUser.save()

            const user = await User.findOne({nickname})
            const token = jwt.sign(
                {userId: user.id},
                config.get('JWTSecret'),
                // {expiresIn: '1h'}
                {expiresIn: '365d'}
            )
            res.json({token, userId: user.id, nickname: user.nickname})
        }
        catch(e) {
            console.log('КОЛЛЕКЦИИ ОЧИЩЕНЫ!')
            res.status(500).json({type: 'ERROR', errorInfo: 'Ошибка!'})
            console.log(`Ошибка ${e}`)
        }
})

module.exports = router