import styled  from 'styled-components'

export const Container = styled.div`
    >header{
        width: 100%;
        height: 144px;
        background: ${props => props.theme.colors.details};
        position: absolute;
        top: 0;
        z-index: -1;

        display:flex;
        align-items: center;

        div{
            width: 100%;
            max-width: 1120px;
            margin: 0 auto;
            padding: 0 24px;
        }
    }
`

export const Content = styled.aside`
    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    width: 100%;

    margin: 0 auto;

    form {
        display: flex;
        flex-direction: column;

        margin: 80px 0px;
        width: 340px;
        text-align: center;

        h1 {
            margin-bottom: 24px;
            font-size: 20px;
            text-align: left;
        }

        a{
            color: ${props => props.theme.colors.title};
            text-decoration: none;
            display: block;
            margin-top: 24px;
            transition: 0.2s;
            
            &:hover{
                filter: brightness(0.8)
            }
        }

        input[name="old_password"] {
            margin-top: 24px;
        }
    }

    > a{
        color: ${props => props.theme.colors.primary};
        text-decoration: none;
        display: block;
        margin-top: 24px;
        transition: 0.2s;
        display: flex;
        align-items: center;

        &:hover{
            filter: brightness(0.8)
        }

        svg{
            margin-right: 8px;
        }
    }
`

export const AvatarInput = styled.div`
    margin-bottom: 32px;
    position: relative;
    width: 186px;
    align-self: center;

    img{
        width: 186px;
        border-radius: 50%;
    }

    label {
        position: absolute;
        right: 0;
        bottom: 0;

        height: 48px;
        width: 48px;
        background: ${props => props.theme.colors.primary};
        border: none;
        border-radius: 50%;
        transition: 0.2s;
        cursor: pointer;

        display: flex;
        align-items: center;
        justify-content: center;
        
        &:hover{


            filter:brightness(0.8)
        }

        input {
            display: none;
        }
    }
`