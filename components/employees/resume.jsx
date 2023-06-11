import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import api from 'instance'
import {
    Button,
    Flex,
    IconButton,
    Input,
    Text,
    useToast
} from '@chakra-ui/react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import Card from 'components/card'
import Toast from 'components/toast'

const Resume = ({ user }) => {
    const { data: session } = useSession()
    const queryClient = useQueryClient()
    const [files, setFiles] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

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

    const uploadFile = useMutation(
        (data) => api.update('/users/resume', user._id, data),
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
                            description="File uploded successfully."
                        />
                    )
                })
            }
        }
    )

    const deleteFile = useMutation(
        (data) => api.update('/users/resume', user._id, data),
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

    const onDelete = () => {
        setIsLoading(true)

        deleteFile.mutate({
            resume: ''
        })
    }

    useEffect(() => {
        if (files) {
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

                uploadFile.mutate({
                    resume: res.data.secure_url
                })
            }

            onSubmit()
        }
    }, [files])

    return (
        <Card>
            <Flex direction="column" gap={6}>
                <Flex justify="space-between" align="center" gap={6}>
                    <Text fontSize="xl" fontWeight="semibold" color="accent-1">
                        201 Files
                    </Text>
                </Flex>

                {user.resume ? (
                    <Flex gap={3}>
                        <Button
                            as="a"
                            w="full"
                            href={user.resume}
                            target="_blank"
                            size="lg"
                            cursor="pointer"
                        >
                            {user.resume.split('/')[6]}.
                            {user.resume.split('/')[7].split('.')[1]}
                        </Button>

                        {session.user.role === 'Admin' && (
                            <IconButton
                                variant="tinted"
                                size="lg"
                                colorScheme="red"
                                icon={<FiTrash2 size={16} />}
                                onClick={onDelete}
                            />
                        )}
                    </Flex>
                ) : (
                    <Flex gap={3}>
                        <Flex flex={1}>
                            <Button w="full" size="lg" cursor="default">
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
            </Flex>
        </Card>
    )
}

export default Resume
