import { Box, Button, chakra, Flex, Text, useColorMode } from '@chakra-ui/react'

const Hero = () => {
    const { colorMode } = useColorMode()

    return (
        <Flex gap={12} h="624px">
            <Flex flex={1} justify="start" align="center">
                <Flex align="start" direction="column" gap={6}>
                    <Text
                        fontSize={{ base: 40, md: 48, xl: 64 }}
                        fontWeight="bold"
                        lineHeight={1}
                        letterSpacing={0}
                        color="accent-1"
                    >
                        The most valuable assets of a{' '}
                        <chakra.span color="brand.default">company</chakra.span>
                        <chakra.br display={{ base: 'none', xl: 'block' }} /> is
                        it&apos;s employee&apos;s.
                    </Text>

                    <Text>
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Consequatur, officia non, vitae quisquam aperiam
                        quia, tenetur inventore recusandae quo eveniet
                        reiciendis dolores nemo expedita veritatis officia
                        pariatur quas voluptas tempore.
                    </Text>

                    <Button
                        size="xl"
                        colorScheme="brand"
                        w={{ base: 'full', sm: 'auto' }}
                        onClick={() => router.push('/products')}
                    >
                        Get Started
                    </Button>
                </Flex>
            </Flex>

            <Flex
                display={{ base: 'none', lg: 'flex' }}
                flex={1}
                justify="start"
                align="center"
            >
                <Box
                    bgImage={
                        colorMode === 'light'
                            ? '/assets/canvas-light.png'
                            : '/assets/canvas-dark.png'
                    }
                    bgRepeat="no-repeat"
                    bgSize="contain"
                    bgPos="center"
                    h="full"
                    w="full"
                />
            </Flex>
        </Flex>
    )
}

export default Hero
