import Connect4Referee from "../../components/Connect4/Connect4Referee";

export const Connect4 = () => {
  const isMultiplayer = false;

  return (
    <>
      <Connect4Referee isMultiplayer={isMultiplayer} />
    </>
  )
}

export default Connect4;