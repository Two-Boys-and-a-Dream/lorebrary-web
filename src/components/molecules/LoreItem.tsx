import { Card, Skeleton, Typography, Flex, Collapse, Divider } from 'antd'
import { useQueryClient } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import { LoreMenu } from '../organisms'
import type { Lore } from '../../api'

const { Title, Text } = Typography
const { Panel } = Collapse

interface LoreItemProps {
  isLoaded: boolean
  _id?: string
}

export default function LoreItem({ isLoaded, _id }: LoreItemProps) {
  const queryClient = useQueryClient()
  const data = queryClient.getQueryData<Lore>(['lore', _id])
  const { title, subtitle, game, createdAt, text } = data || {}

  return (
    <Skeleton loading={!isLoaded} active>
      <Card
        style={{ width: 350, minHeight: 300 }}
        title={
          <Flex justify="space-between" align="center">
            <Title level={4} style={{ margin: 0 }}>
              {title}
            </Title>
            <LoreMenu _id={_id} />
          </Flex>
        }
      >
        <Flex vertical justify="space-between" style={{ minHeight: 200 }}>
          <Text style={{ marginBottom: 20, whiteSpace: 'pre-wrap' }}>
            {text}
          </Text>
          <Collapse ghost>
            <Panel header="Context" key="1">
              <Text>
                Date:{' '}
                {createdAt && DateTime.fromISO(createdAt).toLocaleString()}
              </Text>
              <Divider style={{ margin: '8px 0' }} />
              <Text>Game: {game}</Text>
              <Divider style={{ margin: '8px 0' }} />
              <Text>Info: {subtitle}</Text>
            </Panel>
          </Collapse>
        </Flex>
      </Card>
    </Skeleton>
  )
}
