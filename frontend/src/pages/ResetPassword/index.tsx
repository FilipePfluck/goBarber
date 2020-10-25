import React, {useRef, useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import {FormHandles} from '@unform/core'
import {Form} from '@unform/web'
import * as yup from 'yup'
import { FiLock } from 'react-icons/fi'

import api from '../../services/apiClient'

import {Container, Content, Background, AnimationContainer} from './styles'

import getValidationErrors from '../../utils/getValidationErrors'

import Input from '../../components/Input'
import Button from '../../components/Button'

import {useToast} from '../../context/ToastContext'

import logoImg from '../../assets/logo.svg'

interface ResetPasswordFormData {
    password: string
    password_confirmation: string,
}

const SignIn: React.FC = () => {
    const formRef = useRef<FormHandles>(null)
    const history = useHistory()
    const location = useLocation()

    const {addToast} = useToast()

    const handleSubmit = useCallback(async (data: ResetPasswordFormData) =>{
        try{
            formRef.current?.setErrors({})

            const schema = yup.object().shape({
                password: yup.string().required('Senha obrigatória'),
                password_confirmation: yup.string().oneOf(
                    [yup.ref('password'),], 
                    'As senhas precisam coincidir'
                )
            })

            await schema.validate(data, {
                abortEarly: false
            })  

            const { password, password_confirmation } = data

            const token = location.search.replace('?token=', '')

            if(!token){
                throw new Error()
            }

            await api.post('/password/reset', {
                password,
                password_confirmation,
                token
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
                title: 'Erro ao resetar senha',
                description: 'Não foi possível resetar sua senha. Tente novamente.'
            })
        }
    },[addToast, history, location.search])
    
    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber"/>

                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Resetar senha</h1>

                        <Input 
                            name="password" 
                            type="password" 
                            placeholder="Nova senha" 
                            icon={FiLock}
                        />

                        <Input 
                            name="password_confirmation" 
                            type="password" 
                            placeholder="Confirmação da senha" 
                            icon={FiLock}
                        />
                        
                        <Button type="submit" >Alterar senha</Button>
                    </Form>
                </AnimationContainer>
            </Content>
            <Background/>
        </Container>
    )
}

export default SignIn