import { Container, Grid, GridItem } from '@chakra-ui/react'
import Meetings from 'components/admin/memo/meetings'
import Announcements from 'components/admin/memo/announcements'
import Holidays from 'components/admin/memo/holidays'

const Memo = () => {
    return (
        <Container>
            <Grid templateColumns="1fr 1fr" gap={6}>
                <GridItem colSpan={2}>
                    <Meetings />
                </GridItem>

                <GridItem colSpan={{ base: 2, lg: 1 }}>
                    <Announcements />
                </GridItem>

                <GridItem colSpan={{ base: 2, lg: 1 }}>
                    <Holidays />
                </GridItem>
            </Grid>
        </Container>
    )
}

export default Memo
