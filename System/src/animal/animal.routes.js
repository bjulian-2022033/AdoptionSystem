'use strict'

import express from 'express'
import { testa, animalRegister, animalUpdate, deleteA } from './animal.controller.js'

const api = express.Router()

api.get('/testa', testa)
api.post('/animalRegister', animalRegister)
api.put('/animalUpdate/:id', animalUpdate)
api.delete('/deleteA/:id', deleteA)


export default api