import { Container, Flex, Icon, Text } from '@chakra-ui/react'
import { FiAlertTriangle } from 'react-icons/fi'

const Suspended = () => {
    return (
        <Container>
            <Flex
                bg="yellow.alpha"
                justify="center"
                gap={3}
                border="1px solid"
                borderColor="yellow.default"
                borderRadius={12}
                p={6}
                color="yellow.default"
            >
                <Icon as={FiAlertTriangle} boxSize={6} />
                <Text fontWeight="medium">
                    Your account is suspended. Learn more.
                </Text>
            </Flex>
        </Container>
    )
}

export default Suspended
