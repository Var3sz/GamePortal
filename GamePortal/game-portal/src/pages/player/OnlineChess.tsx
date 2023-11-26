import { useParams } from "react-router-dom";
import Referee from "../../components/Chess/Referee";

export const OnlineChess = () => {
  const isMultiplayer = true;
  const param = useParams();
  console.log(param);
  return (
    <Referee isMultiplayer={isMultiplayer} />
  );
}

export default OnlineChess;