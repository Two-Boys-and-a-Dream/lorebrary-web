import { useQuery } from '@tanstack/react-query'
import { Flex } from '@chakra-ui/react'
import { API } from '../../api'
import { LoreItem } from '../atoms'

export default function Home() {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['lore'],
        queryFn: () => API.getAllLore(),
    })

    console.log(isLoading, isError, error)
    return (
        <Flex>
            {data?.map((d) => (
                <LoreItem key={d._id} {...d} />
            ))}
        </Flex>
    )
}
