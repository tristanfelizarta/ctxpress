import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import api from 'instance'
import {
    Button,
    chakra,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    IconButton,
    Input,
    Select,
    Text,
    useToast
} from '@chakra-ui/react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import Card from 'components/card'
import Toast from 'components/toast'

const Status = ({ user }) => {
    const { data: session } = useSession()
    const queryClient = useQueryClient()
    const [isLoading, setIsLoading] = useState(false)
    const [files, setFiles] = useState(null)
    const toast = useToast()

    const {
        register,
        setValue,
        watch,
        formState: { errors },
        handleSubmit
    } = useForm()

    const handleFiles = (e) => {
        const file = e.target.files[0]

        if (!file) {
            toast({
                position: 'top',
                render: () => (
                    <Toast
                        title="Error"
                        description="file does not exists."
                        status="error"
                    />
                )
            })

            return
        }

        setFiles(file)
    }

    const userStatus = useMutation(
        (data) => api.update('/users', user._id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('users')
                setIsLoading(false)

                toast({
                    position: 'top',
                    duration: 1000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="Employee updated successfully."
                        />
                    )
                })
            }
        }
    )

    const deleteFile = useMutation(
        (data) => api.update('/users', user._id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('users')
                setFiles(null)
                setIsLoading(false)

                toast({
                    position: 'top',
                    duration: 1000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="File deleted successfully."
                        />
                    )
                })
            }
        }
    )

    const onSubmit = (data) => {
        setIsLoading(true)

        if (data.status === 'active') {
            userStatus.mutate({
                status: 'active',
                suspended: {
                    duration: ''
                }
            })
        } else if (data.status === 'warning') {
            userStatus.mutate({
                status: 'warning',
                suspended: {
                    duration: ''
                }
            })
        } else if (data.status === 'suspended') {
            userStatus.mutate({
                status: 'suspended',
                suspended: {
                    duration: data.duration
                }
            })
        } else if (data.status === 'restricted') {
            userStatus.mutate({
                status: 'restricted',
                suspended: {
                    duration: ''
                }
            })
        } else {
            return
        }
    }

    const onDeleteTerminatedFile = () => {
        setIsLoading(true)

        deleteFile.mutate({
            terminated: {
                files: ''
            }
        })
    }

    const onDeleteResignedFile = () => {
        setIsLoading(true)

        deleteFile.mutate({
            resigned: {
                files: ''
            }
        })
    }

    useEffect(() => {
        setValue('status', user.status)
    }, [])

    useEffect(() => {
        if (watch('status') === 'terminated' && files) {
            const onSubmit = async () => {
                setIsLoading(true)
                let res = null

                for (const item of [files]) {
                    const formData = new FormData()

                    formData.append('file', item)
                    formData.append('upload_preset', 'ctx-hrms')

                    res = await axios.post(
                        'https://api.cloudinary.com/v1_1/ctx-hrms/raw/upload',
                        formData
                    )
                }

                userStatus.mutate({
                    status: 'terminated',
                    suspended: {
                        duration: ''
                    },
                    terminated: {
                        files: res.data.secure_url
                    }
                })
            }

            onSubmit()
        }

        if (watch('status') === 'resigned' && files) {
            const onSubmit = async () => {
                setIsLoading(true)
                let res = null

                for (const item of [files]) {
                    const formData = new FormData()

                    formData.append('file', item)
                    formData.append('upload_preset', 'ctx-hrms')

                    res = await axios.post(
                        'https://api.cloudinary.com/v1_1/ctx-hrms/raw/upload',
                        formData
                    )
                }

                userStatus.mutate({
                    status: 'resigned',
                    suspended: {
                        duration: ''
                    },
                    resigned: {
                        files: res.data.secure_url
                    }
                })
            }

            onSubmit()
        }
    }, [files])

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Flex direction="column" gap={6}>
                    <Flex justify="space-between" align="center" gap={6}>
                        <Text
                            fontSize="xl"
                            fontWeight="semibold"
                            color="accent-1"
                        >
                            Status
                        </Text>

                        <chakra.span
                            bg={
                                watch('status') === 'active'
                                    ? 'brand.default'
                                    : watch('status') === 'warning'
                                    ? 'yellow.default'
                                    : watch('status') === 'suspended'
                                    ? 'yellow.default'
                                    : watch('status') === 'restricted'
                                    ? 'red.default'
                                    : watch('status') === 'terminated'
                                    ? 'red.default'
                                    : watch('status') === 'resigned' &&
                                      'accent-5'
                            }
                            borderRadius="full"
                            h={5}
                            w={5}
                        />
                    </Flex>

                    <Select
                        defaultValue={user.status}
                        size="lg"
                        disabled={session.user.role !== 'Admin'}
                        {...register('status')}
                    >
                        <option value="active">Active</option>
                        <option value="warning">Warning</option>
                        <option value="suspended">Suspended</option>
                        <option value="restricted">Restricted</option>
                        <option value="terminated">Terminated</option>
                        <option value="resigned">Resigned</option>
                    </Select>

                    {watch('status') === 'suspended' && (
                        <FormControl isInvalid={errors.duration}>
                            <FormLabel>Duration</FormLabel>
                            <Input
                                type="date"
                                defaultValue={user.suspended.duration}
                                size="lg"
                                {...register('duration', { required: true })}
                            />
                            <FormErrorMessage>
                                This field is required.
                            </FormErrorMessage>
                        </FormControl>
                    )}

                    {watch('status') === 'terminated' && (
                        <FormControl>
                            <FormLabel>Supporting Docs</FormLabel>

                            {user.terminated.files ? (
                                <Flex gap={3}>
                                    <Button
                                        as="a"
                                        w="full"
                                        href={user.terminated.files}
                                        target="_blank"
                                        size="lg"
                                        cursor="pointer"
                                    >
                                        {user.terminated.files.split('/')[6]}.
                                        {
                                            user.terminated.files
                                                .split('/')[7]
                                                .split('.')[1]
                                        }
                                    </Button>

                                    {session.user.role === 'Admin' && (
                                        <IconButton
                                            variant="tinted"
                                            size="lg"
                                            colorScheme="red"
                                            icon={<FiTrash2 size={16} />}
                                            onClick={onDeleteTerminatedFile}
                                        />
                                    )}
                                </Flex>
                            ) : (
                                <Flex gap={3}>
                                    <Flex flex={1}>
                                        <Button
                                            w="full"
                                            size="lg"
                                            cursor="default"
                                        >
                                            {isLoading && 'Uploading...'}
                                        </Button>
                                    </Flex>

                                    <Flex
                                        position="relative"
                                        overflow="hidden"
                                        transition=".2s"
                                        _active={{ transform: 'scale(.95)' }}
                                    >
                                        <Input
                                            type="file"
                                            position="absolute"
                                            left={-32}
                                            h="full"
                                            w={300}
                                            opacity={0}
                                            cursor="pointer"
                                            zIndex={1}
                                            onChange={handleFiles}
                                        />
                                        <IconButton
                                            variant="tinted"
                                            size="lg"
                                            colorScheme="brand"
                                            icon={<FiPlus size={16} />}
                                        />
                                    </Flex>
                                </Flex>
                            )}

                            <FormErrorMessage>
                                This field is required.
                            </FormErrorMessage>
                        </FormControl>
                    )}

                    {watch('status') === 'resigned' && (
                        <FormControl>
                            <FormLabel>Resignation File</FormLabel>

                            {user.resigned.files ? (
                                <Flex gap={3}>
                                    <Button
                                        as="a"
                                        w="full"
                                        href={user.resigned.files}
                                        target="_blank"
                                        size="lg"
                                        cursor="pointer"
                                    >
                                        {user.resigned.files.split('/')[6]}.
                                        {
                                            user.resigned.files
                                                .split('/')[7]
                                                .split('.')[1]
                                        }
                                    </Button>

                                    {session.user.role === 'Admin' && (
                                        <IconButton
                                            variant="tinted"
                                            size="lg"
                                            colorScheme="red"
                                            icon={<FiTrash2 size={16} />}
                                            onClick={onDeleteResignedFile}
                                        />
                                    )}
                                </Flex>
                            ) : (
                                <Flex gap={3}>
                                    <Flex flex={1}>
                                        <Button
                                            w="full"
                                            size="lg"
                                            cursor="default"
                                        >
                                            {isLoading && 'Uploading...'}
                                        </Button>
                                    </Flex>

                                    <Flex
                                        position="relative"
                                        overflow="hidden"
                                        transition=".2s"
                                        _active={{ transform: 'scale(.95)' }}
                                    >
                                        <Input
                                            type="file"
                                            position="absolute"
                                            left={-32}
                                            h="full"
                                            w={300}
                                            opacity={0}
                                            cursor="pointer"
                                            zIndex={1}
                                            onChange={handleFiles}
                                        />
                                        <IconButton
                                            variant="tinted"
                                            size="lg"
                                            colorScheme="brand"
                                            icon={<FiPlus size={16} />}
                                        />
                                    </Flex>
                                </Flex>
                            )}

                            <FormErrorMessage>
                                This field is required.
                            </FormErrorMessage>
                        </FormControl>
                    )}

                    {watch('status') !== user.status &&
                        watch('status') !== 'terminated' &&
                        watch('status') !== 'resigned' && (
                            <Button
                                type="submit"
                                variant="tinted"
                                size="lg"
                                colorScheme="brand"
                                isLoading={isLoading}
                            >
                                Save Changes
                            </Button>
                        )}
                </Flex>
            </form>
        </Card>
    )
}

export default Status
