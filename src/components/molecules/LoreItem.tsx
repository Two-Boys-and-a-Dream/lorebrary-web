import {
  Card,
  Skeleton,
  Typography,
  Flex,
  Collapse,
  Divider,
  type CollapseProps,
} from 'antd'
import { useQueryClient } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import { LoreMenu } from '../organisms'
import type { Lore } from '../../api'

const { Title, Text } = Typography

interface LoreItemProps {
  isLoaded: boolean
  _id?: string
}

export default function LoreItem({ isLoaded, _id }: LoreItemProps) {
  const queryClient = useQueryClient()
  const data = queryClient.getQueryData<Lore>(['lore', _id])
  const { title, subtitle, game, createdAt, text } = data || {}

  // Show skeleton if not loaded OR if data is not yet in cache
  const showSkeleton = !isLoaded || !data

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Context',
      children: (
        <div>
          <Text>
            Date: {createdAt && DateTime.fromISO(createdAt).toLocaleString()}
          </Text>
          <Divider style={{ margin: '8px 0' }} />
          <Text>Game: {game}</Text>
          <Divider style={{ margin: '8px 0' }} />
          <Text>Info: {subtitle}</Text>
        </div>
      ),
    },
  ]

  return showSkeleton ? (
    <Card style={{ width: 350, minHeight: 300 }}>
      <Skeleton active paragraph={{ rows: 6 }} />
    </Card>
  ) : (
    <Card
      style={{ width: 350, minHeight: 300 }}
      title={
        <Flex justify="space-between" align="center" gap={8}>
          <Title
            level={4}
            style={{
              margin: 0,
              flex: 1,
              whiteSpace: 'normal',
              padding: '10px 0',
            }}
          >
            {title}
          </Title>
          <LoreMenu _id={_id} />
        </Flex>
      }
    >
      <Flex vertical justify="space-between" style={{ minHeight: 200 }}>
        <Text style={{ marginBottom: 20, whiteSpace: 'pre-wrap' }}>{text}</Text>
        <Collapse items={items} ghost />
      </Flex>
    </Card>
  )
}
