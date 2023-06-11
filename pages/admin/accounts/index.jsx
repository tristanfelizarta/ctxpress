import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import {
    Avatar,
    Badge,
    chakra,
    Container,
    Flex,
    IconButton,
    Select,
    Td,
    Text,
    Tr
} from '@chakra-ui/react'
import Card from 'components/card'
import Table from 'components/table'
import { months } from 'functions/months'
import { FiMoreHorizontal } from 'react-icons/fi'

const Accounts = () => {
    const router = useRouter()
    const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () =>
        api.all('users')
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
                            Accounts
                        </Text>
                    </Flex>

                    <Table
                        data={users}
                        fetched={isUsersFetched}
                        th={[
                            'Full Name',
                            'Email',
                            'Status',
                            'Role',
                            'Joined',
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
                                        <Text>{user.name}</Text>
                                    </Flex>
                                </Td>

                                <Td>
                                    <Text>{user.email}</Text>
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

                                <Td>
                                    <Badge
                                        variant="tinted"
                                        textTransform="capitalize"
                                        colorScheme={
                                            user.role === 'Admin'
                                                ? 'yellow'
                                                : user.role === 'Employee'
                                                ? 'blue'
                                                : user.role === 'User' && 'red'
                                        }
                                    >
                                        {user.role}
                                    </Badge>
                                </Td>

                                <Td>
                                    <Text>
                                        {
                                            months[
                                                user.created
                                                    .split(',')[0]
                                                    .split('/')[0] - 1
                                            ]
                                        }{' '}
                                        {
                                            user.created
                                                .split(',')[0]
                                                .split('/')[1]
                                        }
                                        ,{' '}
                                        {
                                            user.created
                                                .split(',')[0]
                                                .split('/')[2]
                                        }
                                    </Text>
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
                            <Flex flex={1} justify="end" align="center" gap={3}>
                                <Select
                                    placeholder="Status"
                                    size="lg"
                                    w="auto"
                                    {...register('status')}
                                >
                                    <chakra.option value="active">
                                        Active
                                    </chakra.option>
                                    <chakra.option value="warning">
                                        Warning
                                    </chakra.option>
                                    <chakra.option value="suspended">
                                        Suspended
                                    </chakra.option>
                                    <chakra.option value="restricted">
                                        Restricted
                                    </chakra.option>
                                    <chakra.option value="terminated">
                                        Terminated
                                    </chakra.option>
                                    <chakra.option value="resigned">
                                        Resigned
                                    </chakra.option>
                                </Select>

                                <Select
                                    placeholder="Role"
                                    size="lg"
                                    w="auto"
                                    {...register('role')}
                                >
                                    <chakra.option value="Admin">
                                        Admin
                                    </chakra.option>
                                    <chakra.option value="Employee">
                                        Employee
                                    </chakra.option>
                                    <chakra.option value="User">
                                        User
                                    </chakra.option>
                                </Select>
                            </Flex>
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
                                                    watch(
                                                        'search'
                                                    ).toLowerCase()
                                            )
                                    )
                                )
                                .filter((data) =>
                                    watch('status')
                                        ? watch('status') === data.status
                                        : data
                                )
                                .filter((data) =>
                                    watch('role')
                                        ? watch('role') === data.role
                                        : data
                                )
                        }}
                    />
                </Flex>
            </Card>
        </Container>
    )
}

export default Accounts
