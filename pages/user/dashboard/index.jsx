import { Container, Grid, GridItem } from '@chakra-ui/react'
import Statistics from 'components/user/dashboard/statistics'
import Meetings from 'components/user/dashboard/meetings'
import Announcements from 'components/admin/dashboard/announcements'
import Holidays from 'components/admin/dashboard/holidays'

const Dashboard = () => {
    return (
        <Container>
            <Grid templateColumns="repeat(12, 1fr)" gap={6}>
                <Statistics />

                <GridItem colSpan={12}>
                    <Meetings />
                </GridItem>

                <GridItem colSpan={{ base: 12, lg: 6 }}>
                    <Announcements />
                </GridItem>

                <GridItem colSpan={{ base: 12, lg: 6 }}>
                    <Holidays />
                </GridItem>
            </Grid>
        </Container>
    )
}

export default Dashboard
