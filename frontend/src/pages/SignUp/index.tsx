import React, { useCallback, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'

import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as yup from 'yup'

import {Container, Content, Background, AnimationContainer} from './styles'
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi'

import api from '../../services/apiClient'
import getValidationErrors from '../../utils/getValidationErrors'

import Input from '../../components/Input'
import Button from '../../components/Button'

import { useToast } from '../../context/ToastContext'

import logoImg from '../../assets/logo.svg'

interface SignUpData {
    name: string,
    email: string,
    password: string
}

const SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null)
    const { addToast } = useToast()
    const history = useHistory()

    const handleSubmit = useCallback(async (data: SignUpData) =>{
        try{
            formRef.current?.setErrors({})

            const schema = yup.object().shape({
                name: yup.string()
                    .required('Nome obrigatório'),
                email: yup.string()
                    .required('Email obrigatório')
                    .email('Digite um email válido'),
                password: yup.string()
                    .min(6, 'No mínimo 6 dígitos')
            })

            await schema.validate(data, {
                abortEarly: false
            })

            await api.post('/users', data)

            addToast({
                type: 'succes',
                title: 'Cadastro realizado!',
                description: 'Você já pode fazer seu login!'
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

    return (
        <Container>
            <Background/>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber"/>

                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Faça seu cadastro</h1>

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
                            name="password" 
                            type="password" 
                            placeholder="Senha" 
                            icon={FiLock}
                        />
                    
                        <Button type="submit" >Cadastrar</Button>
                    </Form>

                    <Link to="/"> 
                        <FiArrowLeft/>  
                        Voltar
                    </Link>
                </AnimationContainer>
            </Content>
        </Container>
    )
}

export default SignUp