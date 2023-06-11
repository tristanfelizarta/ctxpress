import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import axios from 'axios'
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
    FiTrash2,
    FiUploadCloud,
    FiX
} from 'react-icons/fi'
import Card from 'components/card'
import Modal from 'components/modal'
import Table from 'components/table'
import Toast from 'components/toast'
import { months } from 'functions/months'

const AddRequestTypeModal = () => {
    const queryClient = useQueryClient()
    const { data: types, isFetched: isTypesFetched } = useQuery(
        ['request-types'],
        () => api.all('/requests/types')
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

    const addRequestType = useMutation(
        (data) => api.create('/requests/types', data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('request-types')
                setIsLoading(false)

                toast({
                    position: 'top',
                    duration: 1000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="Request type successfully added."
                        />
                    )
                })
            }
        }
    )

    const deleteRequestType = useMutation(
        (data) => api.remove('/requests/types', data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('request-types')
                setIsLoading(false)

                toast({
                    position: 'top',
                    duration: 1000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="Request type successfully added."
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

        addRequestType.mutate({
            name: data.name.toLowerCase()
        })
    }

    const onDelete = (data) => {
        setIsLoading(true)
        deleteRequestType.mutate(data)
    }

    return (
        <Modal
            title="Add Request Type"
            size="xl"
            toggle={(onOpen) => (
                <Button
                    variant="tinted"
                    size="lg"
                    colorScheme="brand"
                    isLoading={isLoading}
                    onClick={() => clearErrors() || reset() || onOpen()}
                >
                    Add Request Type
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

const ViewModal = ({ session, users, request }) => {
    const queryClient = useQueryClient()
    const disclosure = useDisclosure()
    const [files, setFiles] = useState(null)
    const [isAprroveLoading, setIsApproveLoading] = useState(false)
    const [isRejectLoading, setIsRejectLoading] = useState(false)
    const toast = useToast()

    const handleFiles = (e) => {
        const file = e.target.files[0]
        setFiles(file)
    }

    const approveRequest = useMutation(
        (data) => api.update('/requests/employee/approve', request._id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('requests')
                setIsApproveLoading(false)
                disclosure.onClose()

                toast({
                    position: 'top',
                    duration: 1000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="Request approved successfully."
                        />
                    )
                })
            }
        }
    )

    const rejectRequest = useMutation(
        (data) => api.update('/requests/employee/reject', request._id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('requests')
                setIsRejectLoading(false)
                disclosure.onClose()

                toast({
                    position: 'top',
                    duration: 1000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="Request rejected successfully."
                        />
                    )
                })
            }
        }
    )

    const onApprove = async () => {
        setIsApproveLoading(true)

        if (!files) {
            toast({
                position: 'top',
                duration: 1000,
                render: () => (
                    <Toast
                        title="Error"
                        description="Please attach file."
                        status="error"
                    />
                )
            })

            setIsApproveLoading(false)

            return
        }

        for (const item of [files]) {
            const formData = new FormData()

            formData.append('file', item)
            formData.append('upload_preset', 'ctx-hrms')

            let res = await axios.post(
                'https://api.cloudinary.com/v1_1/ctx-hrms/raw/upload',
                formData
            )

            approveRequest.mutate({
                approved: {
                    by: session.user.id,
                    date: new Date().toLocaleString('en-US', {
                        timeZone: 'Asia/Manila'
                    }),
                    file: {
                        url: res.data.secure_url,
                        name: files.name,
                        size: files.size
                    }
                }
            })
        }
    }

    const onReject = () => {
        setIsRejectLoading(true)

        rejectRequest.mutate({
            rejected: {
                by: session.user.id,
                date: new Date().toLocaleString('en-US', {
                    timeZone: 'Asia/Manila'
                })
            }
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
                    onClick={() => setFiles(null) || onOpen()}
                />
            )}
            disclosure={disclosure}
        >
            <form>
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

                        <Flex
                            align="center"
                            gap={3}
                            opacity={request.status === 'cancelled' ? 0.5 : 1}
                        >
                            <Flex flex={1} align="center" gap={3}>
                                <Icon
                                    as={FiFolder}
                                    boxSize={8}
                                    color="accent-1"
                                />

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
                            <Flex
                                justify="space-between"
                                align="center"
                                gap={6}
                            >
                                {users
                                    .filter(
                                        (user) =>
                                            user._id === request.approved.by
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

                                    <Flex
                                        direction="column"
                                        w="calc(100% - 88px)"
                                    >
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
                                                request.approved.file.size <=
                                                    999 &&
                                                'B'}
                                            {request.approved.file.size >=
                                                1000 &&
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

                            <Flex
                                justify="space-between"
                                align="center"
                                gap={6}
                            >
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
                            <Flex
                                justify="space-between"
                                align="center"
                                gap={6}
                            >
                                {users
                                    .filter(
                                        (user) =>
                                            user._id === request.rejected.by
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

                            <Flex
                                justify="space-between"
                                align="center"
                                gap={6}
                            >
                                <Text fontSize="xs" textAlign="center">
                                    {request._id.slice(0, 10).toUpperCase()}
                                </Text>

                                <Text fontSize="xs">
                                    {request.rejected.date.split(',')}
                                </Text>
                            </Flex>
                        </Flex>
                    )}

                    {request.status === 'waiting' &&
                        (files ? (
                            <Flex
                                align="center"
                                gap={3}
                                position="relative"
                                border="1px solid"
                                borderColor="border"
                                borderRadius={12}
                                p={6}
                            >
                                <Flex flex={1} align="center" gap={3}>
                                    <Icon
                                        as={FiFolder}
                                        boxSize={8}
                                        color="accent-1"
                                    />

                                    <Flex
                                        direction="column"
                                        w="calc(100% - 88px)"
                                    >
                                        <Text
                                            fontSize="sm"
                                            fontWeight="medium"
                                            color="accent-1"
                                            noOfLines={1}
                                        >
                                            {files.name}
                                        </Text>

                                        <Text fontSize="xs">
                                            {files.size.toLocaleString(
                                                undefined,
                                                { maximumFractionDigits: 2 }
                                            ) + ' '}
                                            {files.size >= 1 &&
                                                files.size <= 999 &&
                                                'B'}
                                            {files.size >= 1000 &&
                                                files.size <= 999999 &&
                                                'KB'}
                                            {files.size >= 1000000 &&
                                                files.size <= 999999999 &&
                                                'MB'}
                                        </Text>
                                    </Flex>
                                </Flex>

                                <Flex position="absolute" right={6}>
                                    <IconButton
                                        size="xs"
                                        icon={<FiX size={16} />}
                                        onClick={() => setFiles(null)}
                                    />
                                </Flex>
                            </Flex>
                        ) : (
                            <Flex
                                overflow="hidden"
                                align="center"
                                direction="column"
                                gap={1}
                                position="relative"
                                border="1px solid"
                                borderColor="border"
                                borderRadius={12}
                                p={6}
                            >
                                <Flex gap={3} color="accent-1">
                                    <Icon as={FiUploadCloud} boxSize={6} />
                                    <Text fontWeight="medium">Upload File</Text>
                                </Flex>

                                <Text fontSize="xs">
                                    Select .png .pdf .docx format.
                                </Text>

                                <Input
                                    type="file"
                                    position="absolute"
                                    top={-8}
                                    h={128}
                                    opacity={0}
                                    cursor="pointer"
                                    onChange={handleFiles}
                                />
                            </Flex>
                        ))}

                    {request.status === 'waiting' && (
                        <Flex align="center" gap={6}>
                            <Button
                                size="lg"
                                colorScheme="red"
                                w="full"
                                isLoading={isRejectLoading}
                                onClick={() => onReject()}
                            >
                                Reject
                            </Button>

                            <Button
                                size="lg"
                                colorScheme="brand"
                                w="full"
                                isLoading={isAprroveLoading}
                                onClick={() => onApprove()}
                            >
                                Approve
                            </Button>
                        </Flex>
                    )}
                </Flex>
            </form>
        </Modal>
    )
}

const Requests = () => {
    const { data: session } = useSession()
    const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () =>
        api.all('/users')
    )
    const { data: requests, isFetched: isRequestsFetched } = useQuery(
        ['requests'],
        () => api.all('/requests')
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
                            Requests
                        </Text>

                        <AddRequestTypeModal />
                    </Flex>

                    <Divider />

                    <Table
                        data={requests}
                        fetched={isUsersFetched && isRequestsFetched}
                        th={[
                            'Employee',
                            'Request Type',
                            'Purpose',
                            'Status',
                            'Created',
                            ''
                        ]}
                        td={(request) => (
                            <Tr key={request._id}>
                                <Td>
                                    {users
                                        .filter(
                                            (user) =>
                                                user._id === request.user.id
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
                                                : request.status ===
                                                      'cancelled' && 'red'
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
                                    <ViewModal
                                        session={session}
                                        users={users}
                                        request={request}
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
                        )}
                        filters={(data, watch) => {
                            return data
                                .filter((data) =>
                                    ['type', 'purpose'].some((key) =>
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

export default Requests
