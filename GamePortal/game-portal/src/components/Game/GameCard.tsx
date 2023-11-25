import React from 'react';
import { Card, CardHeader, CardBody, Image, Heading, Text, HStack, ButtonGroup, Link } from '@chakra-ui/react';
import GameButton from './GameButton';

interface GameCardProps {
    title: string;
    imageURL: string;
    description: string;
    offlineLink: string;
    onlineLink: string;
    isPlayable: boolean;
    isAuthorized: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ title, imageURL, description, offlineLink, onlineLink, isPlayable, isAuthorized }) => {
    return (
        <Card variant={"gameCard"}>
            <CardHeader>
                <Image src={imageURL} alt="Game wallpaper" />
            </CardHeader>
            <CardBody>
                <Heading variant={"gameTitle"}>{title}</Heading>
                <Text>
                    {description}
                </Text>
                {isPlayable ? (
                    <HStack>
                        {isAuthorized ? (
                            <ButtonGroup>
                                <GameButton disabled>Play offline</GameButton>
                                <GameButton disabled>Play online</GameButton>
                            </ButtonGroup>
                        ) : (
                            <ButtonGroup>
                                <Link href={offlineLink}>
                                    <GameButton>Play offline</GameButton>
                                </Link>
                                <Link href={onlineLink}>
                                    <GameButton>Play online</GameButton>
                                </Link>
                            </ButtonGroup>
                        )}
                    </HStack>
                ) : (
                    <HStack>
                        <ButtonGroup>
                            <GameButton disabled>Play offline</GameButton>
                            <GameButton disabled>Play online</GameButton>
                        </ButtonGroup>
                    </HStack>
                )}
            </CardBody>
        </Card>
    );
};

export default GameCard;