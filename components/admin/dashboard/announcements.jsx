import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Flex, IconButton, Td, Text, Tr } from '@chakra-ui/react'
import { FiMoreHorizontal } from 'react-icons/fi'
import Card from 'components/card'
import Table from 'components/table'
import { months } from 'functions/months'

const Announcements = () => {
    const { data: announcements, isFetched: isAnnouncementsFetched } = useQuery(
        ['announcements'],
        () => api.all('/announcements')
    )

    return (
        <Card>
            <Flex direction="column" gap={6}>
                <Flex justify="space-between" align="center" gap={6}>
                    <Text fontSize="xl" fontWeight="semibold" color="accent-1">
                        Announcements
                    </Text>

                    <IconButton
                        size="xs"
                        icon={<FiMoreHorizontal size={12} />}
                    />
                </Flex>

                <Table
                    data={announcements}
                    fetched={isAnnouncementsFetched}
                    th={['Description', 'Date']}
                    td={(announcement) => (
                        <Tr key={announcement._id}>
                            <Td>
                                <Text textTransform="capitalize">
                                    {announcement.description}
                                </Text>
                            </Td>

                            <Td>
                                <Text>
                                    {
                                        months[
                                            announcement.date.split('-')[1] - 1
                                        ]
                                    }{' '}
                                    {announcement.date.split('-')[2]},{' '}
                                    {announcement.date.split('-')[0]}
                                </Text>
                            </Td>
                        </Tr>
                    )}
                    settings={{
                        search: 'off',
                        show: [5]
                    }}
                />
            </Flex>
        </Card>
    )
}

export default Announcements
