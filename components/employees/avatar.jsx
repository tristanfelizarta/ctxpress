import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import api from 'instance'
import {
    Avatar as ChakraAvatar,
    Box,
    chakra,
    Flex,
    Icon,
    Input,
    Spinner,
    useToast
} from '@chakra-ui/react'
import { FiCamera } from 'react-icons/fi'
import Card from 'components/card'
import Toast from 'components/toast'

const Avatar = ({ user }) => {
    const queryClient = useQueryClient()
    const [image, setImage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const handleImage = (e) => {
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

        if (file.size > 5120 * 5120) {
            toast({
                position: 'top',
                render: () => (
                    <Toast
                        title="Error"
                        description="Largest image size is 5mb."
                        status="error"
                    />
                )
            })

            return
        }

        if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
            toast({
                position: 'top',
                render: () => (
                    <Toast
                        title="Error"
                        description="Image format is incorrect."
                        status="error"
                    />
                )
            })

            return
        }

        setImage(file)
    }

    const uploadImage = useMutation(
        (data) => api.update('/users/avatar', user._id, data),
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
                            description="Avatar updated successfully."
                        />
                    )
                })
            }
        }
    )

    useEffect(() => {
        if (image) {
            setIsLoading(true)

            const upload = async () => {
                for (const item of [image]) {
                    const formData = new FormData()

                    formData.append('file', item)
                    formData.append('upload_preset', 'ctx-hrms')

                    let res = await axios.post(
                        'https://api.cloudinary.com/v1_1/ctx-hrms/image/upload',
                        formData
                    )

                    uploadImage.mutate({
                        image: res.data.secure_url
                    })
                }
            }

            upload()
        }
    }, [image])

    return (
        <Card position="relative">
            {isLoading && (
                <Spinner
                    position="absolute"
                    top={6}
                    right={6}
                    color="brand.default"
                />
            )}

            <Flex justify="center" p={6}>
                <Box position="relative">
                    <chakra.a href={user.image} target="_blank">
                        <ChakraAvatar
                            name={user.name}
                            src={user.image}
                            size="2xl"
                        />
                    </chakra.a>

                    <Flex
                        bg="white"
                        overflow="hidden"
                        position="absolute"
                        bottom={0}
                        right={0}
                        justify="center"
                        align="center"
                        border="1px"
                        borderColor="border"
                        borderRadius="full"
                        h={8}
                        w={8}
                    >
                        <Icon as={FiCamera} size={16} />
                        <Input
                            type="file"
                            position="absolute"
                            left={0}
                            h={24}
                            w={24}
                            cursor="pointer"
                            opacity={0}
                            onChange={handleImage}
                        />
                    </Flex>
                </Box>
            </Flex>
        </Card>
    )
}

export default Avatar
