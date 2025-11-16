import { Card, Typography, Flex, Divider, Popover } from 'antd'
import LoreMenu from '../organisms/LoreMenu'
import type { Lore } from '../../types/data'
import { InfoCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

interface LoreItemProps {
  lore?: Lore
}

export default function LoreItem({ lore }: LoreItemProps) {
  const { title, subtitle, game, createdAt, text } = lore || {}

  return (
    <Card
      loading={!lore}
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
                  {createdAt &&
                    new Date(createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
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
          <LoreMenu lore={lore} aria-label="Lore options" />
        </Flex>
      }
    >
      <Text style={{ whiteSpace: 'pre-wrap' }}>{text}</Text>
    </Card>
  )
}
