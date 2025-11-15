import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Flex, Typography } from 'antd'
import { API, type Lore } from '../../api'
import { LoreItem } from '../molecules'

const { Text } = Typography

type LoreOrPlaceholder = Lore | Pick<Lore, '_id'>

export default function HomePage() {
  const queryClient = useQueryClient()
  const {
    data = [],
    isFetched,
    error,
  } = useQuery({
    queryKey: ['lore'],
    queryFn: async () => {
      const lore = await API.getAllLore()

      // Sort lore by createdAt date (newest first)
      // Create a copy to avoid mutating the original array
      const sortedLore = [...lore].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime()
        const dateB = new Date(b.createdAt || 0).getTime()
        return dateB - dateA
      })

      /**
       * Set each individual lore in query cache by id
       */
      sortedLore.forEach((element) =>
        queryClient.setQueryData(['lore', element._id], element)
      )

      return sortedLore
    },
  })
  if (error) {
    return <Text>{error.message}</Text>
  }

  // Create "fake" cards to render skeletons for while loading
  const loreData: LoreOrPlaceholder[] = !isFetched
    ? Array.from({ length: 20 }, (_v, i) => ({
        _id: String(i),
      }))
    : data.map((lore) => ({ _id: lore._id }))

  return (
    <Flex gap={40} wrap justify="center">
      {loreData.map(({ _id }) => {
        return <LoreItem key={_id} _id={_id} />
      })}
    </Flex>
  )
}
