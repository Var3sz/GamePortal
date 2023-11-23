import { Box, Flex, HStack, IconButton, Button, Collapse, Image, useDisclosure, Link } from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom';
import { initialAuth } from '../auth/AuthProvider';
import { LargeScreenNavbar } from './LargeScreenNavbar';
import { SmallScreenNavbar } from './SmallScreenNavbar';
import { customColors } from '../theme/theme';
import logo from '../images/logo.png';
import useAuth from '../auth/useAuth';
import NavbarButton from './NavbarButton';

/**
 *  Navbar UI example: https://chakra-templates.dev/navigation/navbar 
 */

export default function AppNavbar() {
    const { auth, setAuth } = useAuth();
    const isAdmin = auth?.roles.includes(1);
    const navigate = useNavigate();

    const logout = async () => {
        setAuth(initialAuth);
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("roles");
        sessionStorage.removeItem("refreshToken");
        navigate('/login');
    };

    const { isOpen, onToggle } = useDisclosure();

    return (
        <Box backgroundColor={customColors.primary}>
            <Flex
                py={{ base: 2 }}
                px={{ base: 4 }}
                align={'center'}>
                <Flex
                    flex={{ base: 1, md: 'auto' }}
                    ml={{ base: -2 }}
                    display={{ base: 'flex', md: 'none' }}>
                    <IconButton
                        onClick={onToggle}
                        icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
                        variant={'ghost'}
                        aria-label={'Toggle Navigation'}
                    />
                </Flex>
                <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
                    <Image src={logo} />

                    <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                        <LargeScreenNavbar isAdmin={isAdmin} />
                    </Flex>
                </Flex>

                <HStack gap={8}>
                    {auth?.token ? (
                        <NavbarButton onClick={logout}>
                            Sign Out
                        </NavbarButton>
                    ) : (
                        <HStack gap={'10'}>
                            <Link href="/login">
                                <NavbarButton>
                                    Sign In
                                </NavbarButton>
                            </Link>
                            <Link href="/register">
                                <NavbarButton>
                                    Sign Up
                                </NavbarButton>
                            </Link>
                        </HStack>
                    )}
                </HStack>
            </Flex>

            <Collapse in={isOpen}>
                <SmallScreenNavbar isAdmin={isAdmin} />
            </Collapse>
        </Box>
    )
}



