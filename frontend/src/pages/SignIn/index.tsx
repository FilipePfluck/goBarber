import React, {useRef, useCallback } from 'react'
import { Link, useHistory } from 'react-router-dom'

import {FormHandles} from '@unform/core'
import {Form} from '@unform/web'
import * as yup from 'yup'
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi'

import {Container, Content, Background, AnimationContainer} from './styles'

import getValidationErrors from '../../utils/getValidationErrors'

import Input from '../../components/Input'
import Button from '../../components/Button'

import {useAuth} from '../../context/AuthContext'
import {useToast} from '../../context/ToastContext'

import logoImg from '../../assets/logo.svg'

interface SignInFormData {
    email: string,
    password: string
}

const SignIn: React.FC = () => {
    const formRef = useRef<FormHandles>(null)
    const history = useHistory()

    const {signIn, user} = useAuth()
    const {addToast} = useToast()

    console.log(user)

    const handleSubmit = useCallback(async (data: SignInFormData) =>{
        try{
            formRef.current?.setErrors({})

            const schema = yup.object().shape({
                email: yup.string()
                    .required('Preencha o email')
                    .email('Digite um email válido'),
                password: yup.string()
                    .required('Preencha a senha')
            })

            await schema.validate(data, {
                abortEarly: false
            })

            await signIn({
                email: data.email,
                password: data.password
            })

            history.push('/dashboard')
        }catch (err){
            if(err instanceof yup.ValidationError){
                const errors = getValidationErrors(err)

                formRef.current?.setErrors(errors)

                return
            }

            addToast({
                type: 'error',
                title: 'Erro na autenticação',
                description: 'Não foi possível fazer login. Verifique as credenciais'
            })
        }
    },[signIn, addToast, history])
    
    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber"/>

                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Faça seu login</h1>

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
                        
                        <Button type="submit" >Entrar</Button>

                        <Link to="/forgot">Esqueci minha senha</Link>
                    </Form>

                    <Link to="/signup"> 
                        <FiLogIn/>  
                        Criar conta
                    </Link>
                </AnimationContainer>
            </Content>
            <Background/>
        </Container>
    )
}

export default SignIn