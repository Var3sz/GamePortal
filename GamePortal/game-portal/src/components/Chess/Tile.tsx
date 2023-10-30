interface TileProps {
    image?: string;
    number: number;
    highlight: boolean;
  }
  
export const Tile = ({ number, image, highlight }: TileProps) => {
    const className: string = ["tile",
      number % 2 === 0 && "dark-tile",
      number % 2 !== 0 && "light-tile",
      highlight && "tile-highlight",
      image && "chess-piece-tile"].filter(Boolean).join(' ');
  
  
      return (
        <div className={className}>
          {image && <div style={{ backgroundImage: `url(${image})` }} className="chess-piece"></div>}
        </div>
      );
  }
 

export default Tile;