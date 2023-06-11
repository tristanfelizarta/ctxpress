import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Flex, GridItem, Icon, Text } from '@chakra-ui/react'
import { FiBell, FiFile, FiFileText } from 'react-icons/fi'
import Card from 'components/card'

const Statistics = () => {
    const { data: session } = useSession()
    const { data: leaves, isFetched: isLeavesFetched } = useQuery(
        ['employee_leaves'],
        () => api.get('/leaves/employee', session.user.id)
    )
    const { data: reports, isFetched: isReportsFetched } = useQuery(
        ['employee_reports'],
        () => api.get('/reports/employee', session.user.id)
    )
    const { data: requests, isFetched: isRequestsFetched } = useQuery(
        ['employee_requests'],
        () => api.get('/requests/employee', session.user.id)
    )

    return (
        <>
            <GridItem colSpan={{ base: 12, xl: 4 }}>
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

            <GridItem colSpan={{ base: 12, xl: 4 }}>
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

            <GridItem colSpan={{ base: 12, xl: 4 }}>
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
