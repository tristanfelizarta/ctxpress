import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from 'instance'
import {
    Button,
    chakra,
    Divider,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Select,
    Text,
    useToast
} from '@chakra-ui/react'
import Card from 'components/card'
import Toast from 'components/toast'

const Information = ({ user, departments, designations }) => {
    const queryClient = useQueryClient()
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm()

    const userInformation = useMutation(
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

    const onSubmit = (data) => {
        setIsLoading(true)
        userInformation.mutate(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <Flex direction="column" gap={6}>
                    <Flex justify="space-between" align="center" gap={6}>
                        <Text
                            fontSize="xl"
                            fontWeight="semibold"
                            color="accent-1"
                        >
                            Personal Information
                        </Text>

                        <Button
                            type="submit"
                            size="lg"
                            colorScheme="brand"
                            isLoading={isLoading}
                        >
                            Save Changes
                        </Button>
                    </Flex>

                    <Divider />

                    <FormControl>
                        <FormLabel>Identification</FormLabel>
                        <Input
                            value={user._id.toUpperCase()}
                            size="lg"
                            cursor="not-allowed"
                            readOnly
                        />
                    </FormControl>

                    <FormControl isInvalid={errors.name}>
                        <FormLabel>Full Name</FormLabel>
                        <Input
                            defaultValue={user.name}
                            size="lg"
                            {...register('name', { required: true })}
                        />
                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Email Address</FormLabel>
                        <Input
                            value={user.email}
                            size="lg"
                            cursor="not-allowed"
                            readOnly
                        />
                    </FormControl>

                    <Flex align="start" gap={6}>
                        <FormControl isInvalid={errors.contact}>
                            <FormLabel>Contact</FormLabel>
                            <Input
                                type="number"
                                defaultValue={user.contact}
                                size="lg"
                                {...register('contact', { required: true })}
                            />
                            <FormErrorMessage>
                                This field is required.
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={errors.gender}>
                            <FormLabel>Gender</FormLabel>

                            <Select
                                placeholder="Select"
                                defaultValue={user.gender}
                                size="lg"
                                {...register('gender', { required: true })}
                            >
                                <chakra.option value="male">Male</chakra.option>
                                <chakra.option value="Female">
                                    Female
                                </chakra.option>
                            </Select>

                            <FormErrorMessage>
                                This field is required.
                            </FormErrorMessage>
                        </FormControl>
                    </Flex>

                    <FormControl isInvalid={errors.address}>
                        <FormLabel>Address</FormLabel>
                        <Input
                            defaultValue={user.address}
                            size="lg"
                            {...register('address', { required: true })}
                        />
                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    <Divider />

                    <Flex align="start" gap={6}>
                        <FormControl>
                            <FormLabel>Department</FormLabel>

                            <Select
                                defaultValue={user.department}
                                size="lg"
                                {...register('department')}
                            >
                                {departments.map((department) => (
                                    <chakra.option
                                        textTransform="capitalize"
                                        value={department.name}
                                        key={department._id}
                                    >
                                        {department.name}
                                    </chakra.option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Designation</FormLabel>

                            <Select
                                defaultValue={user.designation}
                                size="lg"
                                {...register('designation')}
                            >
                                {designations.map((designation) => (
                                    <chakra.option
                                        textTransform="capitalize"
                                        value={designation.name}
                                        key={designation._id}
                                    >
                                        {designation.name}
                                    </chakra.option>
                                ))}
                            </Select>
                        </FormControl>
                    </Flex>

                    <Flex align="start" gap={6}>
                        <FormControl isInvalid={errors.hired_date}>
                            <FormLabel>Hired Date</FormLabel>
                            <Input
                                type="date"
                                defaultValue={user.hired_date}
                                size="lg"
                                {...register('hired_date', { required: true })}
                            />
                            <FormErrorMessage>
                                This field is required.
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={errors.contract_end_date}>
                            <FormLabel>Contract End Date</FormLabel>
                            <Input
                                type="date"
                                defaultValue={user.contract_end_date}
                                size="lg"
                                {...register('contract_end_date')}
                            />
                        </FormControl>
                    </Flex>
                </Flex>
            </Card>
        </form>
    )
}

export default Information
