'use strict'

import Animal from './animal.model.js'
import { checkUpdate } from '../utils/validator.js'

export const testa = (req, res) => {
    return res.send('Hello world')
}

export const animalRegister = async( req, res) => {
    try {
        let data = req.body
        let animal = new Animal(data)
        await animal.save()
        return res.send({message: 'Registered succesfullu'})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error registered animal',err})
    }
}

//Actualizar

export const animalUpdate = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let update = checkUpdate(data, id)
        if (!update) return res.status(400).send({ message: 'Have sumbitted  some data that cannot be updated or missing data' })
       
        let updateAnimal = await Animal.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        if(!updateAnimal) return res.status(401).send({message: 'Animal not found and not updated'})
            return res.send({message: 'Update Animal', updateAnimal})
    } catch (err) {
        console.error(err)
        //if(err.keyValue.animal) return res.status(400).send({message: `Animal ${err.keyValue.animal} is ready taken`})
        return res.status(500).send({message: 'Error updating animal'})
    }
}

//Eliminar
export const deleteA = async(req, res) =>{
    try {
    let { id } = req.params
    let deleteAnimal = await Animal.findOneAndDelete({_id: id})
    
    if(!deleteAnimal) return res.status(404).send({message: 'Animal not fount and not delete'})
        return res.send({message: `Animal delete succesfully`})
} catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error deleting animal'})
    }
}