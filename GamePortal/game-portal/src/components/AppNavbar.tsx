import { Box, Flex, HStack, IconButton, Button, Collapse, Image, useDisclosure } from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { Link } from 'react-router-dom';
import { LargeScreenNavbar } from './LargeScreenNavbar';
import { SmallScreenNavbar } from './SmallScreenNavbar';
import { customColors } from '../theme/theme';
import logo from '../images/logo.png';

export default function AppNavbar() {
    const { isOpen, onToggle } = useDisclosure()

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
                        <LargeScreenNavbar />
                    </Flex>
                </Flex>

                <HStack
                    flex={{ base: 1, md: 0 }}
                    justify={'flex-end'}
                    gap={8}>
                    <Link to="/login">
                        <Button fontSize={'sm'} fontWeight={600} color={customColors.black} >
                            Sign In
                        </Button>
                    </Link>
                    <Link to="/register">
                        <Button
                            fontSize={'sm'}
                            fontWeight={600}
                            color={customColors.black}
                            bg={customColors.secondary}>
                            Sign Up
                        </Button>
                    </Link>
                </HStack>
            </Flex>

            <Collapse in={isOpen} animateOpacity>
                <SmallScreenNavbar />
            </Collapse>
        </Box>
    )
}



