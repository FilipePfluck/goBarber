import React, { useRef, useCallback } from 'react'
import { 
    Image, 
    KeyboardAvoidingView, 
    Platform, 
    View, 
    ScrollView, 
    TextInput, 
    Alert
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'

import * as yup from 'yup'

import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'

import api from '../../services/api'

import getValidationErrors from '../../utils/getValidationErrors'

import Input from '../../components/input'
import Button from '../../components/button'

import logoImg from '../../assets/logo.png'

import * as S from './styles'

interface SignUpFormData{
    name: string, 
    email: string,
    password: string,

}

const SignUp: React.FC = () => {
    const navigation = useNavigation()

    const formRef = useRef<FormHandles>(null)
    const emailInputRef = useRef<TextInput>(null)
    const passwordInputRef = useRef<TextInput>(null)

    const handleSignUp = useCallback(async (data: SignUpFormData) =>{
        try{
            formRef.current?.setErrors({})

            const schema = yup.object().shape({
                name: yup.string()
                    .required('Preencha o nome'),
                email: yup.string()
                    .required('Preencha o email')
                    .email('Digite um email válido'),
                password: yup.string()
                    .required('Preencha a senha')
            })

            await schema.validate(data, {
                abortEarly: false
            })

            api.post('/users', data)

            Alert.alert('Cadastro realizado com sucesso!', 'Você já pode fazer login na aplicação')

            navigation.goBack()
        }catch (err){
            if(err instanceof yup.ValidationError){
                const errors = getValidationErrors(err)

                formRef.current?.setErrors(errors)

                return
            }

            Alert.alert('Erro na autenticação', 'Ocorreu um erro no login, cheque as credenciais')

        }
    },[navigation])

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
                        <S.Title> Crie sua conta </S.Title>
                    </View>

                    <Form ref={formRef} onSubmit={handleSignUp}>
                        <Input 
                            autoCorrect={false}
                            autoCapitalize="none"
                            name="name" 
                            icon="user" 
                            placeholder="Nome"
                            returnKeyType="next"
                            onSubmitEditing={()=>{
                                emailInputRef.current?.focus()
                            }}
                        />

                        <Input 
                            ref={emailInputRef}
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
                            returnKeyType="send"
                            onSubmitEditing={()=>{
                                formRef.current?.submitForm()
                            }}
                            secureTextEntry
                        />
                        <Button onPress={()=>formRef.current?.submitForm() }>
                            Cadastrar
                        </Button>
                    </Form>

                </S.Container>
            </ScrollView>
        </KeyboardAvoidingView> 

        <S.BackToSignInButton onPress={()=>{navigation.goBack()}}>
            <Icon name="arrow-left" size={20} color="#fff"/>
            <S.BackToSignInText> Voltar para login </S.BackToSignInText>
        </S.BackToSignInButton>
    </> 
    )
}

export default SignUp