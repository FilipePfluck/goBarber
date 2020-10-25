import React, {useRef, useCallback, useState} from 'react'
import { Link } from 'react-router-dom'

import {FormHandles} from '@unform/core'
import {Form} from '@unform/web'
import * as yup from 'yup'
import { FiLogIn, FiMail } from 'react-icons/fi'

import {Container, Content, Background, AnimationContainer} from './styles'

import getValidationErrors from '../../utils/getValidationErrors'
import api from '../../services/apiClient'

import Input from '../../components/Input'
import Button from '../../components/Button'

import {useToast} from '../../context/ToastContext'

import logoImg from '../../assets/logo.svg'

interface ForgotPasswordFormData {
    email: string
}

const ForgotPassword: React.FC = () => {
    const [loading, setLoading] = useState(false)

    const formRef = useRef<FormHandles>(null)

    const {addToast} = useToast()

    const handleSubmit = useCallback(async (data: ForgotPasswordFormData) =>{
        setLoading(true)

        try{
            formRef.current?.setErrors({})

            const schema = yup.object().shape({
                email: yup.string()
                    .required('Preencha o email')
                    .email('Digite um email válido'),
            })

            await schema.validate(data, {
                abortEarly: false
            })

            await api.post('/password/forgot', {
                email: data.email
            })

            addToast({
                type: 'succes',
                title: 'Email de recuperação de senha enviado',
                description: 'Cheque sua caixa de entrada.'
            })
        }catch (err){
            if(err instanceof yup.ValidationError){
                const errors = getValidationErrors(err)

                formRef.current?.setErrors(errors)

                return
            }

            addToast({
                type: 'error',
                title: 'Erro na recuperação de senha',
                description: 'Não foi possível recuperar sua senha, tente novamente.'
            })
        } finally{
            setLoading(false)
        }
    },[addToast])
    
    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber"/>

                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Recuperar senha</h1>

                        <Input 
                            name="email" 
                            placeholder="Email"
                            icon={FiMail}
                        />
                        
                        <Button 
                            loading={loading} 
                            type="submit" 
                        >Recuperar</Button>
                    </Form>

                    <Link to="/"> 
                        <FiLogIn/>  
                        Voltar ao login
                    </Link>
                </AnimationContainer>
            </Content>
            <Background/>
        </Container>
    )
}

export default ForgotPassword