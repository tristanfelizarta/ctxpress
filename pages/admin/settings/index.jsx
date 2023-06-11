import {
    Button,
    Container,
    Divider,
    Flex,
    Text,
    useColorMode
} from '@chakra-ui/react'
import Card from 'components/card'

const Settings = () => {
    const { colorMode, toggleColorMode } = useColorMode()

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
                            Settings
                        </Text>

                        <Button size="lg" colorScheme="brand">
                            Save Changes
                        </Button>
                    </Flex>

                    <Divider />

                    <Flex direction="column" gap={3}>
                        <Text fontWeight="semibold" color="accent-1">
                            Appearance
                        </Text>

                        <Button
                            w={256}
                            textTransform="capitalize"
                            onClick={toggleColorMode}
                        >
                            {colorMode} Mode
                        </Button>
                    </Flex>

                    <Divider />

                    <Text fontSize="xs">CitiXpress Inc. version 1.0.0</Text>
                </Flex>
            </Card>
        </Container>
    )
}

export default Settings
