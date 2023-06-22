import { useQuery } from '@tanstack/react-query'
import { Flex, Text, theme } from '@chakra-ui/react'
import { API } from '../../api'
import { LoreItem } from '../molecules'

export default function Home() {
    const { data, isLoading, isFetched, error } = useQuery({
        queryKey: ['lore'],
        queryFn: () => API.getAllLore(),
    })

    if (error) return <Text>{error}</Text>

    // Create "fake" cards to render skeletons for while loading
    const loreData = !isFetched
        ? Array.from({ length: 20 }, (_v, i) => ({
              _id: i,
          }))
        : data

    return (
        <Flex gap={theme.space[10]} wrap="wrap" justify="center">
            {loreData?.map((d) => (
                <LoreItem key={d._id} {...d} isLoaded={!isLoading} />
            ))}
        </Flex>
    )
}
