import React, { useCallback, useRef } from 'react'
import { 
    Image, 
    KeyboardAvoidingView, 
    Platform, 
    View, 
    ScrollView, 
    TextInput,
    Alert 
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Feather'
import * as yup from 'yup'

import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'

import { useAuth } from '../../hooks/AuthContext'

import getValidationErrors from '../../utils/getValidationErrors'

import Input from '../../components/input'
import Button from '../../components/button'

import logoImg from '../../assets/logo.png'

import * as S from './styles'

interface SignInFormData {
    email: string,
    password: string
}

const SignIn: React.FC = () => {
    const navigation = useNavigation()

    const formRef = useRef<FormHandles>(null)
    const passwordInputRef = useRef<TextInput>(null)

    const { signIn, user } = useAuth()

    console.log(user)

    const handleSignIn = useCallback(async (data: SignInFormData) =>{
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
        }catch (err){
            if(err instanceof yup.ValidationError){
                const errors = getValidationErrors(err)

                formRef.current?.setErrors(errors)

                return
            }

            Alert.alert('Erro na autenticação', 'Ocorreu um erro no login, cheque as credenciais')

        }
    },[signIn])

    return(
    <>
        <KeyboardAvoidingView 
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            enabled
        >   
            <ScrollView
                contentContainerStyle={{flex: 1}}
                keyboardShouldPersistTaps="handled"
            >
                <S.Container>
                    <Image source={logoImg} />

                    <View>
                        <S.Title>Faça seu login </S.Title>
                    </View>

                    <Form ref={formRef} onSubmit={handleSignIn}>
                        <Input 
                            autoCorrect={false}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            name="email" 
                            icon="mail" 
                            placeholder="Email"
                            returnKeyType="next"
                            onSubmitEditing={()=>{
                                passwordInputRef.current?.focus()
                            }}
                        />

                        <Input 
                            ref={passwordInputRef}
                            name="password" 
                            icon="lock" 
                            placeholder="Senha"
                            secureTextEntry
                            returnKeyType="send"
                            onSubmitEditing={
                                () => formRef.current?.submitForm()
                            }
                        />
                        <Button onPress={
                            () => formRef.current?.submitForm()
                        }>Entrar</Button>
                    </Form>

                    <S.ForgetPassword onPress={()=>{}}>
                        <S.ForgetPasswordText>Esqueci minha senha</S.ForgetPasswordText>
                    </S.ForgetPassword>
                </S.Container>
            </ScrollView>
        </KeyboardAvoidingView> 

        <S.CreateAccountButton onPress={()=>{navigation.navigate('SignUp')}}>
            <Icon name="log-in" size={20} color="#ff9000"/>
            <S.CreateAccountText>Criar conta</S.CreateAccountText>
        </S.CreateAccountButton>
    </> 
    )
}

export default SignIn