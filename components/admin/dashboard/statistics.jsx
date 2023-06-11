import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Flex, GridItem, Icon, Text } from '@chakra-ui/react'
import { FiBell, FiFile, FiFileText, FiUsers } from 'react-icons/fi'
import Card from 'components/card'

const Statistics = () => {
    const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () =>
        api.all('/users')
    )
    const { data: leaves, isFetched: isLeavesFetched } = useQuery(
        ['leaves'],
        () => api.all('/leaves')
    )
    const { data: reports, isFetched: isReportsFetched } = useQuery(
        ['reports'],
        () => api.all('/reports')
    )
    const { data: requests, isFetched: isRequestsFetched } = useQuery(
        ['requests'],
        () => api.all('/requests')
    )

    return (
        <>
            <GridItem colSpan={{ base: 12, md: 6, '2xl': 3 }}>
                <Card>
                    <Flex justify="space-between" align="center">
                        <Flex direction="column" gap={1} w="calc(100% - 76px)">
                            <Text
                                fontSize="2xl"
                                fontWeight="semibold"
                                color="accent-1"
                                noOfLines={1}
                            >
                                {isUsersFetched
                                    ? users.filter(
                                          (user) => user.role === 'Employee'
                                      ).length
                                    : 0}
                            </Text>

                            <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="accent-1"
                            >
                                Total Employees
                            </Text>
                        </Flex>

                        <Flex
                            bg="brand.default"
                            justify="center"
                            align="center"
                            borderRadius="full"
                            h={16}
                            w={16}
                        >
                            <Icon as={FiUsers} boxSize={6} color="white" />
                        </Flex>
                    </Flex>
                </Card>
            </GridItem>

            <GridItem colSpan={{ base: 12, md: 6, '2xl': 3 }}>
                <Card>
                    <Flex justify="space-between" align="center">
                        <Flex direction="column" gap={1} w="calc(100% - 76px)">
                            <Text
                                fontSize="2xl"
                                fontWeight="semibold"
                                color="accent-1"
                                noOfLines={1}
                            >
                                {isLeavesFetched
                                    ? leaves.filter(
                                          (leave) => leave.status === 'waiting'
                                      ).length
                                    : 0}
                            </Text>

                            <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="accent-1"
                            >
                                Pending Leaves
                            </Text>
                        </Flex>

                        <Flex
                            bg="brand.default"
                            justify="center"
                            align="center"
                            borderRadius="full"
                            h={16}
                            w={16}
                        >
                            <Icon as={FiBell} boxSize={6} color="white" />
                        </Flex>
                    </Flex>
                </Card>
            </GridItem>

            <GridItem colSpan={{ base: 12, md: 6, '2xl': 3 }}>
                <Card>
                    <Flex justify="space-between" align="center">
                        <Flex direction="column" gap={1} w="calc(100% - 76px)">
                            <Text
                                fontSize="2xl"
                                fontWeight="semibold"
                                color="accent-1"
                                noOfLines={1}
                            >
                                {isReportsFetched
                                    ? reports.filter(
                                          (report) => report.status === 'unread'
                                      ).length
                                    : 0}
                            </Text>

                            <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="accent-1"
                            >
                                Unread Reports
                            </Text>
                        </Flex>

                        <Flex
                            bg="brand.default"
                            justify="center"
                            align="center"
                            borderRadius="full"
                            h={16}
                            w={16}
                        >
                            <Icon as={FiFile} boxSize={6} color="white" />
                        </Flex>
                    </Flex>
                </Card>
            </GridItem>

            <GridItem colSpan={{ base: 12, md: 6, '2xl': 3 }}>
                <Card>
                    <Flex justify="space-between" align="center">
                        <Flex direction="column" gap={1} w="calc(100% - 76px)">
                            <Text
                                fontSize="2xl"
                                fontWeight="semibold"
                                color="accent-1"
                                noOfLines={1}
                            >
                                {isRequestsFetched
                                    ? requests.filter(
                                          (request) =>
                                              request.status === 'waiting'
                                      ).length
                                    : 0}
                            </Text>

                            <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="accent-1"
                            >
                                Pending Request
                            </Text>
                        </Flex>

                        <Flex
                            bg="brand.default"
                            justify="center"
                            align="center"
                            borderRadius="full"
                            h={16}
                            w={16}
                        >
                            <Icon as={FiFileText} boxSize={6} color="white" />
                        </Flex>
                    </Flex>
                </Card>
            </GridItem>
        </>
    )
}

export default Statistics
