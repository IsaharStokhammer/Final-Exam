import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getAttackTypesPerCasualties } from "../store/features/analysis";
import { AppDispatch } from "../store/store";

const DeadliestAttackTypesCMP = () => {
  const useAppDispatch = () => useDispatch<AppDispatch>();

  const dispatch = useAppDispatch();
  const [data, setData] : any[] = useState();
  const HandelClickGetAttackTypesPerCasualties = async () => {
    const resoult = await dispatch(getAttackTypesPerCasualties());
    setData(resoult.payload.data.data.response);
    console.log(resoult);
  };
  return (
    <div>
      <button onClick={HandelClickGetAttackTypesPerCasualties}>
        getAttackTypesPerCasualties
      </button>

      {data && (
        <div>
          <table>
            <thead>
              <tr>
                <th>attack_type</th>
                <th>casualties</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item: any) => (
                <tr key={item.attack_type}>
                  <td>{item.attack_type}</td>
                  <td>{item.casualties}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      (
        <div>
          <table>
            <thead>
              <tr>
                <th>attack_type</th>
                <th>casualties</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.map((item: any) => (
                  <tr key={item.attack_type}>
                    <td>{item.attack_type}</td>
                    <td>{item.casualties}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )
      ;
    </div>
  );
};

export default DeadliestAttackTypesCMP;
