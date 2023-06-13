import { Card, CardBody, CardHeader, Heading, Text } from '@chakra-ui/react'

export default function LoreItem({ title, subtitle, game, text }) {
    return (
        <Card>
            <CardHeader>
                <Heading size="md">{title}</Heading>
            </CardHeader>
            <CardBody>
                <Text>{subtitle}</Text>
                <Text>{game}</Text>
                <Text>{text}</Text>
            </CardBody>
        </Card>
    )
}
