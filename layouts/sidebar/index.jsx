import NextLink from 'next/link'
import { useRouter } from 'next/router'
import {
    chakra,
    Flex,
    Grid,
    GridItem,
    Icon,
    Link,
    Text
} from '@chakra-ui/react'
import {
    FiFilePlus,
    FiFileText,
    FiGrid,
    FiLogOut,
    FiPieChart,
    FiSettings,
    FiStar,
    FiUsers,
    FiVolume2
} from 'react-icons/fi'

const Sidebar = ({ isAdmin, isEmployee, isSidebarOpen, onSidebarClose }) => {
    const router = useRouter()

    return (
        <>
            <chakra.div
                bg="hsla(0, 0%, 0%, 0.4)"
                display={{ base: 'block', lg: 'none' }}
                position="fixed"
                top={0}
                left={0}
                h="100vh"
                w="full"
                visibility={isSidebarOpen ? 'visible' : 'hidden'}
                opacity={isSidebarOpen ? 1 : 0}
                transition="0.4s ease-in-out"
                zIndex={99}
                onClick={onSidebarClose}
            />

            <chakra.aside
                bg={{ base: 'system', lg: 'trasparent' }}
                position="fixed"
                top={{ base: 0, lg: 'auto' }}
                left={{ base: isSidebarOpen ? 0 : -256, lg: 'auto' }}
                h={{ base: '100vh', lg: 'calc(100vh - 72px)' }}
                w={256}
                transition="0.4s ease-in-out"
                zIndex={100}
            >
                <Grid
                    templateRows={{ base: '72px 1fr auto', lg: '1fr auto' }}
                    h="full"
                >
                    <GridItem
                        display={{ base: 'grid', lg: 'none' }}
                        alignContent="center"
                        px={6}
                    >
                        <Text
                            fontSize="2xl"
                            fontWeight="semibold"
                            color="brand.default"
                        >
                            Citi<chakra.span color="accent-1">X</chakra.span>
                            press Inc.
                        </Text>
                    </GridItem>

                    <GridItem display="grid" alignContent="start" gap={1} p={6}>
                        {isAdmin && (
                            <>
                                <NextLink href="/admin/dashboard" passHref>
                                    <Link
                                        as="span"
                                        display="block"
                                        py={2}
                                        lineHeight={6}
                                        active={
                                            router.pathname.includes(
                                                'dashboard'
                                            )
                                                ? 1
                                                : 0
                                        }
                                        onClick={onSidebarClose}
                                    >
                                        <Flex align="center" gap={3}>
                                            <Icon as={FiPieChart} boxSize={4} />
                                            <Text>Dashboard</Text>
                                        </Flex>
                                    </Link>
                                </NextLink>

                                <NextLink href="/admin/company" passHref>
                                    <Link
                                        as="span"
                                        display="block"
                                        py={2}
                                        lineHeight={6}
                                        active={
                                            router.pathname.includes('company')
                                                ? 1
                                                : 0
                                        }
                                        onClick={onSidebarClose}
                                    >
                                        <Flex align="center" gap={3}>
                                            <Icon as={FiGrid} boxSize={4} />
                                            <Text>Company</Text>
                                        </Flex>
                                    </Link>
                                </NextLink>

                                <NextLink href="/admin/employees" passHref>
                                    <Link
                                        as="span"
                                        display="block"
                                        py={2}
                                        lineHeight={6}
                                        active={
                                            router.pathname.includes(
                                                'employees'
                                            )
                                                ? 1
                                                : 0
                                        }
                                        onClick={onSidebarClose}
                                    >
                                        <Flex align="center" gap={3}>
                                            <Icon as={FiUsers} boxSize={4} />
                                            <Text>Employees</Text>
                                        </Flex>
                                    </Link>
                                </NextLink>

                                <NextLink href="/admin/leaves" passHref>
                                    <Link
                                        as="span"
                                        display="block"
                                        py={2}
                                        lineHeight={6}
                                        active={
                                            router.pathname.includes('leaves')
                                                ? 1
                                                : 0
                                        }
                                        onClick={onSidebarClose}
                                    >
                                        <Flex align="center" gap={3}>
                                            <Icon as={FiLogOut} boxSize={4} />
                                            <Text>Leaves</Text>
                                        </Flex>
                                    </Link>
                                </NextLink>

                                <NextLink href="/admin/reports" passHref>
                                    <Link
                                        as="span"
                                        display="block"
                                        py={2}
                                        lineHeight={6}
                                        active={
                                            router.pathname.includes('reports')
                                                ? 1
                                                : 0
                                        }
                                        onClick={onSidebarClose}
                                    >
                                        <Flex align="center" gap={3}>
                                            <Icon as={FiFileText} boxSize={4} />
                                            <Text>Reports</Text>
                                        </Flex>
                                    </Link>
                                </NextLink>

                                <NextLink href="/admin/requests" passHref>
                                    <Link
                                        as="span"
                                        display="block"
                                        py={2}
                                        lineHeight={6}
                                        active={
                                            router.pathname.includes('requests')
                                                ? 1
                                                : 0
                                        }
                                        onClick={onSidebarClose}
                                    >
                                        <Flex align="center" gap={3}>
                                            <Icon as={FiFilePlus} boxSize={4} />
                                            <Text>Requests</Text>
                                        </Flex>
                                    </Link>
                                </NextLink>

                                <NextLink href="/admin/memo" passHref>
                                    <Link
                                        as="span"
                                        display="block"
                                        py={2}
                                        lineHeight={6}
                                        active={
                                            router.pathname.includes('memo')
                                                ? 1
                                                : 0
                                        }
                                        onClick={onSidebarClose}
                                    >
                                        <Flex align="center" gap={3}>
                                            <Icon as={FiVolume2} boxSize={4} />
                                            <Text>Memo</Text>
                                        </Flex>
                                    </Link>
                                </NextLink>

                                <NextLink href="/admin/accounts" passHref>
                                    <Link
                                        as="span"
                                        display="block"
                                        py={2}
                                        lineHeight={6}
                                        active={
                                            router.pathname.includes('accounts')
                                                ? 1
                                                : 0
                                        }
                                        onClick={onSidebarClose}
                                    >
                                        <Flex align="center" gap={3}>
                                            <Icon as={FiStar} boxSize={4} />
                                            <Text>Accounts</Text>
                                        </Flex>
                                    </Link>
                                </NextLink>

                                <NextLink href="/admin/settings" passHref>
                                    <Link
                                        as="span"
                                        display="block"
                                        py={2}
                                        lineHeight={6}
                                        active={
                                            router.pathname.includes('archive')
                                                ? 1
                                                : 0
                                        }
                                        onClick={onSidebarClose}
                                    >
                                        <Flex align="center" gap={3}>
                                            <Icon as={FiSettings} boxSize={4} />
                                            <Text>Settings</Text>
                                        </Flex>
                                    </Link>
                                </NextLink>
                            </>
                        )}

                        {isEmployee && (
                            <>
                                <NextLink href="/user/dashboard" passHref>
                                    <Link
                                        as="span"
                                        display="block"
                                        py={2}
                                        lineHeight={6}
                                        active={
                                            router.pathname.includes(
                                                'dashboard'
                                            )
                                                ? 1
                                                : 0
                                        }
                                        onClick={onSidebarClose}
                                    >
                                        <Flex align="center" gap={3}>
                                            <Icon as={FiPieChart} boxSize={4} />
                                            <Text>Dashboard</Text>
                                        </Flex>
                                    </Link>
                                </NextLink>

                                <NextLink href="/user/leaves" passHref>
                                    <Link
                                        as="span"
                                        display="block"
                                        py={2}
                                        lineHeight={6}
                                        active={
                                            router.pathname.includes('leaves')
                                                ? 1
                                                : 0
                                        }
                                        onClick={onSidebarClose}
                                    >
                                        <Flex align="center" gap={3}>
                                            <Icon as={FiLogOut} boxSize={4} />
                                            <Text>Leaves</Text>
                                        </Flex>
                                    </Link>
                                </NextLink>

                                <NextLink href="/user/reports" passHref>
                                    <Link
                                        as="span"
                                        display="block"
                                        py={2}
                                        lineHeight={6}
                                        active={
                                            router.pathname.includes('reports')
                                                ? 1
                                                : 0
                                        }
                                        onClick={onSidebarClose}
                                    >
                                        <Flex align="center" gap={3}>
                                            <Icon as={FiFileText} boxSize={4} />
                                            <Text>Reports</Text>
                                        </Flex>
                                    </Link>
                                </NextLink>

                                <NextLink href="/user/requests" passHref>
                                    <Link
                                        as="span"
                                        display="block"
                                        py={2}
                                        lineHeight={6}
                                        active={
                                            router.pathname.includes('requests')
                                                ? 1
                                                : 0
                                        }
                                        onClick={onSidebarClose}
                                    >
                                        <Flex align="center" gap={3}>
                                            <Icon as={FiFilePlus} boxSize={4} />
                                            <Text>Requests</Text>
                                        </Flex>
                                    </Link>
                                </NextLink>

                                <NextLink href="/user/settings" passHref>
                                    <Link
                                        as="span"
                                        display="block"
                                        py={2}
                                        lineHeight={6}
                                        active={
                                            router.pathname.includes('archive')
                                                ? 1
                                                : 0
                                        }
                                        onClick={onSidebarClose}
                                    >
                                        <Flex align="center" gap={3}>
                                            <Icon as={FiSettings} boxSize={4} />
                                            <Text>Settings</Text>
                                        </Flex>
                                    </Link>
                                </NextLink>
                            </>
                        )}
                    </GridItem>

                    <GridItem></GridItem>
                </Grid>
            </chakra.aside>
        </>
    )
}

export default Sidebar
