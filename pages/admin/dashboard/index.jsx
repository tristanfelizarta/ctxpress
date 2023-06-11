import { Container, Grid, GridItem } from '@chakra-ui/react'
import Statistics from 'components/admin/dashboard/statistics'
import Meetings from 'components/admin/dashboard/meetings'
import Announcement from 'components/admin/dashboard/announcements'
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
                    <Announcement />
                </GridItem>

                <GridItem colSpan={{ base: 12, lg: 6 }}>
                    <Holidays />
                </GridItem>
            </Grid>
        </Container>
    )
}

export default Dashboard
