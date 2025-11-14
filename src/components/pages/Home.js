import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Flex, Text, theme } from '@chakra-ui/react'
import { API } from '../../api'
import { LoreItem } from '../molecules'

export default function Home() {
  const queryClient = useQueryClient()
  const { data, isLoading, isFetched, error } = useQuery({
    queryKey: ['lore'],
    queryFn: async () => {
      const lore = await API.getAllLore()

      /**
       * Set each individual lore in query cache by id
       */
      lore.forEach((element) =>
        queryClient.setQueryData(['lore', element._id], element)
      )

      return lore
    },
  })

  if (error) return <Text>{error}</Text>

  // Create "fake" cards to render skeletons for while loading
  const loreData = !isFetched
    ? Array.from({ length: 20 }, (_v, i) => ({
        indexKey: i,
      }))
    : data

  return (
    <Flex gap={theme.space[10]} wrap="wrap" justify="center">
      {loreData?.map((d) => (
        <LoreItem key={d._id || d.indexKey} _id={d._id} isLoaded={!isLoading} />
      ))}
    </Flex>
  )
}
