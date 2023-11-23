import React, { FC, ReactNode, MouseEvent } from 'react';
import { Button } from '@chakra-ui/react';
import { customColors } from '../theme/theme';

interface NavbarButtonProps {
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    children: ReactNode;
}

const NavbarButton: FC<NavbarButtonProps> = ({ onClick, children }) => {
    return (
        <Button
            fontSize={"md"}
            color={customColors.black}
            bg={customColors.secondary}
            _hover={{
                background: 'gray'
            }}
            onClick={onClick}
        >
            {children}
        </Button>
    );
};

export default NavbarButton;