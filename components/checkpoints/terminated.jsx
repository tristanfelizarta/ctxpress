import { Container, Flex, Icon, Text } from '@chakra-ui/react'
import { FiAlertTriangle } from 'react-icons/fi'

const Terminated = () => {
    return (
        <Container>
            <Flex
                bg="red.alpha"
                justify="center"
                gap={3}
                border="1px solid"
                borderColor="red.default"
                borderRadius={12}
                p={6}
                color="red.default"
            >
                <Icon as={FiAlertTriangle} boxSize={6} />
                <Text fontWeight="medium">
                    Your account is terminated. Learn more.
                </Text>
            </Flex>
        </Container>
    )
}

export default Terminated
