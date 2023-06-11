import { Container, Flex, Icon, Text } from '@chakra-ui/react'
import { FiAlertTriangle } from 'react-icons/fi'

const Resigned = () => {
    return (
        <Container>
            <Flex
                justify="center"
                gap={3}
                border="1px solid"
                borderColor="border"
                borderRadius={12}
                p={6}
                color="accent-1"
            >
                <Icon as={FiAlertTriangle} boxSize={6} />
                <Text fontWeight="medium">
                    Your account is resigned. Learn more.
                </Text>
            </Flex>
        </Container>
    )
}

export default Resigned
