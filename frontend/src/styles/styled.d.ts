import 'styled-components'

declare module 'styled-components' {
    export interface DefaultTheme {
        title: string,

        colors: {
            primary: string,

            background: string,
            details: string,
            shape: string,
            inputs: string,

            title: string,
            subtitle: string,
            unimportant: string,
        }
    }
}