import { Flex, theme, useColorModeValue } from '@chakra-ui/react'
import { ThemeButton } from '../atoms'
import NewLoreModal from './NewLoreModal'

export default function Navbar() {
    const borderColor = useColorModeValue(
        theme.colors.gray[200],
        theme.colors.gray[500]
    )
    const bgColor = useColorModeValue(
        theme.colors.white,
        theme.colors.gray[800]
    )

    return (
        <Flex
            p={theme.space[5]}
            borderBottom={theme.borders['1px']}
            borderBottomColor={borderColor}
            justify="flex-end"
            gap={theme.space[5]}
            position="sticky"
            bgColor={bgColor}
            zIndex={2}
            top={0}
        >
            <NewLoreModal />
            <ThemeButton />
        </Flex>
    )
}
