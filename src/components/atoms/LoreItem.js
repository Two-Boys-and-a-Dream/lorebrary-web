import { InfoIcon } from '@chakra-ui/icons'
import {
    Card,
    CardBody,
    CardHeader,
    Divider,
    Flex,
    Heading,
    Skeleton,
    Text,
    Tooltip,
} from '@chakra-ui/react'
import { DateTime } from 'luxon'

export default function LoreItem({
    title,
    subtitle,
    game,
    createdAt,
    text,
    isLoaded,
}) {
    const tooltipLabel = (
        <>
            <Text>Date: {DateTime.fromISO(createdAt).toLocaleString()}</Text>
            <Text>Game: {game}</Text>
        </>
    )
    return (
        <Skeleton isLoaded={isLoaded}>
            <Card w={350} minH={300}>
                <CardHeader>
                    <Flex justify="space-between" align="center">
                        <Heading size="md">{title}</Heading>
                        <Tooltip label={tooltipLabel}>
                            <InfoIcon />
                        </Tooltip>
                    </Flex>

                    <Heading size="sm">{subtitle}</Heading>
                </CardHeader>
                <Divider />
                <CardBody>
                    <Text>{text}</Text>
                </CardBody>
            </Card>
        </Skeleton>
    )
}
