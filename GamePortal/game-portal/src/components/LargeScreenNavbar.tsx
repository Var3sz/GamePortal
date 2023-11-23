import { Box, Flex, HStack, Text, Stack, Icon, Popover, PopoverTrigger, PopoverContent } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { Link } from 'react-router-dom';
import { NAV_LINKS, LinkProps } from '../helpers/navbar.helper';
import { customColors } from '../theme/theme';

export const LargeScreenNavbar = () => {
    return (
        <Stack direction={'row'} spacing={4}>
            {NAV_LINKS.map((navItem) => (
                <Box key={navItem.label}>
                    <Popover trigger={'hover'} placement={'bottom-start'}>
                        <PopoverTrigger>
                            <Link
                                to={navItem.to!}
                                color={customColors.secondary}
                            >
                                {navItem.label}
                            </Link>
                        </PopoverTrigger>

                        {navItem.children && (
                            <PopoverContent
                                border={0}
                                boxShadow={'xl'}
                                bg={customColors.secondary}
                                p={4}
                                rounded={'xl'}
                                minW={'sm'}>
                                <Stack>
                                    {navItem.children.map((child) => (
                                        <LargeScreenSubNav key={child.label} {...child} />
                                    ))}
                                </Stack>
                            </PopoverContent>
                        )}
                    </Popover>
                </Box>
            ))}
        </Stack>
    )
}

const LargeScreenSubNav = ({ label, to }: LinkProps) => {
    return (
        <Link to={to!}>
            <HStack>
                <Box>
                    <Text
                        transition={'all .3s ease'}
                        _groupHover={{ color: 'pink.400' }}
                        fontWeight={500}>
                        {label}
                    </Text>
                </Box>
                <Flex
                    transition={'all .3s ease'}
                    transform={'translateX(-10px)'}
                    opacity={0}
                    _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
                    justify={'flex-end'}
                    align={'center'}
                    flex={1}>
                    <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
                </Flex>
            </HStack>
        </Link>
    )
}

export default LargeScreenNavbar;