import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Flex, Typography } from 'antd'
import API from '../../api/API'
import LoreItem from '../molecules/LoreItem'
import { type Lore } from '../../types/data'

const { Text } = Typography

type LoreOrPlaceholder = Pick<Lore, 'id'> | undefined

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
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return dateB - dateA
      })

      /**
       * Set each individual lore in query cache by id
       */
      sortedLore.forEach((element) =>
        queryClient.setQueryData(['lore', element.id], element)
      )

      return sortedLore
    },
  })

  if (error) {
    return <Text>{error.message}</Text>
  }

  // Create "fake" cards to render skeletons for while loading
  const loreData: LoreOrPlaceholder[] = !isFetched
    ? Array.from({ length: 20 }, () => undefined)
    : data.map((lore) => ({ id: lore.id }))

  return (
    <Flex gap={40} wrap justify="center">
      {isFetched && data.length === 0 && (
        <Text>No lore entries found. Create the first one!</Text>
      )}
      {loreData.map((item, index) => {
        return <LoreItem key={item?.id || index} id={item?.id} />
      })}
    </Flex>
  )
}
