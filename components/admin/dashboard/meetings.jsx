import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Badge, Flex, IconButton, Link, Td, Text, Tr } from '@chakra-ui/react'
import { FiMoreHorizontal } from 'react-icons/fi'
import Card from 'components/card'
import Table from 'components/table'
import { months } from 'functions/months'

const Meetings = () => {
    const { data: meetings, isFetched: isMeetingsFetched } = useQuery(
        ['meetings'],
        () => api.all('/meetings')
    )

    return (
        <Card>
            <Flex direction="column" gap={6}>
                <Flex justify="space-between" align="center" gap={6}>
                    <Text fontSize="xl" fontWeight="semibold" color="accent-1">
                        Meetings
                    </Text>

                    <IconButton
                        size="xs"
                        icon={<FiMoreHorizontal size={12} />}
                    />
                </Flex>

                <Table
                    data={meetings}
                    fetched={isMeetingsFetched}
                    th={[
                        'Description',
                        'Department',
                        'Date',
                        'Time',
                        'File',
                        'Created'
                    ]}
                    td={(meeting) => (
                        <Tr key={meeting._id}>
                            <Td>
                                <Text textTransform="capitalize">
                                    {meeting.description}
                                </Text>
                            </Td>

                            <Td>
                                <Text textTransform="capitalize">
                                    {meeting.department}
                                </Text>
                            </Td>

                            <Td>
                                <Text>
                                    {months[meeting.date.split('-')[1] - 1]}{' '}
                                    {meeting.date.split('-')[2]},{' '}
                                    {meeting.date.split('-')[0]}
                                </Text>
                            </Td>

                            <Td>
                                <Text>{meeting.time}</Text>
                            </Td>

                            <Td>
                                {meeting.file.url ? (
                                    <Link
                                        textTransform="lowercase"
                                        href={meeting.file.url}
                                    >
                                        <Badge
                                            color="currentcolor"
                                            cursor="pointer"
                                        >
                                            {meeting.file?.url?.split('/')[6]}.
                                            {
                                                meeting.file?.url
                                                    ?.split('/')[7]
                                                    ?.split('.')[1]
                                            }
                                        </Badge>
                                    </Link>
                                ) : null}
                            </Td>

                            <Td>
                                <Text>
                                    {
                                        months[
                                            meeting.created
                                                .split(',')[0]
                                                .split('/')[0] - 1
                                        ]
                                    }{' '}
                                    {
                                        meeting.created
                                            .split(',')[0]
                                            .split('/')[1]
                                    }
                                    ,{' '}
                                    {
                                        meeting.created
                                            .split(',')[0]
                                            .split('/')[2]
                                    }
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

export default Meetings
