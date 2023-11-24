/**
 * Source: https://www.youtube.com/playlist?list=PLBmRxydnERkysOgOS917Ojc_-uisgb8Aj
 * I was using this YouTube tutorial as a reference to create a basic chess game
 */

import { Box } from "@chakra-ui/react";

interface TileProps {
  image?: string;
  number: number;
  highlight: boolean;
}

const Tile: React.FC<TileProps> = ({ number, image, highlight }) => {
  const classNames = {
    tile: true,
    'dark-tile': number % 2 === 0,
    'light-tile': number % 2 !== 0,
    'tile-highlight': highlight,
    'chess-piece-tile': image,
  };

  const className = Object.entries(classNames)
    .filter(([key, value]) => value)
    .map(([key]) => key)
    .join(' ');

  return (
    <Box className={className}>
      {image && <Box style={{ backgroundImage: `url(${image})` }} className="chess-piece"></Box>}
    </Box>
  );
};

export default Tile;