import { chakra } from '@chakra-ui/react'

const Card = (props) => {
    return (
        <chakra.div
            bg="white"
            overflow="hidden"
            border="1px solid"
            borderRadius={12}
            borderColor="border"
            p={6}
            h="auto"
            w="full"
            _dark={{ bg: 'hsl(230, 20%, 12%)' }}
            {...props}
        />
    )
}

export default Card
