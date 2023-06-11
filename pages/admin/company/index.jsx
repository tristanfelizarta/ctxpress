import { Container, Grid, GridItem } from '@chakra-ui/react'
import Departments from 'components/admin/company/departments'
import Designations from 'components/admin/company/designations'

const Company = () => {
    return (
        <Container>
            <Grid templateColumns="1fr 1fr" gap={6}>
                <GridItem colSpan={{ base: 2, lg: 1 }}>
                    <Departments />
                </GridItem>

                <GridItem colSpan={{ base: 2, lg: 1 }}>
                    <Designations />
                </GridItem>
            </Grid>
        </Container>
    )
}

export default Company
