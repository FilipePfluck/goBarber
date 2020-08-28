import React, { useCallback, useMemo } from 'react'
import { View, Button } from 'react-native'

import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import Icon from 'react-native-vector-icons/Feather'

import { useAuth } from '../../hooks/AuthContext'

import * as S from './styles'
import { useNavigation, useRoute } from '@react-navigation/native'

interface RouteParams{
    date: number
}

const AppointmentCreated: React.FC = () => {
    const { reset } = useNavigation()
    const { params } = useRoute()

    const routeParams = params as RouteParams

    const handlePressOk = useCallback(()=>{
        reset({
            routes: [
                {name: 'Dashboard'}
            ],
            index: 0
        })
    },[reset])

    const formattedDate = useMemo(() => {
        return format(
            routeParams.date, 
            "EEEE', dia' dd 'de' MMMM 'às' HH:mm'h'", 
            { locale: ptBR }
        )
    }, [routeParams.date])

    return (
        <S.Container>
            <Icon name="check" size={80} color="#04D361" />
            
            <S.Title>Agendamento concluído!</S.Title>
            <S.Description>{formattedDate}</S.Description>

            <S.OkButton onPress={handlePressOk} >
                <S.OkButtonText>Ok</S.OkButtonText>
            </S.OkButton>
        </S.Container>
    )
}

export default AppointmentCreated