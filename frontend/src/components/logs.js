import React, { useEffect, useState, useRef } from 'react';
import { MimicLogs } from '../api/api-mimic';
import PropTypes from "prop-types"
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";


const LogsComponent = ({selectedTime}) => {

  // console.log(props.selectedTime)

  const [logs, setLogs] = useState([]);
  const [liveLogsCount, setLiveLogsCount] = useState(0);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const logsContainerRef = useRef(null);

  // if(props.selectedTime === '5' || props.selectedTime === '15' || props.selectedTime === '30'){
  //   setStartTime(parseInt(props.selectedTime)*60)
  // }else{
  //   setStartTime(parseInt(props.selectedTime*60*60))
  // }

  const fetchPreviousLogs = async () => {
    setLoadingLogs(true);
    setIsLive(false)
    const selectedTimeInMinutes = parseInt(selectedTime) || 5;
    let startTs = 5;
    const isHour = selectedTimeInMinutes === 1 || selectedTimeInMinutes === 2 || selectedTimeInMinutes === 3 || selectedTimeInMinutes === 6;

    if (isHour) {
      // console.log('hours');
      startTs = (Date.now() - (selectedTimeInMinutes * 60 * 60 * 1000));
      setStartTime(startTs)

    } else {
      // Handle the selected time as minutes
      startTs = (Date.now() - (selectedTimeInMinutes * 60 * 1000));
      setStartTime(startTs)

    }
    const endTs = Date.now();
    setEndTime(endTs)
    console.log(startTs, endTs)
    const limit = 100;
    const fetchedLogs = await MimicLogs.fetchPreviousLogs({ startTs, endTs, limit });
    if (pageNumber === 1) {
      setLogs(fetchedLogs);
    } else {
      setLogs(prevLogs => [...prevLogs, ...fetchedLogs]);
    }
    setLoadingLogs(false);
    console.log(logs)
  };
  const subscribeToLiveLogs = () => {
    // setIsLive(true)
    if (isLive) {
      const liveLogsSubscription = MimicLogs.subscribeToLiveLogs(data => {
        setLogs(prevLogs => [...prevLogs, data]);
        setLiveLogsCount(prevCount => prevCount + 1);
        if (autoScrollEnabled) {
          scrollToLatestLog();
        }
        console.log(logs)
      });
    }
  };

  // console.log(liveLogsCount)

  const scrollToLatestLog = () => {
    if (document.documentElement) {
      const isUserAtLatestLog = document.documentElement.scrollTop + window.innerHeight >= document.documentElement.scrollHeight;
      if (isUserAtLatestLog && logsContainerRef.current) {
        setAutoScrollEnabled(true);
        setLiveLogsCount(0)
        logsContainerRef.current.lastElementChild?.scrollIntoView();

      } else {
        setAutoScrollEnabled(false);
      }
    }
  };

  const autoScroll = () => {
    if (logsContainerRef.current) {
      const isUserAtLatestLog = logsContainerRef.current.scrollTop + logsContainerRef.current.clientHeight >= logsContainerRef.current.scrollHeight;
      if (isUserAtLatestLog) {
        setAutoScrollEnabled(true)
        logsContainerRef.current.lastElementChild.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  // Show count of live logs and scroll to latest logs on click
  const handleLiveLogsCountClick = () => {
    // scrollToLatestLog();
    autoScroll()
    setLiveLogsCount(0);
  };

  const scrollToTop = () => {
    if (logsContainerRef.current) {
      logsContainerRef.current.firstElementChild.scrollIntoView()
    }
  }

  useEffect(() => {
    if (isLive) {
      setIsLive(true)
      subscribeToLiveLogs();
    }
  }, [isLive]);

  useEffect(() => {
    setIsLive(false)
    fetchPreviousLogs();
  }, [selectedTime,!isLive]);



  return (
    <div className=''>
      <div className='relative  mx-5 py-5' >
        <h2 className='flex justify-end w-full py-5' >Showing logs for {new Date(startTime).toLocaleString()} - {new Date(endTime).toLocaleString()}</h2>
        <div className='relative overflow-auto '>
          <div className='sticky '>
            <button className=' w-full bg-[#0E1623] text-[#82A0CE] py-2 text-sm shadow-lg rounded-t-xl'
              onClick={fetchPreviousLogs} >Loading previous 100 logs </button>
          </div>
          <ul className=' bg-[#090F17] text-[#A8C3E8] rounded-b-xl shadow-md' ref={logsContainerRef}>
            {logs ? logs.map((log, index) => (
              <li className='flex w-full p-5 justify-start' id={index} key={index}>
                <p className='text-[#5E7BAA] flex items-center w-60 border-l-2 pl-2 border-sky-500'>{new Date(log.timestamp).toLocaleString()}</p>
                <p className='flex items-center justify-start w-full'>{log.message}</p>
              </li>
            )) : <div className='bg-[#090F17] text-[#A8C3E8]'>Loading..</div>}
          </ul>
        </div>
        <button className='flex gap-1 p-2 rounded-full m-10 fixed bottom-0 left-0 z-10 bg-sky-500 live-logs-count' onClick={scrollToTop}>
        <FaArrowUp />
  Scroll to Top
        </button>
        {isLive && <button className='flex gap-1 p-2 rounded-full m-10 fixed bottom-0 right-0 z-10 bg-sky-500 live-logs-count' onClick={handleLiveLogsCountClick}>
         <FaArrowDown/> {liveLogsCount} New Logs
        </button>}
        {!isLive && <button onClick={setIsLive(true)} className='flex gap-1 p-2 rounded-full m-5 fixed bottom-0 right-0 z-10 bg-sky-500 live-logs-count'>Subcribe to live</button>
        }      </div>
    </div>
  );
};

LogsComponent.propTypes = {
  selectedTime: PropTypes.string,
}


export default LogsComponent;
