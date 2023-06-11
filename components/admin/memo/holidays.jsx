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
import { months } from 'functions/months'

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

    const addHoliday = useMutation((data) => api.create('/holidays', data), {
        onSuccess: () => {
            queryClient.invalidateQueries('holidays')
            setIsLoading(false)
            disclosure.onClose()

            toast({
                position: 'top',
                duration: 1000,
                render: () => (
                    <Toast
                        title="Success"
                        description="Holiday added successfully."
                    />
                )
            })
        }
    })

    const onSubmit = (data) => {
        setIsLoading(true)

        addHoliday.mutate({
            description: data.description.toLowerCase(),
            date: data.date
        })
    }

    return (
        <Modal
            title="Add Holiday"
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

const EditModal = ({ holiday }) => {
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

    const editHoliday = useMutation(
        (data) => api.update('/holidays', holiday._id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('holidays')
                setIsLoading(false)
                disclosure.onClose()

                toast({
                    position: 'top',
                    duration: 1000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="Holiday updated successfully."
                        />
                    )
                })
            }
        }
    )

    const onSubmit = (data) => {
        setIsLoading(true)

        editHoliday.mutate({
            description: data.description.toLowerCase(),
            date: data.date
        })
    }

    return (
        <Modal
            title="Edit Holiday"
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
                    <FormControl isInvalid={errors.description}>
                        <FormLabel>Description</FormLabel>
                        <Input
                            defaultValue={holiday.description}
                            size="lg"
                            {...register('description', { required: true })}
                        />
                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.date}>
                        <FormLabel>Date</FormLabel>
                        <Input
                            type="date"
                            defaultValue={holiday.date}
                            size="lg"
                            {...register('date', { required: true })}
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

const Holidays = () => {
    const queryClient = useQueryClient()
    const { data: holidays, isFetched: isHolidaysFetched } = useQuery(
        ['holidays'],
        () => api.all('/holidays')
    )
    const toast = useToast()

    const deleteHoliday = useMutation((data) => api.remove('/holidays', data), {
        onSuccess: () => {
            queryClient.invalidateQueries('holidays')

            toast({
                position: 'top',
                duration: 1000,
                render: () => (
                    <Toast
                        title="Success"
                        description="Holiday removed successfully."
                    />
                )
            })
        }
    })

    const onSubmit = (id) => {
        deleteHoliday.mutate(id)
    }

    return (
        <Card>
            <Flex direction="column" gap={6}>
                <Flex justify="space-between" align="center" gap={6}>
                    <Text fontSize="xl" fontWeight="semibold" color="accent-1">
                        Holidays
                    </Text>

                    <AddModal />
                </Flex>

                <Divider />

                <Table
                    data={holidays}
                    fetched={isHolidaysFetched}
                    th={['Description', 'Date', '']}
                    td={(holiday) => (
                        <Tr key={holiday._id}>
                            <Td>
                                <Text textTransform="capitalize">
                                    {holiday.description}
                                </Text>
                            </Td>

                            <Td>
                                <Text>
                                    {months[holiday.date.split('-')[1] - 1]}{' '}
                                    {holiday.date.split('-')[2]},{' '}
                                    {holiday.date.split('-')[0]}
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
                                        <EditModal holiday={holiday} />

                                        <MenuItem
                                            icon={<FiTrash2 size={16} />}
                                            onClick={() =>
                                                onSubmit(holiday._id)
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
                            ['description'].some((key) =>
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

export default Holidays
