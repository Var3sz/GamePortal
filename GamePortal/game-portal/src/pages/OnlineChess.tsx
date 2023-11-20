import Referee from "../components/Chess/Referee";

export const OnlineChess = () => {
  const isMultiplayer = true;
  return (
    <Referee isMultiplayer={isMultiplayer} />
  );
}

export default OnlineChess;