import React, { useCallback, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Feather'

import { useAuth } from '../../hooks/AuthContext'

import api from '../../services/api'

import * as S from './styles'

export interface Provider{
    id: string,
    name: string,
    avatar_url: string
}

const Dashboard: React.FC = () => {
    const [  providers, setProviders ] = useState<Provider[]>([])

    const { signOut, user } = useAuth()
    const {navigate} = useNavigation()

    useEffect(()=>{
        api.get('providers').then(response => {
            setProviders(response.data)
        })
    },[])

    const navigateToProfile = useCallback(()=>{
        navigate('Profile')
    },[navigate]) 

    const navigateToAppointment = useCallback((providerId:string)=>{
        navigate('CreateAppointment', { providerId })
    },[navigate])

    return (
        <S.Container>
            <S.Header>
                <S.HeaderTitle>
                    Bem vindo, {'\n'}
                    <S.Username>{user.name}</S.Username>
                </S.HeaderTitle>
                <S.ProfileButton onPress={navigateToProfile}>
                    <S.UserAvatar source={
                        {uri: user.avatar_url 
                            ? user.avatar_url 
                            : "https://www.google.com/imgres?imgurl=https%3A%2F%2Fwww.nailseatowncouncil.gov.uk%2Fwp-content%2Fuploads%2Fblank-profile-picture-973460_1280.jpg&imgrefurl=http%3A%2F%2Fcareer.cci.com.tr%2Fblank-profile-picture.html&tbnid=kAhyi7kCBXhf-M&vet=12ahUKEwiK38jSpvjqAhWJDbkGHXqSBKEQMygGegUIARCbAQ..i&docid=-QyOIfAYtiswHM&w=2120&h=2120&itg=1&q=blank%20profile%20picture&client=opera&ved=2ahUKEwiK38jSpvjqAhWJDbkGHXqSBKEQMygGegUIARCbAQ"
                        }
                    }/>
                </S.ProfileButton>
            </S.Header>
            <S.ProvidersList 
                data={providers}
                keyExtractor={provider => provider.id}
                ListHeaderComponent={
                    <S.ProvidersListTitle>Cabeleireiros</S.ProvidersListTitle>
                }
                renderItem={({item: provider})=>(
                    <S.ProviderContainer onPress={()=>{navigateToAppointment(provider.id)}}>
                        <S.ProviderAvatar 
                            source={{ uri: provider.avatar_url ? provider.avatar_url : 'https://cdn.discordapp.com/attachments/399555129826738189/742792468365574215/KP09VUmxBAiI3AAAAAElFTkSuQmCC.png' }} 
                        />
                        <S.ProviderInfo>
                            <S.ProviderName>{provider.name}</S.ProviderName>

                            <S.ProviderMeta>
                                <Icon name="calendar" size={14} color ="#FF9000"/>
                                <S.ProviderMetaText>Segunda à sexta</S.ProviderMetaText>
                            </S.ProviderMeta>
                            <S.ProviderMeta>
                                <Icon name="clock" size={14} color ="#FF9000"/>
                                <S.ProviderMetaText>8h às 18h</S.ProviderMetaText>
                            </S.ProviderMeta>
                        </S.ProviderInfo>
                    </S.ProviderContainer>
                )}
            >

            </S.ProvidersList>
        </S.Container>
    )
}

export default Dashboard