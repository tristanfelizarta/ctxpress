import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from 'instance'
import {
    Avatar,
    Badge,
    Button,
    chakra,
    Divider,
    Flex,
    Icon,
    IconButton,
    Select,
    Td,
    Text,
    Tr,
    useDisclosure,
    useToast
} from '@chakra-ui/react'
import { FiDownloadCloud, FiFolder, FiMoreHorizontal } from 'react-icons/fi'
import Card from 'components/card'
import Modal from 'components/modal'
import Table from 'components/table'
import Toast from 'components/toast'
import { months } from 'functions/months'

const ViewModal = ({ users, request }) => {
    const queryClient = useQueryClient()
    const disclosure = useDisclosure()
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const editRequest = useMutation(
        (data) => api.update('/requests', request._id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('employee_requests')
                setIsLoading(false)
                disclosure.onClose()

                toast({
                    position: 'top',
                    duration: 1000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="Request cancelled successfully."
                        />
                    )
                })
            }
        }
    )

    const onSubmit = () => {
        setIsLoading(true)

        editRequest.mutate({
            status: 'cancelled'
        })
    }

    return (
        <Modal
            title="Request Information"
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
                            .filter((user) => user._id === request.user.id)
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
                                request.status === 'approved'
                                    ? 'brand'
                                    : request.status === 'rejected'
                                    ? 'red'
                                    : request.status === 'waiting'
                                    ? 'yellow'
                                    : request.status === 'cancelled' && 'red'
                            }
                        >
                            {request.status}
                        </Badge>
                    </Flex>

                    <Divider />

                    <Flex
                        align="center"
                        gap={3}
                        opacity={request.status === 'cancelled' ? 0.5 : 1}
                    >
                        <Flex flex={1} align="center" gap={3}>
                            <Icon as={FiFolder} boxSize={8} color="accent-1" />

                            <Flex direction="column" w="calc(100% - 88px)">
                                <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    textDecoration={
                                        request.status === 'cancelled' &&
                                        'line-through'
                                    }
                                    color="accent-1"
                                    noOfLines={1}
                                >
                                    {request.file.name}
                                </Text>

                                <Text fontSize="xs">
                                    {request.file.size.toLocaleString(
                                        undefined,
                                        { maximumFractionDigits: 2 }
                                    ) + ' '}
                                    {request.file.size >= 1 &&
                                        request.file.size <= 999 &&
                                        'B'}
                                    {request.file.size >= 1000 &&
                                        request.file.size <= 999999 &&
                                        'KB'}
                                    {request.file.size >= 1000000 &&
                                        request.file.size <= 999999999 &&
                                        'MB'}
                                </Text>
                            </Flex>
                        </Flex>

                        <Flex position="absolute" right={6}>
                            {request.status === 'cancelled' ? (
                                <IconButton
                                    size="xs"
                                    cursor="not-allowed"
                                    icon={<FiDownloadCloud size={16} />}
                                />
                            ) : (
                                <chakra.a href={request.file.url}>
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
                            {request._id.slice(0, 10).toUpperCase()}
                        </Text>

                        <Text fontSize="xs">
                            {request.status !== 'cancelled'
                                ? request.created.split(',')
                                : request.cancelled.date}
                        </Text>
                    </Flex>
                </Flex>

                {request.status === 'approved' && (
                    <Flex
                        direction="column"
                        gap={6}
                        position="relative"
                        border="1px dashed"
                        borderColor="brand.default"
                        borderRadius={12}
                        p={6}
                    >
                        <Flex justify="space-between" align="center" gap={6}>
                            {users
                                .filter(
                                    (user) => user._id === request.approved.by
                                )
                                .map((user) => (
                                    <Flex
                                        align="center"
                                        gap={3}
                                        key={user._id}
                                        w="calc(100% - 96px)"
                                    >
                                        <Avatar
                                            name={user.name}
                                            src={user.image}
                                        />

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
                                    request.status === 'approved'
                                        ? 'brand'
                                        : request.status === 'rejected'
                                        ? 'red'
                                        : request.status === 'waiting'
                                        ? 'yellow'
                                        : request.status === 'cancelled' &&
                                          'red'
                                }
                            >
                                {request.status}
                            </Badge>
                        </Flex>

                        <Divider />

                        <Flex align="center" gap={3}>
                            <Flex flex={1} align="center" gap={3}>
                                <Icon
                                    as={FiFolder}
                                    boxSize={8}
                                    color="brand.default"
                                />

                                <Flex direction="column" w="calc(100% - 88px)">
                                    <Text
                                        fontSize="sm"
                                        fontWeight="medium"
                                        color="accent-1"
                                        noOfLines={1}
                                    >
                                        {request.approved.file.name}
                                    </Text>

                                    <Text fontSize="xs">
                                        {request.approved.file.size.toLocaleString(
                                            undefined,
                                            { maximumFractionDigits: 2 }
                                        ) + ' '}
                                        {request.approved.file.size >= 1 &&
                                            request.approved.file.size <= 999 &&
                                            'B'}
                                        {request.approved.file.size >= 1000 &&
                                            request.approved.file.size <=
                                                999999 &&
                                            'KB'}
                                        {request.approved.file.size >=
                                            1000000 &&
                                            request.approved.file.size <=
                                                999999999 &&
                                            'MB'}
                                    </Text>
                                </Flex>
                            </Flex>

                            <Flex position="absolute" right={6}>
                                <chakra.a href={request.approved.file.url}>
                                    <IconButton
                                        variant="tinted"
                                        size="xs"
                                        colorScheme="brand"
                                        icon={<FiDownloadCloud size={16} />}
                                    />
                                </chakra.a>
                            </Flex>
                        </Flex>

                        <Divider />

                        <Flex justify="space-between" align="center" gap={6}>
                            <Text fontSize="xs" textAlign="center">
                                {request._id.slice(0, 10).toUpperCase()}
                            </Text>

                            <Text fontSize="xs">
                                {request.approved.date.split(',')}
                            </Text>
                        </Flex>
                    </Flex>
                )}

                {request.status === 'rejected' && (
                    <Flex
                        direction="column"
                        gap={6}
                        position="relative"
                        border="1px dashed"
                        borderColor="red.default"
                        borderRadius={12}
                        p={6}
                    >
                        <Flex justify="space-between" align="center" gap={6}>
                            {users
                                .filter(
                                    (user) => user._id === request.rejected.by
                                )
                                .map((user) => (
                                    <Flex
                                        align="center"
                                        gap={3}
                                        key={user._id}
                                        w="calc(100% - 96px)"
                                    >
                                        <Avatar
                                            name={user.name}
                                            src={user.image}
                                        />

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
                                    request.status === 'approved'
                                        ? 'brand'
                                        : request.status === 'rejected'
                                        ? 'red'
                                        : request.status === 'waiting'
                                        ? 'yellow'
                                        : request.status === 'cancelled' &&
                                          'red'
                                }
                            >
                                {request.status}
                            </Badge>
                        </Flex>

                        <Divider />

                        <Flex justify="space-between" align="center" gap={6}>
                            <Text fontSize="xs" textAlign="center">
                                {request._id.slice(0, 10).toUpperCase()}
                            </Text>

                            <Text fontSize="xs">
                                {request.rejected.date.split(',')}
                            </Text>
                        </Flex>
                    </Flex>
                )}

                {request.status === 'waiting' && (
                    <Button
                        size="lg"
                        colorScheme="red"
                        isLoading={isLoading}
                        onClick={() => onSubmit()}
                    >
                        Cancel Request
                    </Button>
                )}
            </Flex>
        </Modal>
    )
}

const Requests = ({ user }) => {
    const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () =>
        api.all('/users')
    )
    const { data: requests, isFetched: isRequestsFetched } = useQuery(
        ['employee_requests'],
        () => api.get('requests/employee', user._id)
    )
    const { register, watch } = useForm()

    return (
        <Card>
            <Flex direction="column" gap={6}>
                <Flex justify="space-between" align="center" gap={6}>
                    <Text fontSize="xl" fontWeight="semibold" color="accent-1">
                        Requests
                    </Text>

                    <Flex flex={1} justify="end" align="center" gap={3}>
                        <Select
                            placeholder="Status"
                            size="lg"
                            w="auto"
                            {...register('status')}
                        >
                            <chakra.option value="waiting">
                                Waiting
                            </chakra.option>
                            <chakra.option value="approved">
                                Approved
                            </chakra.option>
                            <chakra.option value="rejected">
                                Rejected
                            </chakra.option>
                            <chakra.option value="cancelled">
                                Cancelled
                            </chakra.option>
                        </Select>
                    </Flex>
                </Flex>

                <Divider />

                <Table
                    data={requests}
                    fetched={isUsersFetched && isRequestsFetched}
                    th={['Type', 'Purpose', 'Status', 'Created', '']}
                    td={(request) => (
                        <Tr key={request._id}>
                            <Td>
                                <Text textTransform="capitalize">
                                    {request.type}
                                </Text>
                            </Td>

                            <Td>
                                <Text textTransform="capitalize">
                                    {request.purpose}
                                </Text>
                            </Td>

                            <Td>
                                <Badge
                                    variant="tinted"
                                    textTransform="capitalize"
                                    colorScheme={
                                        request.status === 'approved'
                                            ? 'brand'
                                            : request.status === 'rejected'
                                            ? 'red'
                                            : request.status === 'waiting'
                                            ? 'yellow'
                                            : request.status === 'cancelled' &&
                                              'red'
                                    }
                                >
                                    {request.status}
                                </Badge>
                            </Td>

                            <Td>
                                <Text>
                                    {
                                        months[
                                            request.created
                                                .split(',')[0]
                                                .split('/')[0] - 1
                                        ]
                                    }{' '}
                                    {
                                        request.created
                                            .split(',')[0]
                                            .split('/')[1]
                                    }
                                    ,{' '}
                                    {
                                        request.created
                                            .split(',')[0]
                                            .split('/')[2]
                                    }
                                </Text>
                            </Td>

                            <Td textAlign="right">
                                <ViewModal users={users} request={request} />
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

export default Requests
