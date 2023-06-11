import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { signIn, signOut } from 'next-auth/react'
import {
    Avatar,
    chakra,
    Flex,
    IconButton,
    Link,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Text,
    useColorMode,
    useColorModeValue
} from '@chakra-ui/react'
import { FiLogOut, FiMenu, FiMoon, FiSun } from 'react-icons/fi'
import { Google } from 'components/logos'

const Header = ({ session, isUser, onSidebarOpen }) => {
    const router = useRouter()
    const { colorMode, toggleColorMode } = useColorMode()
    const colorModeIcon = useColorModeValue(
        <FiMoon size={16} fill="currentColor" />,
        <FiSun size={16} fill="currentColor" />
    )
    const [animate, setAnimate] = useState(false)
    const [isScrolling, setIsScrolling] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimate(true)
        }, 1000)

        return () => {
            clearTimeout(timer)
        }
    }, [])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', () => {
                setIsScrolling(window.pageYOffset > 0)
            })
        }
    }, [])

    return (
        <chakra.header
            bg="white"
            position="sticky"
            top={0}
            borderBottom={
                router.pathname.includes('admin') ||
                router.pathname.includes('user')
                    ? '1px solid'
                    : 'none'
            }
            borderColor="border"
            shadow={isScrolling && 'sm'}
            transition=".4s"
            zIndex={99}
            _dark={{ bg: 'surface', shadow: isScrolling && 'dark-xl' }}
        >
            <Flex
                align="center"
                gap={6}
                mx="auto"
                px={6}
                h="72px"
                w="full"
                maxW={1536}
            >
                <Flex justify="start" align="center">
                    <Flex align="center" gap={3}>
                        {session && (
                            <IconButton
                                display={{ base: 'flex', lg: 'none' }}
                                icon={<FiMenu size={20} />}
                                onClick={onSidebarOpen}
                            />
                        )}

                        <Text
                            display={{
                                base: session ? 'none' : 'block',
                                lg: 'block'
                            }}
                            fontSize="2xl"
                            fontWeight="semibold"
                            color="brand.default"
                        >
                            Citi<chakra.span color="accent-1">X</chakra.span>
                            press Inc.
                        </Text>
                    </Flex>
                </Flex>

                <Flex flex={1} justify="end" align="center" gap={8}>
                    {isUser && (
                        <Flex
                            display={{ base: 'none', lg: 'flex' }}
                            align="center"
                            gap={8}
                        >
                            <Link active={1}>Home</Link>
                            <Link>Services</Link>
                            <Link>Careers</Link>
                            <Link>Company</Link>
                            <Link>Call Us</Link>
                        </Flex>
                    )}

                    {session ? (
                        <Menu>
                            <MenuButton>
                                <Avatar
                                    name={session.user.name}
                                    src={session.user.image}
                                />
                            </MenuButton>

                            <MenuList w={256}>
                                <MenuItem
                                    onClick={() =>
                                        session.user.role === 'Admin'
                                            ? router.push('/admin')
                                            : router.push('/user')
                                    }
                                >
                                    <Flex align="center" gap={3}>
                                        <Avatar
                                            name={session.user.name}
                                            src={session.user.image}
                                        />
                                        <Text color="accent-1">
                                            {session.user.name}
                                        </Text>
                                    </Flex>
                                </MenuItem>

                                <MenuDivider />

                                <MenuItem
                                    textTransform="capitalize"
                                    icon={colorModeIcon}
                                    onClick={toggleColorMode}
                                >
                                    {colorMode} Mode
                                </MenuItem>

                                <MenuItem
                                    icon={<FiLogOut size={16} />}
                                    onClick={() => signOut()}
                                >
                                    Sign out
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    ) : (
                        <Flex gap={3}>
                            <IconButton
                                borderRadius="full"
                                icon={colorModeIcon}
                                onClick={toggleColorMode}
                            />

                            <chakra.button
                                bg="brand.default"
                                overflow="hidden"
                                borderRadius="full"
                                w={{ base: '40px', lg: animate ? '155px' : 10 }}
                                transition="width .8s, transform .2s"
                                _active={{ transform: 'scale(.95)' }}
                                onClick={() => signIn('google')}
                            >
                                <Flex
                                    align="center"
                                    gap={2}
                                    pl={2}
                                    pr={2}
                                    h={10}
                                    w="155px"
                                >
                                    <Flex
                                        bg="white"
                                        justify="center"
                                        align="center"
                                        borderRadius="full"
                                        h={6}
                                        w={6}
                                    >
                                        <Google size={16} />
                                    </Flex>

                                    <Text
                                        w="100px"
                                        visibility={
                                            animate ? 'visible' : 'hidden'
                                        }
                                        transitionDelay=".8s"
                                        transition=".8s"
                                        fontSize="sm"
                                        fontWeight="medium"
                                        color="white"
                                    >
                                        Google Sign in
                                    </Text>
                                </Flex>
                            </chakra.button>
                        </Flex>
                    )}
                </Flex>
            </Flex>
        </chakra.header>
    )
}

export default Header
