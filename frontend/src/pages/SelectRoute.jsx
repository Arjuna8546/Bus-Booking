
import { useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRoadDistance, routeSelect } from '../endpoints/API';
import RouteMap from '../components/RouteMap';

function SelectRoute() {
    const { busId } = useParams();
    const [routeData,setRouteData] = useState(null)
    const [selectedStartStop,setSelectedStartStop] = useState(null)
    const [selectedEndStop,setSelectedEndStop] = useState("")
    

    useLayoutEffect(()=>{
        
    const fetchBusFullDetail = async()=>{
        const res = await routeSelect(busId)
     if(res){
        console.log(res)
        setRouteData(res)
        }
    }
    fetchBusFullDetail();
    },[busId])

    const handlecalculate = async()=>{
        if (selectedStartStop && selectedEndStop){
            const distance = await getRoadDistance(selectedStartStop, selectedEndStop);
            console.log(`Road Distance: ${distance} km`);
            if(distance){
                
            }
        }
        else {
            console.log("Please select both starting and ending stops.");
        }
    }

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      {routeData ? (
        <RouteMap
        route={routeData.route.coordinates}
        startStop={selectedStartStop}
        endStop={selectedEndStop}
        />
      ) : (
        <p>Loading route details...</p>
      )}
      {routeData && (
  <div className="mt-6 flex flex-col md:flex-row items-center gap-4">
    {/* Starting Stop */}
    <div className="flex-1">
      <label className="block text-gray-400 mb-1">Starting Stop</label>
      <select
        className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        onChange={(e) => {
          const selectedStop = routeData.bus_stops.find(
            (stop) => stop.name === e.target.value
          );
          setSelectedStartStop(selectedStop || null); // Set entire object
        }}
      >
        <option value="">Select Starting Stop</option>
        {[...new Set(routeData.bus_stops.map((stop) => stop.name))].map(
          (name, index) => (
            <option key={index} value={name}>
              {name}
            </option>
          )
        )}
      </select>
    </div>

    {/* Ending Stop */}
    <div className="flex-1">
      <label className="block text-gray-400 mb-1">Ending Stop</label>
      <select
        className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        onChange={(e) => {
          const selectedStop = routeData.bus_stops.find(
            (stop) => stop.name === e.target.value
          );
          setSelectedEndStop(selectedStop || null); // Set entire object
        }}
      >
        <option value="">Select Ending Stop</option>
        {[...new Set(routeData.bus_stops.map((stop) => stop.name))].map(
          (name, index) => (
            <option key={index} value={name}>
              {name}
            </option>
          )
        )}
      </select>
    </div>

    {/* Submit Button */}
    <button
      onClick={() => handlecalculate()}
      className="px-6 py-5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition duration-300"
    >
      Submit
    </button>
  </div>
)}

    </div>
  )
}

export default SelectRoute
