import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from 'instance'
import { chakra, Flex, Select, Text, useToast } from '@chakra-ui/react'
import Card from 'components/card'
import Toast from 'components/toast'

const Role = ({ user }) => {
    const { data: session } = useSession()
    const queryClient = useQueryClient()
    const { register, setValue, watch } = useForm()
    const toast = useToast()

    const userRole = useMutation(
        (data) => api.update('/users', user._id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('users')

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

    useEffect(() => {
        if (user.role === 'Admin') {
            if (watch('role') !== user.role) {
                userRole.mutate({
                    role: watch('role')
                })
            }
        }
    }, [watch('role')])

    useEffect(() => {
        setValue('role', user.role)
    }, [])

    return (
        <Card>
            <Flex direction="column" gap={6}>
                <Flex justify="space-between" align="center" gap={6}>
                    <Text fontSize="xl" fontWeight="semibold" color="accent-1">
                        Role
                    </Text>

                    <chakra.span
                        bg={
                            watch('role') === 'Admin'
                                ? 'yellow.default'
                                : watch('role') === 'Employee'
                                ? 'blue.default'
                                : watch('role') === 'User' && 'red.default'
                        }
                        borderRadius="full"
                        h={5}
                        w={5}
                    />
                </Flex>

                <Select
                    defaultValue={user.role}
                    size="lg"
                    disabled={session.user.role !== 'Admin'}
                    {...register('role')}
                >
                    <option value="Admin">Admin</option>
                    <option value="Employee">Employee</option>
                    <option value="User">User</option>
                </Select>
            </Flex>
        </Card>
    )
}

export default Role
