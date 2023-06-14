import { Flex, theme } from '@chakra-ui/react'
import { Navbar } from '../organisms'

export default function MainLayout({ children }) {
    return (
        <Flex direction="column">
            <Navbar />
            <Flex direction="column" p={theme.space[10]}>
                {children}
            </Flex>
        </Flex>
    )
}
