import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Skeleton,
  Text,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import { LoreMenu } from '../organisms'
import { API } from '../../api'

export default function LoreItem({ isLoaded, _id }) {
  const { data } = useQuery({
    queryKey: ['lore', _id],
    queryFn: () => API.getLoreById(_id),
    enabled: Boolean(_id),
  })
  const { title, subtitle, game, createdAt, text } = data || {}

  return (
    <Skeleton isLoaded={isLoaded}>
      <Card w={350} minH={300}>
        <CardHeader>
          <Flex justify="space-between" align="center">
            <Heading size="md">{title}</Heading>
            <LoreMenu _id={_id} />
          </Flex>
        </CardHeader>

        <Divider />

        <CardBody
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Text mb={5} whiteSpace="pre-wrap">
            {text}
          </Text>
          <Accordion allowToggle>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    Context
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text>
                  Date: {DateTime.fromISO(createdAt).toLocaleString()}
                </Text>
                <Text>Game: {game}</Text>
                <Text>Info: {subtitle}</Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </CardBody>
      </Card>
    </Skeleton>
  )
}
