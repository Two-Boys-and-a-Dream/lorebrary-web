import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Flex, Text, theme } from '@chakra-ui/react'
import { API, Lore } from '../../api'
import { LoreItem } from '../molecules'

type LoreOrPlaceholder = Lore | { indexKey: number; _id: undefined }

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

  if (error) return <Text>{String(error)}</Text>

  // Create "fake" cards to render skeletons for while loading
  const loreData: LoreOrPlaceholder[] = !isFetched
    ? Array.from({ length: 20 }, (_v, i) => ({
        indexKey: i,
        _id: undefined,
      }))
    : data || []

  return (
    <Flex gap={theme.space[10]} wrap="wrap" justify="center">
      {loreData.map((d) => {
        const key =
          '_id' in d && d._id ? d._id : 'indexKey' in d ? d.indexKey : 0
        const _id = '_id' in d && d._id ? d._id : undefined
        return <LoreItem key={key} _id={_id} isLoaded={!isLoading} />
      })}
    </Flex>
  )
}
