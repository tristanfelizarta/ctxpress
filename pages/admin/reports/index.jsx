import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from 'instance'
import {
    Avatar,
    Badge,
    Button,
    chakra,
    Container,
    Divider,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Icon,
    IconButton,
    Input,
    Select,
    Td,
    Text,
    Tr,
    useDisclosure,
    useToast
} from '@chakra-ui/react'
import {
    FiDownloadCloud,
    FiFolder,
    FiMoreHorizontal,
    FiPlus,
    FiTrash2
} from 'react-icons/fi'
import Card from 'components/card'
import Modal from 'components/modal'
import Table from 'components/table'
import Toast from 'components/toast'
import { months } from 'functions/months'

const AddReportTypeModal = () => {
    const queryClient = useQueryClient()
    const { data: types, isFetched: isTypesFetched } = useQuery(
        ['report-types'],
        () => api.all('/reports/types')
    )
    const disclosure = useDisclosure()
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const {
        register,
        formState: { errors },
        clearErrors,
        reset,
        handleSubmit
    } = useForm()

    const addReportType = useMutation(
        (data) => api.create('/reports/types', data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('report-types')
                setIsLoading(false)

                toast({
                    position: 'top',
                    duration: 1000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="Report type successfully added."
                        />
                    )
                })
            }
        }
    )

    const deleteReportType = useMutation(
        (data) => api.remove('/reports/types', data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('report-types')
                setIsLoading(false)

                toast({
                    position: 'top',
                    duration: 1000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="Report type successfully added."
                        />
                    )
                })
            }
        }
    )

    const onSubmit = (data) => {
        setIsLoading(true)
        clearErrors()
        reset()

        addReportType.mutate({
            name: data.name.toLowerCase()
        })
    }

    const onDelete = (data) => {
        setIsLoading(true)
        deleteReportType.mutate(data)
    }

    return (
        <Modal
            title="Add Report Type"
            size="xl"
            toggle={(onOpen) => (
                <Button
                    variant="tinted"
                    size="lg"
                    colorScheme="brand"
                    isLoading={isLoading}
                    onClick={() => clearErrors() || reset() || onOpen()}
                >
                    Add Report Type
                </Button>
            )}
            disclosure={disclosure}
        >
            <Flex direction="column" gap={6}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Flex gap={6}>
                        <FormControl isInvalid={errors.name}>
                            <Input
                                placeholder="Enter request type"
                                size="lg"
                                {...register('name', { required: true })}
                            />
                            <FormErrorMessage>
                                This field is required.
                            </FormErrorMessage>
                        </FormControl>

                        <IconButton
                            type="submit"
                            variant="tinted"
                            size="lg"
                            colorScheme="brand"
                            icon={<FiPlus size={16} />}
                        />
                    </Flex>
                </form>

                <Divider />

                <Table
                    data={types}
                    fetched={isTypesFetched}
                    th={[]}
                    td={(type) => (
                        <Tr key={type._id}>
                            <Td textTransform="capitalize">{type.name}</Td>

                            <Td textAlign="right">
                                <IconButton
                                    variant="tinted"
                                    size="xs"
                                    colorScheme="red"
                                    icon={<FiTrash2 size={12} />}
                                    onClick={() => onDelete(type._id)}
                                />
                            </Td>
                        </Tr>
                    )}
                    settings={{
                        search: 'off'
                    }}
                />
            </Flex>
        </Modal>
    )
}

const ViewModal = ({ session, users, report }) => {
    const queryClient = useQueryClient()
    const disclosure = useDisclosure()
    const [isLoading, setIsLoading] = useState(false)

    const editReport = useMutation(
        (data) => api.update('/reports', report._id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('employee_reports')
                setIsLoading(false)
            }
        }
    )

    const onSubmit = () => {
        setIsLoading(true)

        editReport.mutate({
            status: 'read'
        })
    }

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
                                <chakra.a
                                    href={report.file.url}
                                    onClick={onSubmit}
                                >
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

const Reports = () => {
    const { data: session } = useSession()
    const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () =>
        api.all('/users')
    )
    const { data: reports, isFetched: isReportsFetched } = useQuery(
        ['reports'],
        () => api.all('/reports')
    )

    return (
        <Container>
            <Card>
                <Flex direction="column" gap={6}>
                    <Flex justify="space-between" align="center" gap={6}>
                        <Text
                            fontSize="xl"
                            fontWeight="semibold"
                            color="accent-1"
                        >
                            Reports
                        </Text>

                        <AddReportTypeModal />
                    </Flex>

                    <Divider />

                    <Table
                        data={reports}
                        fetched={isUsersFetched && isReportsFetched}
                        th={[
                            'Employee',
                            'Report Type',
                            'Description',
                            'Status',
                            'Created',
                            ''
                        ]}
                        td={(report) => (
                            <Tr key={report._id}>
                                <Td>
                                    {users
                                        .filter(
                                            (user) =>
                                                user._id === report.user.id
                                        )
                                        .map((user) => (
                                            <Flex
                                                align="center"
                                                gap={3}
                                                key={user._id}
                                            >
                                                <Avatar
                                                    name={user.name}
                                                    src={user.image}
                                                />
                                                <Text>{user.name}</Text>
                                            </Flex>
                                        ))}
                                </Td>

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
                                        {
                                            report.created
                                                .split(',')[0]
                                                .split('/')[1]
                                        }
                                        ,{' '}
                                        {
                                            report.created
                                                .split(',')[0]
                                                .split('/')[2]
                                        }
                                    </Text>
                                </Td>

                                <Td textAlign="right">
                                    <ViewModal
                                        session={session}
                                        users={users}
                                        report={report}
                                    />
                                </Td>
                            </Tr>
                        )}
                        select={(register) => (
                            <Flex flex={1} justify="end" align="center" gap={3}>
                                <Select
                                    placeholder="Status"
                                    size="lg"
                                    w="auto"
                                    {...register('status')}
                                >
                                    <chakra.option value="unread">
                                        Unread
                                    </chakra.option>
                                    <chakra.option value="read">
                                        Read
                                    </chakra.option>
                                </Select>
                            </Flex>
                        )}
                        filters={(data, watch) => {
                            return data
                                .filter((data) =>
                                    ['type', 'description'].some((key) =>
                                        data[key]
                                            .toString()
                                            .toLowerCase()
                                            .includes(
                                                watch('search') &&
                                                    watch(
                                                        'search'
                                                    ).toLowerCase()
                                            )
                                    )
                                )
                                .filter((data) =>
                                    watch('status')
                                        ? watch('status') === data.status
                                        : data
                                )
                        }}
                        effects={(watch) => [watch('status')]}
                    />
                </Flex>
            </Card>
        </Container>
    )
}

export default Reports
