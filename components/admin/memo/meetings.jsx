import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import api from 'instance'
import {
    Badge,
    Button,
    chakra,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Icon,
    IconButton,
    Input,
    Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Select,
    Td,
    Text,
    Tr,
    useDisclosure,
    useToast
} from '@chakra-ui/react'
import {
    FiEdit2,
    FiFolder,
    FiMoreHorizontal,
    FiTrash2,
    FiUploadCloud,
    FiX
} from 'react-icons/fi'
import Card from 'components/card'
import Modal from 'components/modal'
import Table from 'components/table'
import Toast from 'components/toast'
import { months } from 'functions/months'

const AddModal = ({ departments, isDepartmentsFetched }) => {
    const queryClient = useQueryClient()
    const disclosure = useDisclosure()
    const [files, setFiles] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const handleFiles = (e) => {
        const file = e.target.files[0]
        setFiles(file)
    }

    const {
        register,
        formState: { errors },
        clearErrors,
        reset,
        handleSubmit
    } = useForm()

    const addMeeting = useMutation((data) => api.create('/meetings', data), {
        onSuccess: () => {
            queryClient.invalidateQueries('meetings')
            setIsLoading(false)
            disclosure.onClose()

            toast({
                position: 'top',
                duration: 1000,
                render: () => (
                    <Toast
                        title="Success"
                        description="Meeting added successfully."
                    />
                )
            })
        }
    })

    const onSubmit = async (data) => {
        setIsLoading(true)

        if (files) {
            for (const item of [files]) {
                const formData = new FormData()

                formData.append('file', item)
                formData.append('upload_preset', 'ctx-hrms')

                let res = await axios.post(
                    'https://api.cloudinary.com/v1_1/ctx-hrms/raw/upload',
                    formData
                )

                addMeeting.mutate({
                    description: data.description,
                    department: data.department,
                    date: data.date,
                    time: data.time,
                    file: {
                        url: res.data.secure_url,
                        name: files.name,
                        size: files.size
                    }
                })
            }
        } else {
            addMeeting.mutate({
                description: data.description,
                department: data.department,
                date: data.date,
                time: data.time
            })
        }
    }

    return (
        <Modal
            title="Add Meeting"
            size="xl"
            toggle={(onOpen) => (
                <Button
                    size="lg"
                    colorScheme="brand"
                    onClick={() =>
                        setFiles(null) || clearErrors() || reset() || onOpen()
                    }
                >
                    Add New
                </Button>
            )}
            disclosure={disclosure}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Flex direction="column" gap={6}>
                    <FormControl isInvalid={errors.description}>
                        <FormLabel>Description</FormLabel>
                        <Input
                            size="lg"
                            {...register('description', { required: true })}
                        />
                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.department}>
                        <FormLabel>Department</FormLabel>

                        <Select
                            placeholder="Select"
                            size="lg"
                            {...register('department', { required: true })}
                        >
                            <chakra.option
                                textTransform="capitalize"
                                value="all"
                            >
                                All
                            </chakra.option>

                            {isDepartmentsFetched &&
                                departments.map((department) => (
                                    <chakra.option
                                        textTransform="capitalize"
                                        value={department.name}
                                        key={department._id}
                                    >
                                        {department.name}
                                    </chakra.option>
                                ))}
                        </Select>

                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.date}>
                        <FormLabel>Date</FormLabel>
                        <Input
                            type="date"
                            size="lg"
                            {...register('date', { required: true })}
                        />
                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.time}>
                        <FormLabel>Time</FormLabel>
                        <Input
                            type="time"
                            size="lg"
                            {...register('time', { required: true })}
                        />
                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    {files ? (
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

                                <Flex direction="column" w="calc(100% - 88px)">
                                    <Text
                                        fontSize="sm"
                                        fontWeight="medium"
                                        color="accent-1"
                                        noOfLines={1}
                                    >
                                        {files.name}
                                    </Text>

                                    <Text fontSize="xs">
                                        {files.size.toLocaleString(undefined, {
                                            maximumFractionDigits: 2
                                        }) + ' '}
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
                    )}

                    <Flex justify="end" align="center" gap={3}>
                        <Button size="lg">Close</Button>

                        <Button
                            type="submit"
                            size="lg"
                            colorScheme="brand"
                            isLoading={isLoading}
                        >
                            Submit
                        </Button>
                    </Flex>
                </Flex>
            </form>
        </Modal>
    )
}

const EditModal = ({ meeting, departments, isDepartmentsFetched }) => {
    const queryClient = useQueryClient()
    const disclosure = useDisclosure()
    const [files, setFiles] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const handleFiles = (e) => {
        const file = e.target.files[0]
        setFiles(file)
    }

    const {
        register,
        formState: { errors },
        clearErrors,
        reset,
        handleSubmit
    } = useForm()

    const updateMeeting = useMutation(
        (data) => api.update('/meetings', meeting._id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('meetings')
                setIsLoading(false)
                disclosure.onClose()

                toast({
                    position: 'top',
                    duration: 1000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="Meeting updated successfully."
                        />
                    )
                })
            }
        }
    )

    const onSubmit = async (data) => {
        setIsLoading(true)

        if (files) {
            for (const item of [files]) {
                const formData = new FormData()

                formData.append('file', item)
                formData.append('upload_preset', 'ctx-hrms')

                let res = await axios.post(
                    'https://api.cloudinary.com/v1_1/ctx-hrms/raw/upload',
                    formData
                )

                updateMeeting.mutate({
                    description: data.description,
                    department: data.department,
                    date: data.date,
                    time: data.time,
                    file: {
                        url: res.data.secure_url,
                        name: files.name,
                        size: files.size
                    }
                })
            }
        } else {
            updateMeeting.mutate({
                description: data.description,
                department: data.department,
                date: data.date,
                time: data.time
            })
        }
    }

    return (
        <Modal
            title="Edit Meeting"
            size="xl"
            toggle={(onOpen) => (
                <MenuItem
                    icon={<FiEdit2 size={16} />}
                    onClick={() =>
                        setFiles(null) || clearErrors() || reset() || onOpen()
                    }
                >
                    Edit
                </MenuItem>
            )}
            disclosure={disclosure}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Flex direction="column" gap={6}>
                    <FormControl isInvalid={errors.description}>
                        <FormLabel>Description</FormLabel>
                        <Input
                            defaultValue={meeting.description}
                            size="lg"
                            {...register('description', { required: true })}
                        />
                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.department}>
                        <FormLabel>Department</FormLabel>

                        <Select
                            placeholder="Select"
                            defaultValue={meeting.department}
                            size="lg"
                            {...register('department', { required: true })}
                        >
                            <chakra.option
                                textTransform="capitalize"
                                value="all"
                            >
                                All
                            </chakra.option>

                            {isDepartmentsFetched &&
                                departments.map((department) => (
                                    <chakra.option
                                        textTransform="capitalize"
                                        value={department.name}
                                        key={department._id}
                                    >
                                        {department.name}
                                    </chakra.option>
                                ))}
                        </Select>

                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.date}>
                        <FormLabel>Date</FormLabel>
                        <Input
                            type="date"
                            defaultValue={meeting.date}
                            size="lg"
                            {...register('date', { required: true })}
                        />
                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.time}>
                        <FormLabel>Time</FormLabel>
                        <Input
                            type="time"
                            defaultValue={meeting.time}
                            size="lg"
                            {...register('time', { required: true })}
                        />
                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    {files ? (
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

                                <Flex direction="column" w="calc(100% - 88px)">
                                    <Text
                                        fontSize="sm"
                                        fontWeight="medium"
                                        color="accent-1"
                                        noOfLines={1}
                                    >
                                        {files.name}
                                    </Text>

                                    <Text fontSize="xs">
                                        {files.size.toLocaleString(undefined, {
                                            maximumFractionDigits: 2
                                        }) + ' '}
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
                    )}

                    <Flex justify="end" align="center" gap={3}>
                        <Button size="lg">Close</Button>

                        <Button
                            type="submit"
                            size="lg"
                            colorScheme="brand"
                            isLoading={isLoading}
                        >
                            Submit
                        </Button>
                    </Flex>
                </Flex>
            </form>
        </Modal>
    )
}

const Meetings = () => {
    const queryClient = useQueryClient()
    const { data: meetings, isFetched: isMeetingsFetched } = useQuery(
        ['meetings'],
        () => api.all('/meetings')
    )
    const { data: departments, isFetched: isDepartmentsFetched } = useQuery(
        ['departments'],
        () => api.all('/departments')
    )
    const toast = useToast()

    const deleteMeeting = useMutation((data) => api.remove('/meetings', data), {
        onSuccess: () => {
            queryClient.invalidateQueries('meetings')

            toast({
                position: 'top',
                duration: 1000,
                render: () => (
                    <Toast
                        title="Success"
                        description="Meeting deleted successfully."
                    />
                )
            })
        }
    })

    const onDelete = (id) => {
        deleteMeeting.mutate(id)
    }

    return (
        <Card>
            <Flex direction="column" gap={6}>
                <Flex justify="space-between" align="center" gap={6}>
                    <Text fontSize="xl" fontWeight="semibold" color="accent-1">
                        Meetings
                    </Text>

                    <AddModal
                        departments={departments}
                        isDepartmentsFetched={isDepartmentsFetched}
                    />
                </Flex>

                <Table
                    data={meetings}
                    fetched={isMeetingsFetched && isDepartmentsFetched}
                    th={[
                        'Description',
                        'Department',
                        'Date',
                        'Time',
                        'File',
                        'Created',
                        ''
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

                            <Td textAlign="right">
                                <Menu>
                                    <MenuButton
                                        as={IconButton}
                                        size="xs"
                                        icon={<FiMoreHorizontal size={12} />}
                                    />

                                    <MenuList>
                                        <EditModal
                                            meeting={meeting}
                                            departments={departments}
                                            isDepartmentsFetched={
                                                isDepartmentsFetched
                                            }
                                        />

                                        <MenuItem
                                            icon={<FiTrash2 size={16} />}
                                            onClick={() =>
                                                onDelete(meeting._id)
                                            }
                                        >
                                            Delete
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </Td>
                        </Tr>
                    )}
                    select={(register) => (
                        <Flex
                            flex={1}
                            justify="end"
                            align="center"
                            direction={{ base: 'column', md: 'row' }}
                            gap={3}
                        >
                            <Select
                                placeholder="Department"
                                size="lg"
                                w={{ base: 'full', md: 'auto' }}
                                {...register('department')}
                            >
                                {isDepartmentsFetched &&
                                    departments.map((department) => (
                                        <chakra.option
                                            textTransform="capitalize"
                                            value={department.name}
                                            key={department._id}
                                        >
                                            {department.name}
                                        </chakra.option>
                                    ))}
                            </Select>
                        </Flex>
                    )}
                    filters={(data, watch) => {
                        return data.filter((data) =>
                            watch('department')
                                ? watch('department') === data.department
                                : data
                        )
                    }}
                    effects={(watch) => [
                        watch('department'),
                        watch('designation'),
                        watch('status')
                    ]}
                />
            </Flex>
        </Card>
    )
}

export default Meetings
