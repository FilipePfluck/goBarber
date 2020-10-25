import styled, {css} from 'styled-components'
import { animated } from 'react-spring'

interface ToastProps{
    type?: 'succes' | 'error'
    hasDescription: boolean
}

const toastTypeVariation = {
    succes: css `
        background: #ff9000;
        color: #fff;
    `,
    error: css `
        background: #c53030;
        color: #fff
    `,
}

export const Container = styled(animated.div)<ToastProps>`
    width: 360px;

    position: relative;
    padding: 16px 30px 16px 16px;
    border-radius: 10px;
    box-shadow: 2px 2px 8px rgb(0,0,0,0.2);
    margin-bottom: 16px;

    display: flex;

    ${(props)=> toastTypeVariation[props.type || "succes"]}

    > svg {
        margin-right: 4px 12px 0 0;
    }

    div{
        flex: 1;
        margin-left: 8px;

        p{
            margin-top: 4px;
            font-size: 14px;
            line-height: 20px;
        }
    }

    button {
        position: absolute;
        right: 16px;
        top: 15px;
        border: 0;
        background: transparent;
        color: inherit;
    }

    ${props => !props.hasDescription && css`
        align-items: center;

        svg{
            margin-top: 0;
        }
    `}
`