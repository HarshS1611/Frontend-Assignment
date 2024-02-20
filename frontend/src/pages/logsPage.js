import { useState } from "react";
import LogsComponent from "../components/logs";
import Navbar from "../components/navbar";
import PropTypes from "prop-types"

const Logs = ({ label, backgroundColor = "red", size = "md" }) => {
   let scale = 1
  if (size === "sm") scale = 0.75
  if (size === "lg") scale = 1.5
  const style = {
    backgroundColor,
    padding: `${scale * 0.5}rem ${scale * 1}rem`,
    border: "none",
  }

   const [selectedTime,setTime] = useState(null)

   const onTimeChange = (time)=>{
      setTime(time);
   }
   console.log(selectedTime)
   return (
      <div>
         <Navbar onTimeChange={onTimeChange} />
         <div>
            <LogsComponent selectedTime={selectedTime} />
         </div>
      </div>
   );
};

Logs.propTypes = {
   label: PropTypes.string,
   backgroundColor: PropTypes.string,
   size: PropTypes.oneOf(["sm", "md", "lg"]),
   handleClick: PropTypes.func,
 }

export default Logs;

