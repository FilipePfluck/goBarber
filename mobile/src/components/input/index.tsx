import React, { 
    useState,
    useCallback,
    useEffect, 
    useRef, 
    useImperativeHandle, 
    forwardRef 
} from 'react'
import { TextInputProps } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'

import { useField } from '@unform/core'

import { Container, TextInput } from './styles'

interface InputProps extends TextInputProps {
    name: string
    icon: string
    containerStyle?: {}
}

interface InputValueReference {
    value: string
}

interface InputRef {
    focus(): void
}

const Input: React.RefForwardingComponent<InputRef ,InputProps> = ({name, containerStyle = {}, icon, ...rest}, ref) => {
    const inputElementRef  = useRef<any>(null)
    
    const { registerField, defaultValue = '' , fieldName, error } = useField(name)
    const inputValueRef = useRef<InputValueReference>({value: defaultValue})

    const [isFocused, setIsFocused] = useState(false)
    const [isFilled, setIsFilled] = useState(false)
    
    useEffect(()=>{
        registerField<string>({
            name: fieldName,
            ref: inputValueRef.current,
            path: 'value',
            setValue(ref: any, value){
                inputValueRef.current.value = value,
                inputElementRef.current.setNativeProps({ text: value })
            },
            clearValue(){
                inputValueRef.current.value = '',
                inputElementRef.current.clear()
            }
        })
    },[fieldName, registerField])

    useImperativeHandle(ref, ()=>({
        focus(){
            inputElementRef.current.focus()
        }
    }))

    const handleInputFocus = useCallback(()=>{
        setIsFocused(true)
    },[])

    const handleInputBlur = useCallback(()=>{
        setIsFocused(false) 

        setIsFilled(!!inputValueRef.current.value)

    },[])

    console.log(error)

    return(
        <Container style={containerStyle} isFocused={isFocused} isErrored={!!error}>
            <Icon name={icon} size={20} color={isFocused || isFilled ? '#ff9000' : '#666360'} />
            <TextInput
                ref = { inputElementRef }
                keyboardAppearance="dark" 
                placeholderTextColor="#666360" 
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                defaultValue={defaultValue}
                onChangeText = {value => {
                    inputValueRef.current.value = value 
                }}
                {...rest}
            />
        </Container>
    )
}

export default forwardRef(Input)