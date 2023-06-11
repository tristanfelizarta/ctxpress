import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Container, Flex, Grid, GridItem, Spinner } from '@chakra-ui/react'
import Avatar from 'components/employees/avatar'
import Resume from 'components/employees/resume'
import Role from 'components/employees/role'
import Status from 'components/employees/status'
import Information from 'components/employees/information'

const Employee = () => {
    const { data: session } = useSession()
    const { data: user, isFetched: isUserFetched } = useQuery(
        ['user', session.user.id],
        () => api.get('/users', session.user.id)
    )
    const { data: departments, isFetched: isDepartmentsFetched } = useQuery(
        ['departments'],
        () => api.all('/departments')
    )
    const { data: designations, isFetched: isDesignationsFetched } = useQuery(
        ['designations'],
        () => api.all('/designations')
    )

    if (!isUserFetched || !isDepartmentsFetched || !isDesignationsFetched) {
        return (
            <Flex p={6}>
                <Spinner color="brand.default" />
            </Flex>
        )
    }

    return (
        <Container>
            <Grid templateColumns="300px 1fr" alignItems="start" gap={6}>
                <GridItem display="grid" colSpan={{ base: 2, lg: 1 }} gap={6}>
                    <Avatar user={user} />
                    <Resume user={user} />
                    <Role user={user} />
                    <Status user={user} />
                </GridItem>

                <GridItem display="grid" colSpan={{ base: 2, lg: 1 }} gap={6}>
                    <Information
                        user={user}
                        departments={departments}
                        designations={designations}
                    />
                </GridItem>
            </Grid>
        </Container>
    )
}

export default Employee
