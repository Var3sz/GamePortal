import { Box, HStack, Text, Stack, Popover, Link, PopoverTrigger, PopoverContent } from '@chakra-ui/react'
import { NAV_LINKS, LinkProps } from '../../helpers/navbar.helper';
import { customColors } from '../../theme/theme';

interface LargeScreenNavbarProps {
    isAdmin: boolean;
}

export const LargeScreenNavbar: React.FC<LargeScreenNavbarProps> = ({ isAdmin }) => {
    let filteredNavLinks;

    if (isAdmin) {
        filteredNavLinks = NAV_LINKS.filter(item => item.label === 'Admin' || item.label === 'Home');
    } else {
        filteredNavLinks = NAV_LINKS.filter(item => item.label !== 'Admin');
    }

    return (
        <HStack gap={24}>
            {filteredNavLinks.map((navItem) => (
                <Box key={navItem.label}>
                    <Popover trigger={'hover'} placement={'bottom-start'}>
                        <PopoverTrigger>
                            <Link
                                href={navItem.to!}
                                color={customColors.secondary}
                                fontSize={'x-large'}
                                _hover={{
                                    textDecoration: 'none',
                                    color: 'black',
                                }}
                            >
                                {navItem.label}
                            </Link>
                        </PopoverTrigger>

                        {navItem.children && (
                            <PopoverContent
                                boxShadow={'xl'}
                                p={4}
                                rounded={'md'}>
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
        </HStack>
    )
}

const LargeScreenSubNav = ({ label, to }: LinkProps) => {
    return (
        <Link href={to!}
            _hover={{
                text: 'none',
                color: 'gray'
            }}
        >
            <HStack>
                <Box>
                    <Text
                        fontWeight={500}>
                        {label}
                    </Text>
                </Box>
            </HStack>
        </Link>
    )
}

export default LargeScreenNavbar;