'use strict'

import User from './user.model.js' // unico que puede ir en mayuscula
import { checkPassword, checkUpdate, encrypt } from '../utils/validator.js'


export const test = (req, res) => {
    return res.send('Hello world')
}

export const register = async (req, res) => {
    try {
        //Capturar la informacion del cliente (body)
        let data = req.body
        //Encriptar la contrasena
        data.password = await encrypt(data.password)

        //Asignar el tol por defecto
        data.role = 'CLIENT' //Si viene con otro valor o no viene, le asigna a role CLiente

        //Crear una instancia del modelo (schema)
        let user = new User(data)

        //Guardar la informacion
        await user.save()

        //Respondo al usuario
        return res.send({ message: 'Registered succesfully' })


    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering user', err })
    }
}

export const login = async (req, res) => {
    try {
        //Capturar la informacion (body)
        let { username, password } = req.body

        //Validar que el usuario exista
        let user = await User.findOne({ username }) //username: 'jchitay'

        //verifico que la contrasena coincida
        if (user && await checkPassword(password, user.password)) {
            let loggedUser = {
                username: user.username,
                name: user.name,
                role: user.role
            }

            //Responder (dar acceso)
            return res.send({ message: `Welcome ${user.name}` })

        }

       return res.status(404).send({message: 'Invalid credentials'})

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Failed to login' })

    }
}


//Actualizar
export const update = async(req, res) =>{ //Usuario Logueado
    try {
        //Obtener el id del usuario a actualizar
        let { id } = req.params
        //Obtener datos que vamos a actualizar
        let data = req.body
        //Validar si trae datos a actualizar
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'Have sumbitted  some data that cannot be updated or missing data'})
        //Validar si tiene permiso (tokenizacion) X hoy no lo vemos
        
        //ACtualizamos en la DB
        let updateUser = await User.findOneAndUpdate(
            {_id: id}, // Objet id hexadecimal (Hora sistema,  version mongo, llave privada...)
            data, //Datos que va a actualizar
            {new: true} //Objeto de la DB ya actualizado
        )
          
        //Validar si se actualizo
        if(!updateUser) return res.status(401).send({message: 'User not found and not updated'})
        //Responder con el dato actualizado
    return res.send({message: 'Update user', updateUser})
    } catch (err) {
        console.error(err)
        if(err.keyValue.username) return res.status(400).send({message:`Username ${err.keyValue.username} is ready taken`})
        return res.status(500).send({message: 'Error updating account'})
        
    }
}

export const deleteU = async(req, res) =>{
    try {
        //Obtener el id
        let { id } = req.params

        //Eliminar (deleteOne / findOneAndDelete)
        let deleteUser = await User.findOneAndDelete({_id: id})
        //Verificar que se elimina
        if(!deleteUser) return res.status(404).send({message: 'Account not found and not deleted'})
        //Responder
        return res.send({message: `Acount with username ${deleteUser.username} delete succesfully`})

    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error deleting account'})
        
    }
}