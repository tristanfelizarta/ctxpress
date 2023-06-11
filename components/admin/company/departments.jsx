import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from 'instance'
import {
    Button,
    Divider,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    IconButton,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Td,
    Text,
    Tr,
    useDisclosure,
    useToast
} from '@chakra-ui/react'
import { FiEdit2, FiMoreHorizontal, FiPlus, FiTrash2 } from 'react-icons/fi'
import Card from 'components/card'
import Table from 'components/table'
import Modal from 'components/modal'
import Toast from 'components/toast'

const AddModal = () => {
    const queryClient = useQueryClient()
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

    const addDepartment = useMutation(
        (data) => api.create('/departments', data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('departments')
                setIsLoading(false)
                disclosure.onClose()

                toast({
                    position: 'top',
                    duration: 1000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="Department added successfully."
                        />
                    )
                })
            }
        }
    )

    const onSubmit = (data) => {
        setIsLoading(true)

        addDepartment.mutate({
            name: data.name.toLowerCase()
        })
    }

    return (
        <Modal
            title="Add Department"
            size="xl"
            toggle={(onOpen) => (
                <IconButton
                    size="lg"
                    colorScheme="brand"
                    icon={<FiPlus size={16} />}
                    onClick={() => clearErrors() || reset() || onOpen()}
                />
            )}
            disclosure={disclosure}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Flex direction="column" gap={6}>
                    <FormControl isInvalid={errors.name}>
                        <FormLabel>Name</FormLabel>
                        <Input
                            size="lg"
                            {...register('name', { required: true })}
                        />
                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
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
                </Flex>
            </form>
        </Modal>
    )
}

const EditModal = ({ department }) => {
    const queryClient = useQueryClient()
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

    const editDepartment = useMutation(
        (data) => api.update('/departments', department._id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('departments')
                setIsLoading(false)
                disclosure.onClose()

                toast({
                    position: 'top',
                    duration: 1000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="Department updated successfully."
                        />
                    )
                })
            }
        }
    )

    const onSubmit = (data) => {
        setIsLoading(true)

        editDepartment.mutate({
            name: data.name.toLowerCase()
        })
    }

    return (
        <Modal
            title="Edit Department"
            toggle={(onOpen) => (
                <MenuItem
                    icon={<FiEdit2 size={16} />}
                    onClick={() => clearErrors() || reset() || onOpen()}
                >
                    Edit
                </MenuItem>
            )}
            disclosure={disclosure}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Flex direction="column" gap={6}>
                    <FormControl isInvalid={errors.name}>
                        <FormLabel>Name</FormLabel>
                        <Input
                            defaultValue={department.name}
                            size="lg"
                            {...register('name', { required: true })}
                        />
                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
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
                </Flex>
            </form>
        </Modal>
    )
}

const Departments = () => {
    const queryClient = useQueryClient()
    const { data: departments, isFetched: isDepartmentsFetched } = useQuery(
        ['departments'],
        () => api.all('/departments')
    )
    const toast = useToast()

    const deleteDepartment = useMutation(
        (data) => api.remove('/departments', data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('departments')

                toast({
                    position: 'top',
                    duration: 1000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="Department removed successfully."
                        />
                    )
                })
            }
        }
    )

    const onSubmit = (id) => {
        deleteDepartment.mutate(id)
    }

    return (
        <Card>
            <Flex direction="column" gap={6}>
                <Flex justify="space-between" align="center" gap={6}>
                    <Text fontSize="xl" fontWeight="semibold" color="accent-1">
                        Departments
                    </Text>

                    <AddModal />
                </Flex>

                <Divider />

                <Table
                    data={departments}
                    fetched={isDepartmentsFetched}
                    th={['Name', , '']}
                    td={(department) => (
                        <Tr key={department._id}>
                            <Td>
                                <Text textTransform="capitalize">
                                    {department.name}
                                </Text>
                            </Td>

                            <Td textAlign="right">
                                <Menu placement="bottom-end">
                                    <MenuButton
                                        as={IconButton}
                                        size="xs"
                                        icon={<FiMoreHorizontal size={12} />}
                                    />

                                    <MenuList>
                                        <EditModal department={department} />
                                        <MenuItem
                                            icon={<FiTrash2 size={16} />}
                                            onClick={() =>
                                                onSubmit(department._id)
                                            }
                                        >
                                            Delete
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </Td>
                        </Tr>
                    )}
                    filters={(data, watch) => {
                        return data.filter((data) =>
                            ['name'].some((key) =>
                                data[key]
                                    .toString()
                                    .toLowerCase()
                                    .includes(
                                        watch('search') &&
                                            watch('search').toLowerCase()
                                    )
                            )
                        )
                    }}
                    settings={{
                        searchWidth: 'full'
                    }}
                />
            </Flex>
        </Card>
    )
}

export default Departments
