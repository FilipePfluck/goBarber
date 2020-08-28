import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { Platform, Alert } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'

import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import Icon from 'react-native-vector-icons/Feather'
import DateTimePicker from '@react-native-community/datetimepicker'

import api from '../../services/api'
import { useAuth } from '../../hooks/AuthContext'

import { Provider } from '../Dashboard'

import * as S from './styles'

interface RouteParams{
    providerId: string
}

interface AvailabiliyItem{
    hour: number,
    available: boolean
}

const CreateAppointment: React.FC = () => {
    const route = useRoute()
    const { providerId } = route.params as RouteParams

    const [availability, setAvailability] = useState<AvailabiliyItem[]>([])
    const [providers, setProviders] = useState<Provider[]>([])
    const [selectedProvider, setSelectedProvider] = useState(providerId)
    const [showDatePicker, setShowDatePicker] = useState(false)

    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedHour, setSelectedHour] = useState(0)

    const { user } = useAuth()

    const { goBack, navigate } = useNavigation()

    useEffect(()=>{
        api.get('providers').then(response => {
            setProviders(response.data)
        })
    },[])

    useEffect(()=>{
        api.get(`providers/${selectedProvider}/day-availability`, {
            params: {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate()
            }
        }).then(response => {
            setAvailability(response.data)
        })
    },[selectedDate, selectedProvider])

    const handleSelectProvider = useCallback((id: string)=>{
        setSelectedProvider(id)
    },[])

    const toggleOpenDatePicker = useCallback(()=>{
        setShowDatePicker(state => !state)
    },[])

    const handleDateChanged = useCallback((event: any, date: Date | undefined)=>{
        if(Platform.OS === 'android'){
            setShowDatePicker(false)
        }

        if(date){
            setSelectedDate(date)
        }
    },[])

    const handleSelectHour = useCallback((hour: number)=>{
            setSelectedHour(hour)
    },[])

    const handleCreateAppointment = useCallback(async ()=>{
        try{
            const date = new Date(selectedDate)

            date.setHours(selectedHour)
            date.setMinutes(0)

            await api.post('appointments', {
                provider_id: selectedProvider,
                date
            })

            navigate('AppointmentCreated', { date: date.getTime()})
        }catch(err){
            Alert.alert(
                'Erro no agendamento',
                'Ocorreu um erro ao tentar criar seu agendamento, tente novamente.'
            )
        }
    },[selectedDate, selectedHour, selectedProvider, navigate])

    const morningAvailability = useMemo(()=>{
        return availability
            .filter(({hour}) => hour < 12)
            .map(({hour, available})=>{
                const formattedHour = format(new Date().setHours(hour), 'HH:00')
                
                return {
                    hour,
                    available,
                    formattedHour
                }
            })
    },[availability])

    const afternoonAvailability = useMemo(()=>{
        return availability
            .filter(({hour}) => hour >= 12)
            .map(({hour, available})=>{
                const formattedHour = format(new Date().setHours(hour), 'HH:00')
                
                return {
                    hour,
                    available,
                    formattedHour
                }
            })
    },[availability])

    const selectedDateAsText = useMemo(()=>{
        return format(selectedDate, "'Dia' dd 'de' MMMM", {
            locale: ptBR
        })
    },[selectedDate])

    return (
        <S.Container>
            <S.Header>
                <S.BackButton onPress={()=> goBack()}>
                    <Icon name="chevron-left" size={24} color="#999591"/>
                </S.BackButton>

                <S.HeaderTitle>Cabeleireiros</S.HeaderTitle>
                <S.UserAvatar source={{ uri: user.avatar_url }} />
            </S.Header>

            <S.Content>
                <S.ProvidersListContainer>
                    <S.ProvidersList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={providers}
                        keyExtractor={provider => provider.id}
                        renderItem={({item: provider})=>(
                            <S.ProviderContainer
                                onPress={()=> handleSelectProvider(provider.id)}
                                selected={provider.id === selectedProvider}
                            >
                                <S.ProviderAvatar source={{ 
                                    uri: provider.avatar_url ? provider.avatar_url : "https://cdn.discordapp.com/attachments/399555129826738189/742792468365574215/KP09VUmxBAiI3AAAAAElFTkSuQmCC.png" 
                                }} />
                                <S.ProviderName selected={provider.id === selectedProvider}>
                                    {provider.name}
                                </S.ProviderName>
                            </S.ProviderContainer>
                        )}
                    />
                </S.ProvidersListContainer>
                <S.Calendar>
                    <S.Title>Escolha uma data</S.Title>
                    <S.SelectedDate>{selectedDateAsText}</S.SelectedDate>
                    <S.OpenDatePickerButton onPress={toggleOpenDatePicker}>
                        <S.OpenDatePickerButtonText>Selecionar outra data</S.OpenDatePickerButtonText>
                    </S.OpenDatePickerButton>

                    {showDatePicker && (<DateTimePicker 
                        mode="date"
                        value={selectedDate}
                        display="calendar"
                        textColor="#F4EDE8" 
                        onChange={handleDateChanged}
                    />)}
                </S.Calendar>

                <S.Schedule>
                    <S.Title>Escolha um horário</S.Title>

                    <S.Section>
                        <S.SectionTitle>Manhã</S.SectionTitle>
                        <S.SectionContent>
                            {morningAvailability.map(({ formattedHour, available, hour })=>(
                                <S.Hour 
                                    key={formattedHour} 
                                    enabled={available}
                                    available={available} 
                                    selected={selectedHour === hour}
                                    onPress={()=> handleSelectHour(hour)}
                                >
                                    <S.HourText selected={selectedHour === hour}>{formattedHour}</S.HourText>
                                </S.Hour>
                            ))}
                        </S.SectionContent>
                    </S.Section>

                    <S.Section>
                        <S.SectionTitle>Tarde</S.SectionTitle>
                        <S.SectionContent>
                            {afternoonAvailability.map(({ formattedHour, hour, available })=>(
                                <S.Hour 
                                    key={formattedHour} 
                                    enabled={available}
                                    available={available} 
                                    selected={selectedHour === hour}
                                    onPress={()=> handleSelectHour(hour)}
                                >
                                    <S.HourText selected={selectedHour === hour}>{formattedHour}</S.HourText>
                                </S.Hour>
                            ))}
                        </S.SectionContent>
                    </S.Section>
                </S.Schedule>
            
                <S.CreateAppointmentButton onPress={handleCreateAppointment}>
                    <S.CreateAppointmentButtonText>Agendar</S.CreateAppointmentButtonText>
                </S.CreateAppointmentButton>
            </S.Content>
        </S.Container>
    )
}

export default CreateAppointment