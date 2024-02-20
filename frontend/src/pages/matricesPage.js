
import { useState } from "react";
import MetricsComponent from "../components/matrics";
import Navbar from "../components/navbar";

const Metrics = () => {
  const [selectedTime,setTime] = useState(null)

   const onTimeChange = (time)=>{
      setTime(time);
   }
   console.log(selectedTime)
    return (
     <div>
      <Navbar onTimeChange={onTimeChange}/>
      <div className="">
      <MetricsComponent selectedTime={selectedTime}/>

      </div>
     </div>
    );
  };
  
  export default Metrics;
  