import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'

import { isToday, format, parseISO, isAfter, getDaysInMonth } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import DayPicker, { DayModifiers } from 'react-day-picker'
import 'react-day-picker/lib/style.css'

import Switch from 'react-switch'

import api from '../../services/apiClient'

import { FiPower, FiClock } from 'react-icons/fi'

import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

import dark from '../../styles/themes/dark'
import light from '../../styles/themes/light'

import * as S from './styles'

import Logo from '../../assets/logo.svg'

interface MontHAvailabilityItem {
    day: number,
    available: boolean
}

interface Appointment {
    id: string,
    date: string,
    formattedHour: string
    user: {
        name: string,
        avatar_url: string
    }
}

const Dashboard: React.FC = ()=> {
    const { signOut, user } = useAuth()
    const { theme, toggleTheme } = useTheme()

    const [selectedDate, setSelectedDate] = useState(new Date())
    const [currentMonth, setCurrentMonth] = useState(new Date())

    const [monthAvailability, setMonthAvailability] = useState<MontHAvailabilityItem[]>([])
    
    const [daysWithAppointmentsInMonth, setDaysWithAppointmentsInMonth] = useState<number[]>([])

    const [appointments, setAppointments] = useState<Appointment[]>([])

     const disabledDays = useMemo(()=>{
        const invalid = []

        const numberOfDays = getDaysInMonth(currentMonth)

        for(let i = 1; i<=numberOfDays; i++){
            if(daysWithAppointmentsInMonth.indexOf(i) < 0){
                const year = currentMonth.getFullYear()
                const month = currentMonth.getMonth()

                invalid.push(new Date(year, month, i ))
            }
        }
        
        console.log('teste:', invalid)
        return invalid
    },[currentMonth, daysWithAppointmentsInMonth])

    const selectedDateAsText = useMemo(()=>{
        return format(selectedDate, "'Dia' dd 'de' MMMM", {
            locale: ptBR
        })
    },[selectedDate])

    const selectedWeekDay = useMemo(()=>{
        return format(selectedDate, "cccc", {
            locale: ptBR
        })
    },[selectedDate])

    const morningAppointments = useMemo(() => {
        return appointments.filter(appointment => {
            return parseISO(appointment.date).getHours() < 12
        })
    }, [appointments])

    const afternoonAppointments = useMemo(() => {
        return appointments.filter(appointment => {
            return parseISO(appointment.date).getHours() >= 12
        })
    }, [appointments])

    const nextAppointment = useMemo(() => {
        return appointments.find(appointment => 
            isAfter(parseISO(appointment.date), new Date())    
        )
    },[appointments])

    useEffect(()=>{
        api.get(`/providers/${user.id}/month-availability`, {
            params: {
                year: currentMonth.getFullYear(),
                month: currentMonth.getMonth() + 1
            }
        }).then(response => {
            setMonthAvailability(response.data)
        })

    },[currentMonth, user.id])

    useEffect(()=>{
        api.get(`/providers/${user.id}/days-with-appointments`, {
            params: {
                year: currentMonth.getFullYear(),
                month: currentMonth.getMonth() + 1
            }
        }).then(response => {
            setDaysWithAppointmentsInMonth(response.data)
        })

    },[currentMonth, user.id])

    useEffect(()=>{
        api.get<Appointment[]>('/appointments/me', {
            params: {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate()
            }
        }).then(response => {
            console.log(response)
            const formattedAppointments = response.data.map(appointment => {
                return {
                    ...appointment,
                    formattedHour: format(parseISO(appointment.date), 'HH:mm')
                }
            })

            setAppointments(formattedAppointments)
        })
    },[selectedDate])

    const handleDateChange = useCallback((day: Date, modifiers: DayModifiers)=>{
        if(modifiers.available && !modifiers.disabled){
            setSelectedDate(day)
        }
    },[])

    const handleMonthChange = useCallback((month: Date)=>{
        setCurrentMonth(month)
    },[])

    return (
        <S.Container>
            <S.Header>
                <S.HeaderContent>
                    <img src={Logo} alt="GoBarber"/>

                    <S.Profile>
                        <Link to="/profile">
                        <img 
                            src={user.avatar_url 
                                ? 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png'
                                : 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png' 
                            } 
                            alt={user.name}
                        />
                        </Link>
                        <div>
                            <span>Bem-vindo!</span>
                            <Link to="/profile"><strong>{user.name}</strong></Link>
                        </div>
                    </S.Profile>
                    
                    <div className="right-container">
                        <Switch
                            onChange={()=>{toggleTheme(); console.log(theme)}}
                            checked={theme.title === 'light' ? true : false}
                            checkedIcon={false}
                            uncheckedIcon={false}
                            offColor="#3E3B47"
                            onColor="#FF9000"
                        />
                        <button type="button" onClick={signOut}>
                            <FiPower color="#999591" size={20}/>
                        </button>
                    </div>
                </S.HeaderContent>
            </S.Header>
            <S.Content>
                <S.Schedule>
                    <h1>Horários agendados</h1>
                    <p>
                        {isToday(selectedDate) && (<span>Hoje</span>)}
                        <span>{selectedDateAsText}</span>
                        <span>{selectedWeekDay}</span>
                    </p>

                    {isToday(selectedDate) && nextAppointment && (
                        <S.NextAppointment>
                            <strong>Agendamento a seguir</strong>
                            <div>
                                <img 
                                    src={nextAppointment.user.avatar_url 
                                        ? nextAppointment.user.avatar_url 
                                        : 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png' 
                                    } 
                                    alt={nextAppointment.user.name}
                                />
                                
                                <strong>{nextAppointment.user.name}</strong>
                                <span>
                                    <FiClock/>
                                    {nextAppointment.formattedHour}
                                </span>
                            </div>
                        </S.NextAppointment>
                    )}
                    

                    <S.Section>
                        <strong>Manhã</strong>

                        {morningAppointments.length === 0 && (
                            <p>Nenhum agendamento neste período.</p>
                        )}

                        {morningAppointments.map(appointment => (
                            <S.Appointment key={appointment.id}>
                                <span>
                                    <FiClock/>
                                    {appointment.formattedHour}
                                </span>

                                <div>
                                    <img 
                                        src={appointment.user.avatar_url 
                                            ? appointment.user.avatar_url 
                                            : 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png' 
                                        } 
                                        alt={appointment.user.name}
                                    />
                                    <strong>{appointment.user.name}</strong>
                                </div>
                            </S.Appointment>
                        ))}

                    </S.Section>
                    <S.Section>
                        <strong>Tarde</strong>
                        
                        {afternoonAppointments.length === 0 && (
                            <p>Nenhum agendamento neste período.</p>
                        )}

                        {afternoonAppointments.map(appointment => (
                            <S.Appointment key={appointment.id}>
                                <span>
                                    <FiClock/>
                                    {appointment.formattedHour}
                                </span>

                                <div>
                                    <img 
                                        src={appointment.user.avatar_url 
                                            ? appointment.user.avatar_url 
                                            : 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png' 
                                        } 
                                        alt={appointment.user.name}
                                    />
                                    <strong>{appointment.user.name}</strong>
                                </div>
                            </S.Appointment>
                        ))}
                    </S.Section>

                </S.Schedule>
                <S.Calendar>
                    <DayPicker 
                        fromMonth={new Date()}
                        weekdaysShort={['D','S','T','Q','Q','S','S']}
                        disabledDays={[{daysOfWeek: [0, 6]}, ...disabledDays]}
                        modifiers={{
                            available: {daysOfWeek: [1,2,3,4,5]}
                        }}
                        selectedDays={selectedDate}
                        onDayClick={handleDateChange}
                        onMonthChange={handleMonthChange}
                        months={[
                            'Janeiro',
                            'Fevereiro',
                            'Março',
                            'Abril',
                            'Maio',
                            'Junho',
                            'Julho',
                            'Agosto',
                            'Setembro',
                            'Outubro',
                            'Novembro',
                            'Dezembro'
                        ]}    
                    />
                </S.Calendar>
            </S.Content>
        </S.Container>
    )
}

export default Dashboard