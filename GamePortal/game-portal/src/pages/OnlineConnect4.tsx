import Connect4Referee from "../components/Connect4/Connect4Referee";

export const OnlineConnect4 = () => {
  const isMultiplayer = true;

  return (
    <>
      <Connect4Referee isMultiplayer={isMultiplayer} />
    </>
  )
}

export default OnlineConnect4;