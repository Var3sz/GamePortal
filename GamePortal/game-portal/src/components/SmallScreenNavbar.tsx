import { Box, Text, Stack, Link, Collapse, Icon, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { NAV_LINKS, LinkProps } from '../helpers/navbar.helper';
import LargeScreenNavbar from './LargeScreenNavbar';
import { customColors } from '../theme/theme';

interface SmallScreenNavbarProps {
    isAdmin: boolean;
}

export const SmallScreenNavbar: React.FC<SmallScreenNavbarProps> = ({ isAdmin }) => {
    let filteredNavLinks;

    if (isAdmin) {
        filteredNavLinks = NAV_LINKS.filter(item => item.label === 'Admin' || item.label === 'Home');
    } else {
        filteredNavLinks = NAV_LINKS.filter(item => item.label !== 'Admin');
    }

    return (
        <Stack bg={customColors.primary} p={3}>
            {filteredNavLinks.map((navItem) => (
                <SmallScreenNavbarItem key={navItem.label} {...navItem} />
            ))}
        </Stack>
    );
}

const SmallScreenNavbarItem = ({ label, children, to }: LinkProps) => {
    const { isOpen, onToggle } = useDisclosure()

    return (
        <Stack onClick={children && onToggle}>
            <Link
                href={to!}
                _hover={{
                    textDecoration: 'none',
                    color: customColors.secondary
                }}
            >
                <Text
                    fontWeight={600}
                    color={customColors.black}
                    _hover={{
                        color: customColors.secondary
                    }}
                >
                    {label}
                </Text>
                {children && (
                    <Icon
                        as={ChevronDownIcon}
                        transition={'all .25s ease-in-out'}
                        transform={isOpen ? 'rotate(180deg)' : ''}
                        w={6}
                        h={6}
                    />
                )}
            </Link>

            <Collapse in={isOpen} >
                <Stack
                    mt={2}
                    pl={4}
                    borderLeft={1}
                    borderStyle={'solid'}
                    borderColor={customColors.black}
                    align={'start'}
                >
                    {children &&
                        children.map((child) => (
                            <Link key={child.label} py={2} href={child.to}
                                _hover={{
                                    color: customColors.secondary,
                                    textDecoration: 'none'
                                }}
                            >
                                {child.label}
                            </Link>
                        ))}
                </Stack>
            </Collapse>
        </Stack>
    )
}

export default LargeScreenNavbar;