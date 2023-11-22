import Referee from "../../components/Chess/Referee";

export const Chess = () => {
  const isMultiplayer = false;

  return (
    <>
      <Referee isMultiplayer={isMultiplayer} />
    </>
  )
}

export default Chess;