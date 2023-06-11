import { useState } from 'react'
import { useRouter } from 'next/router'
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
    IconButton,
    Input,
    Select,
    Skeleton,
    SkeletonCircle,
    Td,
    Text,
    Tr,
    useDisclosure,
    useToast
} from '@chakra-ui/react'
import { FiMoreHorizontal, FiPrinter } from 'react-icons/fi'
import Card from 'components/card'
import Modal from 'components/modal'
import Table from 'components/table'
import Toast from 'components/toast'

const UserModal = ({ users, isUsersFetched, setSelectedUser }) => {
    const disclosure = useDisclosure()

    return (
        <Modal
            title="Select User"
            size="xl"
            toggle={(onOpen) => (
                <Button variant="tinted" colorScheme="brand" onClick={onOpen}>
                    Select User
                </Button>
            )}
            disclosure={disclosure}
        >
            <Table
                data={users}
                fetched={isUsersFetched}
                th={[]}
                td={(user) => (
                    <Tr key={user._id}>
                        <Td>
                            <Flex align="center" gap={3}>
                                <Avatar
                                    name={user.name}
                                    src={user.image}
                                    boxSize={10}
                                />

                                <Flex direction="column">
                                    <Text>{user.name}</Text>

                                    <Text mt={-1} color="accent-3">
                                        {user.email}
                                    </Text>
                                </Flex>
                            </Flex>
                        </Td>

                        <Td textAlign="right">
                            <Button
                                variant="tinted"
                                colorScheme="brand"
                                onClick={() =>
                                    setSelectedUser(user) ||
                                    disclosure.onClose()
                                }
                            >
                                Select
                            </Button>
                        </Td>
                    </Tr>
                )}
                filters={(data, watch) => {
                    return data
                        .filter((data) =>
                            ['name', 'email'].some((key) =>
                                data[key]
                                    .toString()
                                    .toLowerCase()
                                    .includes(
                                        watch('search') &&
                                            watch('search').toLowerCase()
                                    )
                            )
                        )
                        .filter((data) => data.role === 'User')
                }}
                settings={{
                    searchWidth: 'full'
                }}
            />
        </Modal>
    )
}

const AddModal = ({
    users,
    isUsersFetched,
    departments,
    isDepartmentsFetched,
    designations,
    isDesignationsFetched
}) => {
    const queryClient = useQueryClient()
    const disclosure = useDisclosure()
    const [selectedUser, setSelectedUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const {
        register,
        formState: { errors },
        clearErrors,
        reset,
        handleSubmit
    } = useForm()

    const addEmployee = useMutation(
        (data) => api.update('/users/promote', selectedUser._id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('users')
                setIsLoading(false)
                disclosure.onClose()

                toast({
                    position: 'top',
                    duration: 1000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="Employee added successfully."
                        />
                    )
                })
            }
        }
    )

    const onSubmit = (data) => {
        setIsLoading(true)

        addEmployee.mutate({
            ...data,
            role: 'Employee'
        })
    }

    return (
        <Modal
            title="Add Employee"
            size="xl"
            toggle={(onOpen) => (
                <Button
                    size="lg"
                    colorScheme="brand"
                    onClick={() =>
                        setSelectedUser(null) ||
                        clearErrors() ||
                        reset() ||
                        onOpen()
                    }
                >
                    Add New
                </Button>
            )}
            disclosure={disclosure}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Flex direction="column" gap={6}>
                    <Flex justify="space-between" align="center" gap={6}>
                        {selectedUser ? (
                            <Flex align="center" gap={3}>
                                <Avatar
                                    name={selectedUser.name}
                                    src={selectedUser.image}
                                    boxSize="44px"
                                />

                                <Flex direction="column">
                                    <Text
                                        fontSize="sm"
                                        fontWeight="medium"
                                        color="accent-1"
                                    >
                                        {selectedUser.name}
                                    </Text>

                                    <Text
                                        mt={-1}
                                        fontSize="sm"
                                        fontWeight="medium"
                                    >
                                        {selectedUser.email}
                                    </Text>
                                </Flex>
                            </Flex>
                        ) : (
                            <Flex align="center" gap={3}>
                                <SkeletonCircle boxSize="44px" />

                                <Flex direction="column" gap={2}>
                                    <Skeleton h={2} w={32} />
                                    <Skeleton h={2} w={24} />
                                </Flex>
                            </Flex>
                        )}

                        {selectedUser ? (
                            <Button
                                variant="tinted"
                                colorScheme="brand"
                                onClick={() => setSelectedUser(null)}
                            >
                                Remove
                            </Button>
                        ) : (
                            <UserModal
                                users={users}
                                isUsersFetched={isUsersFetched}
                                setSelectedUser={setSelectedUser}
                            />
                        )}
                    </Flex>

                    {selectedUser && (
                        <>
                            <FormControl isInvalid={errors.department}>
                                <FormLabel>Department</FormLabel>

                                <Select
                                    placeholder="Select"
                                    size="lg"
                                    {...register('department', {
                                        required: true
                                    })}
                                >
                                    {isDepartmentsFetched &&
                                        departments.map((department) => (
                                            <option
                                                value={department.name}
                                                key={department._id}
                                            >
                                                {department.name}
                                            </option>
                                        ))}
                                </Select>

                                <FormErrorMessage>
                                    This field is required.
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={errors.designation}>
                                <FormLabel>Designation</FormLabel>

                                <Select
                                    placeholder="Select"
                                    size="lg"
                                    {...register('designation', {
                                        required: true
                                    })}
                                >
                                    {isDesignationsFetched &&
                                        designations.map((designation) => (
                                            <option
                                                value={designation.name}
                                                key={designation._id}
                                            >
                                                {designation.name}
                                            </option>
                                        ))}
                                </Select>

                                <FormErrorMessage>
                                    This field is required.
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={errors.hired_date}>
                                <FormLabel>Hired Date</FormLabel>
                                <Input
                                    type="date"
                                    size="lg"
                                    {...register('hired_date', {
                                        required: true
                                    })}
                                />
                                <FormErrorMessage>
                                    This field is required.
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl>
                                <FormLabel>
                                    Contract End Date
                                    <chakra.em color="accent-3">
                                        (optional)
                                    </chakra.em>
                                </FormLabel>

                                <Input
                                    type="date"
                                    size="lg"
                                    {...register('contract_end_date')}
                                />
                            </FormControl>

                            <Flex justify="end" align="center" gap={3}>
                                <Button size="lg" onClick={disclosure.onClose}>
                                    Close
                                </Button>

                                <Button
                                    type="submit"
                                    size="lg"
                                    colorScheme="brand"
                                    isLoading={isLoading}
                                >
                                    Submit
                                </Button>
                            </Flex>
                        </>
                    )}
                </Flex>
            </form>
        </Modal>
    )
}

const ShowPrint = ({
    users,
    isUsersFetched,
    departments,
    isDepartmentsFetched,
    designations,
    isDesignationsFetched
}) => {
    const disclosure = useDisclosure()

    return (
        <Modal
            header="off"
            size="6xl"
            toggle={(onOpen) => (
                <Button
                    variant="tinted"
                    size="lg"
                    colorScheme="brand"
                    leftIcon={<FiPrinter size={16} />}
                    onClick={onOpen}
                >
                    Print
                </Button>
            )}
            disclosure={disclosure}
        >
            <Flex direction="column" border="1px solid black">
                <Flex
                    justify="space-evenly"
                    gap={6}
                    py={3}
                    borderBottom="1px solid black"
                >
                    <Flex flex={1} justify="center">
                        <Text
                            fontSize="sm"
                            fontWeight="semibold"
                            color="accent-1"
                        >
                            Full Name
                        </Text>
                    </Flex>

                    <Flex flex={1} justify="center">
                        <Text
                            fontSize="sm"
                            fontWeight="semibold"
                            color="accent-1"
                        >
                            Department
                        </Text>
                    </Flex>

                    <Flex flex={1} justify="center">
                        <Text
                            fontSize="sm"
                            fontWeight="semibold"
                            color="accent-1"
                        >
                            Designation
                        </Text>
                    </Flex>
                </Flex>

                {isUsersFetched &&
                    users
                        .filter((user) => user.role === 'Employee')
                        .map((user) => (
                            <Flex py={3} key={user._id}>
                                <Flex flex={1} justify="center">
                                    <Text
                                        fontSize="sm"
                                        fontWeight="medium"
                                        color="accent-1"
                                    >
                                        {user.name}
                                    </Text>
                                </Flex>

                                <Flex flex={1} justify="center">
                                    <Text
                                        fontSize="sm"
                                        fontWeight="medium"
                                        color="accent-1"
                                    >
                                        {user.department}
                                    </Text>
                                </Flex>

                                <Flex flex={1} justify="center">
                                    <Text
                                        fontSize="sm"
                                        fontWeight="medium"
                                        color="accent-1"
                                    >
                                        {user.designation}
                                    </Text>
                                </Flex>
                            </Flex>
                        ))}
            </Flex>
        </Modal>
    )
}

const Employees = () => {
    const router = useRouter()
    const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () =>
        api.all('/users')
    )
    const { data: departments, isFetched: isDepartmentsFetched } = useQuery(
        ['departments'],
        () => api.all('/departments')
    )
    const { data: designations, isFetched: isDesignationsFetched } = useQuery(
        ['designations'],
        () => api.all('/designations')
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
                            Employees
                        </Text>

                        <Flex align="center" gap={3}>
                            <ShowPrint
                                users={users}
                                isUsersFetched={isUsersFetched}
                                departments={departments}
                                isDepartmentsFetched={isDepartmentsFetched}
                                designations={designations}
                                isDesignationsFetched={isDesignationsFetched}
                            />
                            <AddModal
                                users={users}
                                isUsersFetched={isUsersFetched}
                                departments={departments}
                                isDepartmentsFetched={isDepartmentsFetched}
                                designations={designations}
                                isDesignationsFetched={isDesignationsFetched}
                            />
                        </Flex>
                    </Flex>

                    <Divider />

                    <Table
                        data={users}
                        fetched={isUsersFetched}
                        th={[
                            'Name',
                            'Email',
                            'Department',
                            'Designation',
                            'Status',
                            ''
                        ]}
                        td={(user) => (
                            <Tr key={user._id}>
                                <Td>
                                    <Flex align="center" gap={3}>
                                        <Avatar
                                            name={user.name}
                                            src={user.image}
                                        />
                                        <Text textTransform="capitalize">
                                            {user.name}
                                        </Text>
                                    </Flex>
                                </Td>

                                <Td>
                                    <Text>{user.email}</Text>
                                </Td>

                                <Td>
                                    <Text textTransform="capitalize">
                                        {user.department}
                                    </Text>
                                </Td>

                                <Td>
                                    <Text textTransform="capitalize">
                                        {user.designation}
                                    </Text>
                                </Td>

                                <Td>
                                    <Badge
                                        variant="tinted"
                                        textTransform="capitalize"
                                        colorScheme={
                                            user.status === 'active'
                                                ? 'brand'
                                                : user.status === 'warning'
                                                ? 'yellow'
                                                : user.status === 'suspended'
                                                ? 'yellow'
                                                : user.status === 'restricted'
                                                ? 'red'
                                                : user.status === 'terminated'
                                                ? 'red'
                                                : user.status === 'resigned' &&
                                                  'default'
                                        }
                                    >
                                        {user.status}
                                    </Badge>
                                </Td>

                                <Td textAlign="right">
                                    <IconButton
                                        size="xs"
                                        icon={<FiMoreHorizontal size={12} />}
                                        onClick={() =>
                                            router.push(
                                                `/admin/employees/${user._id}`
                                            )
                                        }
                                    />
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

                                <Select
                                    placeholder="Designation"
                                    size="lg"
                                    w={{ base: 'full', md: 'auto' }}
                                    {...register('designation')}
                                >
                                    {isDesignationsFetched &&
                                        designations.map((designation) => (
                                            <chakra.option
                                                textTransform="capitalize"
                                                value={designation.name}
                                                key={designation._id}
                                            >
                                                {designation.name}
                                            </chakra.option>
                                        ))}
                                </Select>

                                <Select
                                    placeholder="Status"
                                    size="lg"
                                    w={{ base: 'full', md: 'auto' }}
                                    {...register('status')}
                                >
                                    <option value="active">Active</option>
                                    <option value="warning">Warning</option>
                                    <option value="suspended">Suspended</option>
                                    <option value="restricted">
                                        Restricted
                                    </option>
                                    <option value="terminated">
                                        Terminated
                                    </option>
                                    <option value="resigned">Resigned</option>
                                </Select>
                            </Flex>
                        )}
                        filters={(data, watch) => {
                            return data
                                .filter((data) => data.role === 'Employee')
                                .filter((data) =>
                                    ['name', 'email'].some((key) =>
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
                                    watch('department')
                                        ? watch('department') ===
                                          data.department
                                        : data
                                )
                                .filter((data) =>
                                    watch('designation')
                                        ? watch('designation') ===
                                          data.designation
                                        : data
                                )
                                .filter((data) =>
                                    watch('status')
                                        ? watch('status') === data.status
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
        </Container>
    )
}

export default Employees
