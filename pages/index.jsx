import { chakra, Container } from '@chakra-ui/react'
import Hero from 'components/hero'

const Home = () => {
    return (
        <chakra.div
            bg="white"
            h="auto"
            minH="calc(100vh - 72px)"
            _dark={{ bg: 'system' }}
        >
            <Container>
                <Hero />
            </Container>
        </chakra.div>
    )
}

export default Home
