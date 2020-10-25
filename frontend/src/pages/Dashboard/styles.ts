import styled from 'styled-components'
import { shade } from 'polished'



export const Container = styled.div`
    
`

export const Header = styled.header`
    padding: 32px 24px;
    background: ${props => props.theme.colors.details}; 
`

export const HeaderContent = styled.div`
    max-width: 1120px;
    margin: 0 auto;

    display: flex;
    align-items: center;

    >img {
        height: 80px;

        @media(max-width: 550px){
            height: 0px;
            width: 0px;
            visibility: hidden;
        }
    }

    .right-container{
        margin-left: auto;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    button {
        margin-left: 16px;
        background: transparent;
        border: none;
    }
    
`

export const Profile = styled.div`
    display: flex;
    align-items: center;
    margin-left: 80px;

    @media(max-width: 550px){
        margin-left: 24px;
    }


    img{
        width: 56px;
        height: 56px;
        border-radius: 50%;
        margin-right: 16px;
    }
    
    div{
        display: flex;
        flex-direction: column;
        line-height: 24px;

        span {
            color: ${props => props.theme.colors.title};
        }

        strong {
            color: ${props => props.theme.colors.primary}
        }

        a{
            text-decoration: none;

            &:hover{
                opacity: 0.8
            }
        }

        @media(max-width: 550px){
            visibility: hidden;
        }
    }

`

export const Content = styled.div`
    max-width: 1120px;
    padding: 24px;
    margin: 64px auto;
    display: flex;

    @media(max-width: 800px){
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
`

export const Schedule = styled.aside`
    flex: 1;
    margin-right: 120px;

    h1{
        font-size: 36px;
    }

    p{
        margin-top: 8px;
        color: ${props => props.theme.colors.primary};
        display: flex;
        align-items: center;
        font-weight: 500;
    }

    span{
        display: flex;
        align-items: center;
    }

    span + span::before {
        content: '';
        width: 1px;
        height: 12px;
        background-color: ${props => props.theme.colors.primary};
        margin: 0 8px;
    }

    @media(max-width: 800px){
        margin: 0;
    }
`

export const NextAppointment = styled.div`
    margin-top: 64px;

    > strong {
        color: ${props => props.theme.colors.subtitle};
        font-size: 20px;
        font-weight: 400;
    }

    div{
        background: ${props => props.theme.colors.shape};
        display: flex;
        align-items: center;
        padding: 16px 24px;
        border-radius: 10px;
        margin-top: 24px;
        position: relative;

        &::before{
            content: '';

            position: absolute;
            height: 80%;
            width: 2px;
            background: ${props => props.theme.colors.primary};
            left: 0;
            top: 10%;
        }

        img {
            height: 80px;
            width: 80px;
            border-radius: 50%;
            margin-right: 24px;
        }

        strong {
            color: ${props => props.theme.colors.title};
            font-size: 24px;
        }

        span {
            margin-left: auto;

            display: flex;
            align-items: center;
            color: ${props => props.theme.colors.subtitle};

            svg {
                color: ${props => props.theme.colors.primary};
                margin-right: 8px;
            }
        }
    }
`

export const Section = styled.section`
    margin-top: 48px;

    > strong {
        color: ${props => props.theme.colors.subtitle};
        font-size: 20px;
        line-height: 26px;
        border-bottom: 1px solid ${props => props.theme.colors.shape};
        display: block;
        padding-bottom: 16px;
        margin-bottom: 16px;
    }
`

export const Appointment = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    span {
            margin-left: auto;

            display: flex;
            align-items: center;
            color: ${props => props.theme.colors.title};

            svg {
                color: ${props => props.theme.colors.primary};
                margin-right: 8px;
            }

            >p {
                color: ${props => props.theme.colors.subtitle};
            }
    }
    
    div {
        flex: 1;
        background: ${props => props.theme.colors.shape};
        display: flex;
        align-items: center;
        padding: 16px 24px;
        border-radius: 10px;
        margin-left: 24px;

        img {
            height: 56px;
            border-radius: 50%;
            margin-right: 24px;
        }

        strong {
            color: ${props => props.theme.colors.title};
            font-size: 20px;
        }
    }
`

export const Calendar = styled.div`
    width: 380px;



    .DayPicker {
    background: ${props => props.theme.colors.details};
    border-radius: 10px;
    padding: 32px;
    }

    .DayPicker-wrapper {
    padding-bottom: 0;
    }

    .DayPicker,
    .DayPicker-Month {
    width: 100%;
    }

    .DayPicker-Month {
    border-collapse: separate;
    border-spacing: 8px;
    }

    .DayPicker-Day {
    width: 40px;
    height: 40px;
    }

    .DayPicker-Day--available:not(.DayPicker-Day--outside) {
    background: ${props => props.theme.colors.shape};
    border-radius: 10px;
    color: #fff;
    }

    .DayPicker:not(.DayPicker--interactionDisabled)
    .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover {
    background: ${shade(0.2, '#3e3b47')};
    }

    .DayPicker-Day--today {
    font-weight: normal;
    }

    .DayPicker-Day--disabled {
    color: ${props => props.theme.colors.unimportant} !important;
    background: transparent !important;
    }

    .DayPicker-Day--selected {
    background: ${props => props.theme.colors.primary} !important;
    border-radius: 10px;
    color: ${props => props.theme.colors.details} !important;
    }

    @media(max-width: 800px){
        margin-top: 32px;
    }
`
