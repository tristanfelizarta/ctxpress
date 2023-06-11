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

const ViewModal = ({ users, leave }) => {
    const queryClient = useQueryClient()
    const disclosure = useDisclosure()
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const editLeave = useMutation(
        (data) => api.update('/leaves', leave._id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('employee_leaves')
                setIsLoading(false)
                disclosure.onClose()

                toast({
                    position: 'top',
                    duration: 1000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="Leave cancelled successfully."
                        />
                    )
                })
            }
        }
    )

    const onSubmit = () => {
        setIsLoading(true)

        editLeave.mutate({
            status: 'cancelled'
        })
    }

    return (
        <Modal
            title="Leave Information"
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
                            .filter((user) => user._id === leave.user.id)
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
                                leave.status === 'approved'
                                    ? 'brand'
                                    : leave.status === 'rejected'
                                    ? 'red'
                                    : leave.status === 'waiting'
                                    ? 'yellow'
                                    : leave.status === 'cancelled' && 'red'
                            }
                        >
                            {leave.status}
                        </Badge>
                    </Flex>

                    <Divider />

                    <Flex
                        align="center"
                        gap={3}
                        opacity={leave.status === 'cancelled' ? 0.5 : 1}
                    >
                        <Flex flex={1} align="center" gap={3}>
                            <Icon as={FiFolder} boxSize={8} color="accent-1" />

                            <Flex direction="column" w="calc(100% - 88px)">
                                <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    textDecoration={
                                        leave.status === 'cancelled' &&
                                        'line-through'
                                    }
                                    color="accent-1"
                                    noOfLines={1}
                                >
                                    {leave.file.name}
                                </Text>

                                <Text fontSize="xs">
                                    {leave.file.size.toLocaleString(undefined, {
                                        maximumFractionDigits: 2
                                    }) + ' '}
                                    {leave.file.size >= 1 &&
                                        leave.file.size <= 999 &&
                                        'B'}
                                    {leave.file.size >= 1000 &&
                                        leave.file.size <= 999999 &&
                                        'KB'}
                                    {leave.file.size >= 1000000 &&
                                        leave.file.size <= 999999999 &&
                                        'MB'}
                                </Text>
                            </Flex>
                        </Flex>

                        <Flex position="absolute" right={6}>
                            {leave.status === 'cancelled' ? (
                                <IconButton
                                    size="xs"
                                    cursor="not-allowed"
                                    icon={<FiDownloadCloud size={16} />}
                                />
                            ) : (
                                <chakra.a href={leave.file.url}>
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
                            {leave._id.slice(0, 10).toUpperCase()}
                        </Text>

                        <Text fontSize="xs">
                            {leave.status !== 'cancelled'
                                ? leave.created.split(',')
                                : leave.cancelled.date}
                        </Text>
                    </Flex>
                </Flex>

                {leave.status === 'approved' && (
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
                                    (user) => user._id === leave.approved.by
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
                                    leave.status === 'approved'
                                        ? 'brand'
                                        : leave.status === 'rejected'
                                        ? 'red'
                                        : leave.status === 'waiting'
                                        ? 'yellow'
                                        : leave.status === 'cancelled' && 'red'
                                }
                            >
                                {leave.status}
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
                                        {leave.approved.file.name}
                                    </Text>

                                    <Text fontSize="xs">
                                        {leave.approved.file.size.toLocaleString(
                                            undefined,
                                            { maximumFractionDigits: 2 }
                                        ) + ' '}
                                        {leave.approved.file.size >= 1 &&
                                            leave.approved.file.size <= 999 &&
                                            'B'}
                                        {leave.approved.file.size >= 1000 &&
                                            leave.approved.file.size <=
                                                999999 &&
                                            'KB'}
                                        {leave.approved.file.size >= 1000000 &&
                                            leave.approved.file.size <=
                                                999999999 &&
                                            'MB'}
                                    </Text>
                                </Flex>
                            </Flex>

                            <Flex position="absolute" right={6}>
                                <chakra.a href={leave.approved.file.url}>
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
                                {leave._id.slice(0, 10).toUpperCase()}
                            </Text>

                            <Text fontSize="xs">
                                {leave.approved.date.split(',')}
                            </Text>
                        </Flex>
                    </Flex>
                )}

                {leave.status === 'rejected' && (
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
                                    (user) => user._id === leave.rejected.by
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
                                    leave.status === 'approved'
                                        ? 'brand'
                                        : leave.status === 'rejected'
                                        ? 'red'
                                        : leave.status === 'waiting'
                                        ? 'yellow'
                                        : leave.status === 'cancelled' && 'red'
                                }
                            >
                                {leave.status}
                            </Badge>
                        </Flex>

                        <Divider />

                        <Flex justify="space-between" align="center" gap={6}>
                            <Text fontSize="xs" textAlign="center">
                                {leave._id.slice(0, 10).toUpperCase()}
                            </Text>

                            <Text fontSize="xs">
                                {leave.rejected.date.split(',')}
                            </Text>
                        </Flex>
                    </Flex>
                )}

                {leave.status === 'waiting' && (
                    <Button
                        size="lg"
                        colorScheme="red"
                        isLoading={isLoading}
                        onClick={() => onSubmit()}
                    >
                        Cancel Leave
                    </Button>
                )}
            </Flex>
        </Modal>
    )
}

const Leaves = ({ user }) => {
    const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () =>
        api.all('/users')
    )
    const { data: leaves, isFetched: isLeavesFetched } = useQuery(
        ['employee_leaves'],
        () => api.get('leaves/employee', user._id)
    )

    const { register, watch } = useForm()

    return (
        <Card>
            <Flex direction="column" gap={6}>
                <Flex justify="space-between" align="center" gap={6}>
                    <Text fontSize="xl" fontWeight="semibold" color="accent-1">
                        Leave Records
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
                    data={leaves}
                    fetched={isUsersFetched && isLeavesFetched}
                    th={['Type', 'From', 'To', 'Days', 'Status', 'Created', '']}
                    td={(leave) => (
                        <Tr key={leave._id}>
                            <Td>
                                <Text textTransform="capitalize">
                                    {leave.type}
                                </Text>
                            </Td>

                            <Td>
                                <Text>
                                    {months[leave.from.split('-')[1] - 1]}{' '}
                                    {leave.from.split('-')[2]},{' '}
                                    {leave.from.split('-')[0]}
                                </Text>
                            </Td>

                            <Td>
                                <Text>
                                    {months[leave.to.split('-')[1] - 1]}{' '}
                                    {leave.to.split('-')[2]},{' '}
                                    {leave.to.split('-')[0]}
                                </Text>
                            </Td>

                            <Td>
                                <Text>{leave.days}</Text>
                            </Td>

                            <Td>
                                <Badge
                                    variant="tinted"
                                    textTransform="capitalize"
                                    colorScheme={
                                        leave.status === 'approved'
                                            ? 'brand'
                                            : leave.status === 'rejected'
                                            ? 'red'
                                            : leave.status === 'waiting'
                                            ? 'yellow'
                                            : leave.status === 'cancelled' &&
                                              'red'
                                    }
                                >
                                    {leave.status}
                                </Badge>
                            </Td>

                            <Td>
                                <Text>
                                    {
                                        months[
                                            leave.created
                                                .split(',')[0]
                                                .split('/')[0] - 1
                                        ]
                                    }{' '}
                                    {leave.created.split(',')[0].split('/')[1]},{' '}
                                    {leave.created.split(',')[0].split('/')[2]}
                                </Text>
                            </Td>

                            <Td textAlign="right">
                                <ViewModal users={users} leave={leave} />
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

export default Leaves
