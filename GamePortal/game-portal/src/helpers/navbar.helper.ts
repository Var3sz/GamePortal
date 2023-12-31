export interface LinkProps {
    label: string
    children?: Array<LinkProps>
    to?: string
}

export const NAV_LINKS: Array<LinkProps> = [
    {
        label: 'Home',
        to: '/home',
    },
    {
        label: 'Chess',
        children: [
            {
                label: 'Play Offline',
                to: "/chess",
            },
            {
                label: 'Play Online',
                to: '/onlinegame/Chess',
            },
        ],
    },
    {
        label: 'Connect4',
        children: [
            {
                label: 'Play Offline',
                to: '/connect4',
            },
            {
                label: 'Play Online',
                to: '/onlinegame/Connect4',
            },
        ],
    },
    {
        label: "Admin",
        to: "/admin"
    }
]

export default NAV_LINKS;