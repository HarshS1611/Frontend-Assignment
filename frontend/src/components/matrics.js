import React, { useEffect, useState } from 'react';
import { MimicMetrics } from '../api/api-mimic';
import PropTypes from "prop-types"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);


const MetricsComponent = ({selectedTime}) => {

  const [metrics, setMetrics] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const fetchMetrics = async () => {
    const selectedTimeInMinutes = parseInt(selectedTime) || 5;
    let startTs = 5;
    const isHour = selectedTimeInMinutes === 1 || selectedTimeInMinutes === 2 || selectedTimeInMinutes === 3 || selectedTimeInMinutes === 6;

    if (isHour) {
      console.log('hours');
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
    const fetchedMetrics = await MimicMetrics.fetchMetrics({ startTs, endTs });
    setMetrics(fetchedMetrics);
    console.log(fetchedMetrics)
  };

  useEffect(() => {
    fetchMetrics();
  }, [selectedTime]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
  };

  const labels = metrics.map((d, i) =>
    d.graphLines.map((cdata, i) =>
      cdata.values.map((d, i) => new Date(d.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
    )
  );

  const ChartData = metrics.map((d, i) => (
    d.graphLines.map((cdata, i) =>
      cdata
    )
  ))
  const getLightRGBColor = () => {
    const r = Math.floor(Math.random() * 128) + 128; 
    const g = Math.floor(Math.random() * 128) + 128; 
    const b = Math.floor(Math.random() * 128) + 128; 
    return `rgb(${r}, ${g}, ${b})`;
  };
  console.log(ChartData)


  return (
    <div className='mx-5'>
        <h2 className='flex items-center gap-5 justify-start w-full py-5' ><p className='text-2xl font-bold'>Metrics</p> {new Date(startTime).toLocaleString()} - {new Date(endTime).toLocaleString()}</h2>

      <div className='grid grid-cols-2 gap-4 my-5'>
      {metrics && metrics.map((data, id) => (
        <div className='shadow-lg rounded-xl border-[2px] border-sky-200' key={id}>
          <div className='p-5 flex justify-start w-full'>{data.name}</div>
          <div className='p-2'><Line options={options} data={{
            labels: labels[id][0],
            datasets: metrics[id].graphLines.map((d, i) => ({
              // fill: id === 3 ? true : false,
              
              data: d.values.map((cdata) => cdata.value),
              label: d.name,
              borderColor: getLightRGBColor(),
              backgroundColor: getLightRGBColor(),
            })),
          }} /></div>
        </div>
      ))}
      </div>
    </div>
  );
};

MetricsComponent.propTypes = {
  selectedTime: PropTypes.string,
}


export default MetricsComponent;
