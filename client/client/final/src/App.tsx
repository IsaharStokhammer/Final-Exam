import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../src/store/store";
import { getAttackTypesPerCasualties, getHighestCasualtyRegions } from "./store/features/analysis";
import DeadliestAttackTypesCMP from "./components/DeadliestAttackTypesCMP";

const useAppDispatch = () => useDispatch<AppDispatch>();
function App() {
  const dispatch = useAppDispatch();
  const HandelClickGetAttackTypesPerCasualties = async () => {
    const resoult = await dispatch(getAttackTypesPerCasualties());
    console.log(resoult);
  };
  const HandelClickGetHighestCasualtyRegions = async () => {
    const resoult = await dispatch(getHighestCasualtyRegions());
    console.log(resoult);
  }

  return <>
  <DeadliestAttackTypesCMP/>
  <button onClick={HandelClickGetHighestCasualtyRegions}>getHighestCasualtyRegions</button>
  </>
}

export default App;
