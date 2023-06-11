import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { chakra, Flex, Spinner, useDisclosure } from '@chakra-ui/react'
import Header from './header'
import Sidebar from './sidebar'
import Suspended from 'components/checkpoints/suspended'
import Terminated from 'components/checkpoints/terminated'
import Resigned from 'components/checkpoints/resigned'

const AppLayout = (props) => {
    const router = useRouter()
    const { data: session, status } = useSession()
    const isAdmin = session
        ? session.user.role === 'Admin'
            ? true
            : false
        : false
    const isEmployee = session
        ? session.user.role === 'Employee'
            ? true
            : false
        : false
    const isUser = session
        ? session.user.role === 'User'
            ? true
            : false
        : true
    const {
        isOpen: isSidebarOpen,
        onOpen: onSidebarOpen,
        onClose: onSidebarClose
    } = useDisclosure()

    if (status === 'loading') {
        return (
            <Flex justify="center" align="center" h="100vh" w="full">
                <Spinner
                    size="xl"
                    thickness={2}
                    speed="0.8s"
                    emptyColor="canvas-1"
                    color="brand.default"
                />
            </Flex>
        )
    } else {
        if (session && session.user.status === 'suspended') {
            return (
                <>
                    <Header
                        session={session}
                        isAdmin={isAdmin}
                        isEmployee={isEmployee}
                        onSidebarOpen={onSidebarOpen}
                    />
                    <Suspended />
                </>
            )
        }

        if (session && session.user.status === 'terminated') {
            return (
                <>
                    <Header
                        session={session}
                        isAdmin={isAdmin}
                        isEmployee={isEmployee}
                        onSidebarOpen={onSidebarOpen}
                    />
                    <Terminated />
                </>
            )
        }

        if (session && session.user.status === 'resigned') {
            return (
                <>
                    <Header
                        session={session}
                        isAdmin={isAdmin}
                        isEmployee={isEmployee}
                        onSidebarOpen={onSidebarOpen}
                    />
                    <Resigned />
                </>
            )
        }

        if (
            (!isEmployee && router.pathname.includes('user')) ||
            (!isAdmin && router.pathname.includes('admin'))
        ) {
            router.push('/')
            return null
        }

        if (isEmployee && !router.pathname.includes('user')) {
            router.push('/user/dashboard')
            return null
        }

        if (isAdmin && !router.pathname.includes('admin')) {
            router.push('/admin/dashboard')
            return null
        }

        return (
            <chakra.div position="relative" h="auto" w="full">
                <Header
                    session={session}
                    isUser={isUser}
                    onSidebarOpen={onSidebarOpen}
                />

                <chakra.div position="relative" mx="auto" w="full" maxW={1536}>
                    {!isUser && (
                        <Sidebar
                            isAdmin={isAdmin}
                            isEmployee={isEmployee}
                            isSidebarOpen={isSidebarOpen}
                            onSidebarClose={onSidebarClose}
                        />
                    )}
                    <chakra.main
                        ml={{ base: 'full', lg: !isUser ? 256 : 'full' }}
                        w="full"
                        maxW={{
                            base: 'full',
                            lg: !isUser ? 'calc(100% - 256px)' : 'full'
                        }}
                        {...props}
                    />
                </chakra.div>
            </chakra.div>
        )
    }
}

export default AppLayout
