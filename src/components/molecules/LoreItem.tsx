import { Card, Typography, Flex, Divider, Popover } from 'antd'
import { useQueryClient } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import LoreMenu from '../organisms/LoreMenu'
import type { Lore } from '../../api/API'
import { InfoCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

interface LoreItemProps {
  _id: string
}

export default function LoreItem({ _id }: LoreItemProps) {
  const queryClient = useQueryClient()
  const data = queryClient.getQueryData<Lore>(['lore', _id])
  const { title, subtitle, game, createdAt, text } = data || {}

  return (
    <Card
      loading={!data}
      style={{ width: 400, minHeight: 250 }}
      title={
        <Title
          level={4}
          style={{
            margin: 0,
            whiteSpace: 'normal',
            padding: '10px 0',
          }}
        >
          {title}
        </Title>
      }
      extra={
        <Flex gap={15}>
          <Popover
            content={
              <div>
                <Text>
                  Date:{' '}
                  {createdAt && DateTime.fromISO(createdAt).toLocaleString()}
                </Text>
                <Divider style={{ margin: '8px 0' }} />
                <Text>Game: {game}</Text>
                <Divider style={{ margin: '8px 0' }} />
                <Text>Info: {subtitle}</Text>
              </div>
            }
            placement="bottom"
          >
            <InfoCircleOutlined />
          </Popover>
          <LoreMenu _id={_id} aria-label="Lore options" />
        </Flex>
      }
    >
      <Text style={{ whiteSpace: 'pre-wrap' }}>{text}</Text>
    </Card>
  )
}
