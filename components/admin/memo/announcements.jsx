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

    const addAnnouncement = useMutation(
        (data) => api.create('/announcements', data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('announcements')
                setIsLoading(false)
                disclosure.onClose()

                toast({
                    position: 'top',
                    duration: 1000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="Announcement added successfully."
                        />
                    )
                })
            }
        }
    )

    const onSubmit = (data) => {
        setIsLoading(true)

        addAnnouncement.mutate({
            description: data.description.toLowerCase(),
            date: data.date
        })
    }

    return (
        <Modal
            title="Add Announcement"
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

const EditModal = ({ announcement }) => {
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

    const editAnnouncement = useMutation(
        (data) => api.update('/announcements', announcement._id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('announcements')
                setIsLoading(false)
                disclosure.onClose()

                toast({
                    position: 'top',
                    duration: 1000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="Announcement updated successfully."
                        />
                    )
                })
            }
        }
    )

    const onSubmit = (data) => {
        setIsLoading(true)

        editAnnouncement.mutate({
            description: data.description.toLowerCase(),
            date: data.date
        })
    }

    return (
        <Modal
            title="Edit Announcement"
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
                            defaultValue={announcement.description}
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
                            defaultValue={announcement.date}
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

const Announcements = () => {
    const queryClient = useQueryClient()
    const { data: announcements, isFetched: isAnnouncementsFetched } = useQuery(
        ['announcements'],
        () => api.all('/announcements')
    )
    const toast = useToast()

    const deleteAnnouncement = useMutation(
        (data) => api.remove('/announcements', data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('announcements')

                toast({
                    position: 'top',
                    duration: 1000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="Announcement removed successfully."
                        />
                    )
                })
            }
        }
    )

    const onSubmit = (id) => {
        deleteAnnouncement.mutate(id)
    }

    return (
        <Card>
            <Flex direction="column" gap={6}>
                <Flex justify="space-between" align="center" gap={6}>
                    <Text fontSize="xl" fontWeight="semibold" color="accent-1">
                        Announcements
                    </Text>

                    <AddModal />
                </Flex>

                <Divider />

                <Table
                    data={announcements}
                    fetched={isAnnouncementsFetched}
                    th={['Description', 'Date', '']}
                    td={(announcement) => (
                        <Tr key={announcement._id}>
                            <Td>
                                <Text textTransform="capitalize">
                                    {announcement.description}
                                </Text>
                            </Td>

                            <Td>
                                <Text>
                                    {
                                        months[
                                            announcement.date.split('-')[1] - 1
                                        ]
                                    }{' '}
                                    {announcement.date.split('-')[2]},{' '}
                                    {announcement.date.split('-')[0]}
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
                                        <EditModal
                                            announcement={announcement}
                                        />

                                        <MenuItem
                                            icon={<FiTrash2 size={16} />}
                                            onClick={() =>
                                                onSubmit(announcement._id)
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

export default Announcements
