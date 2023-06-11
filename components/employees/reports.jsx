import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from 'instance'
import {
    Avatar,
    Badge,
    chakra,
    Divider,
    Flex,
    Icon,
    IconButton,
    Select,
    Td,
    Text,
    Tr,
    useDisclosure
} from '@chakra-ui/react'
import { FiDownloadCloud, FiFolder, FiMoreHorizontal } from 'react-icons/fi'
import Card from 'components/card'
import Modal from 'components/modal'
import Table from 'components/table'
import { months } from 'functions/months'

const ViewModal = ({ users, report }) => {
    const disclosure = useDisclosure()

    return (
        <Modal
            title="Report Information"
            size="xl"
            toggle={(onOpen) => (
                <IconButton
                    size="xs"
                    icon={<FiMoreHorizontal size={12} />}
                    onClick={onOpen}
                />
            )}
            disclosure={disclosure}
        >
            <Flex direction="column" gap={6}>
                <Flex
                    direction="column"
                    gap={6}
                    position="relative"
                    border="1px solid"
                    borderColor="border"
                    borderRadius={12}
                    p={6}
                >
                    <Flex justify="space-between" align="center" gap={6}>
                        {users
                            .filter((user) => user._id === report.user.id)
                            .map((user) => (
                                <Flex
                                    align="center"
                                    gap={3}
                                    key={user._id}
                                    w="calc(100% - 96px)"
                                >
                                    <Avatar name={user.name} src={user.image} />

                                    <Text
                                        fontSize="sm"
                                        fontWeight="medium"
                                        color="accent-1"
                                        noOfLines={1}
                                    >
                                        {user.name}
                                    </Text>
                                </Flex>
                            ))}

                        <Badge
                            variant="tinted"
                            textTransform="capitalize"
                            colorScheme={
                                report.status === 'read' ? 'brand' : 'red'
                            }
                        >
                            {report.status}
                        </Badge>
                    </Flex>

                    <Divider />

                    <Flex
                        align="center"
                        gap={3}
                        opacity={report.status === 'cancelled' ? 0.5 : 1}
                    >
                        <Flex flex={1} align="center" gap={3}>
                            <Icon as={FiFolder} boxSize={8} color="accent-1" />

                            <Flex direction="column" w="calc(100% - 88px)">
                                <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    textDecoration={
                                        report.status === 'cancelled' &&
                                        'line-through'
                                    }
                                    color="accent-1"
                                    noOfLines={1}
                                >
                                    {report.file.name}
                                </Text>

                                <Text fontSize="xs">
                                    {report.file.size.toLocaleString(
                                        undefined,
                                        { maximumFractionDigits: 2 }
                                    ) + ' '}
                                    {report.file.size >= 1 &&
                                        report.file.size <= 999 &&
                                        'B'}
                                    {report.file.size >= 1000 &&
                                        report.file.size <= 999999 &&
                                        'KB'}
                                    {report.file.size >= 1000000 &&
                                        report.file.size <= 999999999 &&
                                        'MB'}
                                </Text>
                            </Flex>
                        </Flex>

                        <Flex position="absolute" right={6}>
                            {report.status === 'cancelled' ? (
                                <IconButton
                                    size="xs"
                                    cursor="not-allowed"
                                    icon={<FiDownloadCloud size={16} />}
                                />
                            ) : (
                                <chakra.a href={report.file.url}>
                                    <IconButton
                                        size="xs"
                                        icon={<FiDownloadCloud size={16} />}
                                    />
                                </chakra.a>
                            )}
                        </Flex>
                    </Flex>

                    <Divider />

                    <Flex justify="space-between" align="center" gap={6}>
                        <Text fontSize="xs" textAlign="center">
                            {report._id.slice(0, 10).toUpperCase()}
                        </Text>

                        <Text fontSize="xs">{report.created.split(',')}</Text>
                    </Flex>
                </Flex>
            </Flex>
        </Modal>
    )
}

const Reports = ({ user }) => {
    const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () =>
        api.all('/users')
    )
    const { data: reports, isFetched: isReportsFetched } = useQuery(
        ['employee_reports'],
        () => api.get('reports/employee', user._id)
    )
    const { register, watch } = useForm()

    return (
        <Card>
            <Flex direction="column" gap={6}>
                <Flex justify="space-between" align="center" gap={6}>
                    <Text fontSize="xl" fontWeight="semibold" color="accent-1">
                        Reports
                    </Text>

                    <Flex flex={1} justify="end" align="center" gap={3}>
                        <Select
                            placeholder="Status"
                            size="lg"
                            w="auto"
                            {...register('status')}
                        >
                            <chakra.option value="unread">Unread</chakra.option>
                            <chakra.option value="read">Read</chakra.option>
                        </Select>
                    </Flex>
                </Flex>

                <Divider />

                <Table
                    data={reports}
                    fetched={isUsersFetched && isReportsFetched}
                    th={['Type', 'Description', 'Status', 'Created', '']}
                    td={(report) => (
                        <Tr key={report._id}>
                            <Td>
                                <Text textTransform="capitalize">
                                    {report.type}
                                </Text>
                            </Td>

                            <Td>
                                <Text textTransform="capitalize">
                                    {report.description}
                                </Text>
                            </Td>

                            <Td>
                                <Badge
                                    variant="tinted"
                                    textTransform="capitalize"
                                    colorScheme={
                                        report.status === 'read'
                                            ? 'brand'
                                            : 'red'
                                    }
                                >
                                    {report.status}
                                </Badge>
                            </Td>

                            <Td>
                                <Text>
                                    {
                                        months[
                                            report.created
                                                .split(',')[0]
                                                .split('/')[0] - 1
                                        ]
                                    }{' '}
                                    {report.created.split(',')[0].split('/')[1]}
                                    ,{' '}
                                    {report.created.split(',')[0].split('/')[2]}
                                </Text>
                            </Td>

                            <Td textAlign="right">
                                <ViewModal users={users} report={report} />
                            </Td>
                        </Tr>
                    )}
                    filters={(data) => {
                        return data.filter((data) =>
                            watch('status')
                                ? watch('status') === data.status
                                : data
                        )
                    }}
                    effects={(watch) => [watch('status')]}
                    settings={{
                        search: 'off',
                        show: [5]
                    }}
                />
            </Flex>
        </Card>
    )
}

export default Reports
