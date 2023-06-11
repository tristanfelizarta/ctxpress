import { Flex, IconButton, Td, Text, Tr } from '@chakra-ui/react'
import { FiMoreHorizontal } from 'react-icons/fi'
import Card from 'components/card'
import Table from 'components/table'

const Holidays = () => {
    return (
        <Card>
            <Flex direction="column" gap={6}>
                <Flex justify="space-between" align="center" gap={6}>
                    <Text fontSize="xl" fontWeight="semibold" color="accent-1">
                        Holidays
                    </Text>

                    <IconButton
                        size="xs"
                        icon={<FiMoreHorizontal size={12} />}
                    />
                </Flex>

                <Table
                    data={[]}
                    fetched={true}
                    th={[]}
                    td={(data) => (
                        <Tr key={data.id}>
                            <Td></Td>
                        </Tr>
                    )}
                    settings={{
                        search: 'off',
                        show: [5]
                    }}
                />
            </Flex>
        </Card>
    )
}

export default Holidays
