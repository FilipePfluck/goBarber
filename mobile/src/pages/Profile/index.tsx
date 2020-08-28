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
import ImagePicker from 'react-native-image-picker'
import { useNavigation } from '@react-navigation/native'

import * as yup from 'yup'

import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'

import api from '../../services/api'

import getValidationErrors from '../../utils/getValidationErrors'

import Input from '../../components/input'
import Button from '../../components/button'

import * as S from './styles'
import { useAuth } from '../../hooks/AuthContext'

interface ProfileFormData{
    name: string, 
    email: string,
    password: string,
    old_password: string,
    password_confirmation: string

}

const SignUp: React.FC = () => {
    const navigation = useNavigation()
    const { user, updateUser } = useAuth()

    const formRef = useRef<FormHandles>(null)
    const emailInputRef = useRef<TextInput>(null)
    const passwordInputRef = useRef<TextInput>(null)
    const oldPasswordInputRef = useRef<TextInput>(null)
    const confirmPasswordInputRef = useRef<TextInput>(null)

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

            await schema.validate(data, {
                abortEarly: false
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

            const response = await api.put('/users/profile', formData)

            updateUser(response.data)

            Alert.alert('Perfil atualizado com sucesso!')

            navigation.goBack()
        }catch (err){
            if(err instanceof yup.ValidationError){
                const errors = getValidationErrors(err)

                formRef.current?.setErrors(errors)

                return
            }

            Alert.alert('Erro na atualização', 'Ocorreu um erro ao atualizar o perfil, cheque as credenciais')

        }
    },[navigation, updateUser])

    const handleUpdateAvatar = useCallback(()=>{
        ImagePicker.showImagePicker({
            title: 'Selecione uma foto',
            cancelButtonTitle: 'Cancelar',
            takePhotoButtonTitle: 'Tirar uma foto',
            chooseFromLibraryButtonTitle: 'Escolher foto da galeria'
        }, response => {
            if (response.didCancel) {
                return
            }
            
            if (response.error) {
                Alert.alert('Erro ao atualizar avatar')
                return
            }
            
            const data = new FormData()
            
            data.append('avatar', {
                type: 'image/jpg',
                name: `${user.id}.jpg`,
                uri: response.uri,
            })

            api.patch('users/avatar', data).then(apiResponse => {
                updateUser(apiResponse.data)
            })
        })
    },[updateUser, user.id])

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
                    <S.BackButton onPress={()=> {navigation.goBack()}}>
                        <Icon name="chevron-left" size={28} color="#999591"/>
                    </S.BackButton>

                    <S.UserAvatarButton onPress={handleUpdateAvatar}>
                        <S.UserAvatar source={{ uri: user.avatar_url}} />
                    </S.UserAvatarButton>

                    <View>
                        <S.Title> Meu Perfil </S.Title>
                    </View>

                    <Form initialData={user} ref={formRef} onSubmit={handleSubmit}>
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
                                oldPasswordInputRef.current?.focus()
                            }}
                            
                        />

                        <Input 
                            ref={oldPasswordInputRef}
                            name="old_password" 
                            icon="lock" 
                            placeholder="Senha Atual"
                            containerStyle={{marginTop: 16}}
                            returnKeyType="next"
                            onSubmitEditing={()=>{
                                passwordInputRef.current?.focus()
                            }}
                            secureTextEntry
                        />

                        <Input 
                            ref={passwordInputRef}
                            name="password" 
                            icon="lock" 
                            placeholder="Nova Senha"
                            returnKeyType="next"
                            onSubmitEditing={()=>{
                                confirmPasswordInputRef.current?.focus()
                            }}
                            secureTextEntry
                        />

                        <Input 
                            ref={confirmPasswordInputRef}
                            name="password_confirmation" 
                            icon="lock" 
                            placeholder="Confirmar Senha"
                            returnKeyType="next"
                            onSubmitEditing={()=>{
                                formRef.current?.submitForm()
                            }}
                            secureTextEntry
                        />

                        <Button onPress={()=>formRef.current?.submitForm() }>
                            Confirmar mudanças
                        </Button>
                    </Form>

                </S.Container>
            </ScrollView>
        </KeyboardAvoidingView> 
    </> 
    )
}

export default SignUp