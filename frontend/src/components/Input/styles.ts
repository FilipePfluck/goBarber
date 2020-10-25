import styled, {css} from 'styled-components'

import Tooltip from '../Tootlip/index'

interface ContainerProps {
    isFocused: boolean
    isFilled: boolean
    isErrored: boolean
}

export const Container = styled.div<ContainerProps>`

    background: ${props => props.theme.colors.inputs};
    border-radius: 10px;
    padding: 0 16px;
    width: 100%;
    margin-bottom: 8px;
    
    color: ${props => props.theme.colors.unimportant};
    border: 2px solid ${props => props.theme.colors.inputs};

    display: flex;
    align-items: center;

    ${props => props.isErrored && css`
        border-color: #c53030;
    `}

    ${props => props.isFocused && css`
        color: ${props => props.theme.colors.primary};
        border-color: ${props => props.theme.colors.primary};
    `}

    ${props => props.isFilled && css`
        color: ${props => props.theme.colors.primary};
    `}

    input {
        flex: 1;
        background: transparent;
        border: 0;
        color: ${props => props.theme.colors.title};
        min-height: 48px;

        &::placeholder{
            color: ${props => props.theme.colors.unimportant};
        }
    }

    svg{
        margin-right: 8px;
    }
`

export const Error = styled(Tooltip)`
    svg {
        margin: 0;
        margin-left: 16px;
    }

    span{
        background: #c53030;

        &::before{
            border-color: #c53030 transparent;
        }
    }
`

