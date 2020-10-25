import React, { useCallback, useRef, ChangeEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'

import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as yup from 'yup'

import {Container, Content, AvatarInput} from './styles'
import { FiArrowLeft, FiMail, FiLock, FiUser, FiCamera } from 'react-icons/fi'

import { useAuth } from '../../context/AuthContext'
import api from '../../services/apiClient'
import getValidationErrors from '../../utils/getValidationErrors'

import Input from '../../components/Input'
import Button from '../../components/Button'

import { useToast } from '../../context/ToastContext'

interface ProfileFormData {
    name: string,
    email: string,
    old_password: string,
    password: string,
    password_confirmation: string
}

const Profile: React.FC = () => {
    const formRef = useRef<FormHandles>(null)
    const { addToast } = useToast()
    const history = useHistory()

    const { user, updateUser } = useAuth()

    const handleSubmit = useCallback(async (data: ProfileFormData) =>{
        try{
            formRef.current?.setErrors({})

            const schema = yup.object().shape({
                name: yup.string()
                    .required('Nome obrigatório'),
                email: yup.string()
                    .required('Email obrigatório')
                    .email('Digite um email válido'),
                old_password: yup.string().when('password', {
                    is: val => !!val.length,
                    then: yup.string().required('campo obrigatório'),
                    otherwise: yup.string()
                }),
                password: yup.string(),
                password_confirmation: yup.string().oneOf(
                    [yup.ref('password'),], 
                    'As senhas precisam coincidir'
                )
            })

            const {
                name, 
                email,
                old_password,
                password,
                password_confirmation
            } = data

            const formData = {
                name,
                email,
                ...(old_password
                    ? {
                        old_password,
                        password,
                        password_confirmation
                    } 
                    : {})
            }

            await schema.validate(data, {
                abortEarly: false
            })

            await api.put('/users/profile', formData)

            addToast({
                type: 'succes',
                title: 'Alteração realizada!',
            })

            history.push('/')
        }catch (err){
            if(err instanceof yup.ValidationError){
                const errors = getValidationErrors(err)

                formRef.current?.setErrors(errors)

                return
            }

            addToast({
                type: 'error',
                title: 'Erro no cadastro',
                description: 'Não foi possível fazer o cadastro, tente novamente.'
            })
        }
    },[addToast, history])

    const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>)=>{
        if(e.target.files){
            const data = new FormData()

            data.append('avatar', e.target.files[0])

            api.patch('/users/avatar', data).then((response)=>{
                updateUser(response.data)
            })

            addToast({
                type: 'succes',
                title: 'Avatar atualizado!'
            })

            console.log(user)

        }
    },[addToast, updateUser])

    return (
        <Container>
            <header>
                <div>
                    <Link to="dashboard">
                        <FiArrowLeft 
                            size={24} 
                            color="#999591"
                        />
                    </Link>
                </div>
            </header>
            <Content>
                    <Form 
                        ref={formRef} 
                        onSubmit={handleSubmit} 
                        initialData={{
                            name: user.name,
                            email: user.email
                        }}    
                    >
                        <AvatarInput>
                            <img 
                                src={user.avatar_url 
                                    ? 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png' 
                                    : 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png' 
                                } 
                                alt={user.name}
                            />
                            <label htmlFor="avatar">
                                <FiCamera size={20} color="#312E38"/>
                                <input 
                                    type="file" 
                                    id="avatar" 
                                    onChange={handleAvatarChange}
                                />
                            </label>

                            
                        </AvatarInput>


                        <h1>Meu Perfil</h1>

                        <Input 
                            name="name" 
                            placeholder="Nome"
                            icon={FiUser}
                        />
                        <Input 
                            name="email" 
                            placeholder="Email"
                            icon={FiMail}
                        />

                        <Input 
                            containerStyle={
                                {marginTop: 24}
                            }
                            name="old_password" 
                            type="password" 
                            placeholder="Senha atual" 
                            icon={FiLock}
                        />
                        <Input 
                            name="password" 
                            type="password" 
                            placeholder="Nova senha" 
                            icon={FiLock}
                        />
                        <Input 
                            name="password_confirmation" 
                            type="password" 
                            placeholder="Confirmar senha" 
                            icon={FiLock}
                        />
                    
                        <Button type="submit" >Confirmar mudanças</Button>
                    </Form>
            </Content>
        </Container>
    )
}

export default Profile