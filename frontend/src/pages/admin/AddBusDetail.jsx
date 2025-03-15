import React, { useState } from 'react'
import { busregister, getbusstop } from '../../endpoints/API';
import { useNavigate } from 'react-router-dom';

function AddBusDetail() {
    const [startingPoint, setStartingPoint] = useState("");
  const [destination, setDestination] = useState("");
  const [startingStops, setStartingStops] = useState([]);
  const [destinationStops, setDestinationStops] = useState([]);
  const [startSearch, setStartSearch] = useState("");
  const [destSearch, setDestSearch] = useState("");
  const [selectedStartStop, setSelectedStartStop] = useState("");
  const [selectedDestStop, setSelectedDestStop] = useState("");
  const nav = useNavigate()

  const [busDetails, setBusDetails] = useState({
    busName: "",
    startTime: "",
    reachTime: "",
    ownerName: "",
    ownerPhone: "",
    ownerUpi: ""
  });

  const handleBusDetailChange = (e) => {
    setBusDetails({ ...busDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async() => {
    const busInfo = {
      startStop: selectedStartStop,
      destinationStop: selectedDestStop,
      ...busDetails,
    };

    const res = await busregister(busInfo);
    if(res && res.status =="success"){
        nav("/admin")
    }
  };

  const handleApplyStart = async() => {
    console.log("Starting Point Applied:", startingPoint);
    const res = await getbusstop(startingPoint)
    if (res) {
        setStartingStops(res);
      } else {
        setStartingStops([]);
      }
    
  };

  const handleApplyDestination = async() => {
    console.log("Destination Applied:", destination);
    const res = await getbusstop(destination)
    if (res) {
        setDestinationStops(res);
      } else {
        setDestinationStops([]);
      }
    
  };

  return (
    <div className="bg-black text-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Select Your Route</h2>

      {/* Starting Point Input */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Enter starting point"
          value={startingPoint}
          onChange={(e) => setStartingPoint(e.target.value)}
          className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <button
          onClick={handleApplyStart}
          className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
        >
          Apply
        </button>
      </div>
      {/* Searchable Dropdown for Starting Bus Stop */}
      {startingStops.length > 0 && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search starting bus stop"
            value={startSearch}
            onChange={(e) => setStartSearch(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <select
            className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            onChange={(e) => setSelectedStartStop(e.target.value)}
          >
            <option value="">Select Starting Bus Stop</option>
            {startingStops
              .filter((stop) => stop.name.toLowerCase().includes(startSearch.toLowerCase()))
              .map((stop, index) => (
                <option key={index} value={stop.name}>{stop.name}</option>
              ))}
          </select>
        </div>
      )}
      {/* Destination Input */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Enter destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <button
          onClick={handleApplyDestination}
          className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
        >
          Apply
        </button>
      </div>
       {/* Searchable Dropdown for Destination Bus Stop */}
       {destinationStops.length > 0 && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search destination bus stop"
            value={destSearch}
            onChange={(e) => setDestSearch(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <select
            className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            onChange={(e) => setSelectedDestStop(e.target.value)}
          >
            <option value="">Select Destination Bus Stop</option>
            {destinationStops
              .filter((stop) => stop.name.toLowerCase().includes(destSearch.toLowerCase()))
              .map((stop, index) => (
                <option key={index} value={stop.name}>{stop.name}</option>
              ))}
          </select>
        </div>
      )}


      {/* Show Selected Route */}
      {selectedStartStop && selectedDestStop && (
        <div className="mt-4 p-4 bg-gray-800 rounded-md text-center">
          <p className="text-gray-300">Traveling from</p>
          <h3 className="text-lg font-bold">{selectedStartStop}</h3>
          <p className="text-gray-300">to</p>
          <h3 className="text-lg font-bold">{selectedDestStop}</h3>
        </div>
      )}
      {selectedStartStop && selectedDestStop && (
        <div className="mt-6 p-4 bg-gray-900 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Enter Bus Details</h2>

          <input type="text" name="busName" placeholder="Bus Name" value={busDetails.busName} 
            onChange={handleBusDetailChange} className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md mb-2"/>

          <input type="time" name="startTime" placeholder="Starting Time" value={busDetails.startTime}
            onChange={handleBusDetailChange} className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md mb-2"/>

          <input type="time" name="reachTime" placeholder="Reaching Time" value={busDetails.reachTime} 
            onChange={handleBusDetailChange} className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md mb-2"/>

          <input type="text" name="ownerName" placeholder="Bus Owner Name" value={busDetails.ownerName}
            onChange={handleBusDetailChange} className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md mb-2"/>

          <input type="tel" name="ownerPhone" placeholder="Owner Phone Number" value={busDetails.ownerPhone}
            onChange={handleBusDetailChange} className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md mb-2"/>

          <input type="text" name="ownerUpi" placeholder="Owner UPI ID" value={busDetails.ownerUpi} 
            onChange={handleBusDetailChange} className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md mb-4"/>

          <button onClick={handleSubmit} className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-md">
            Submit Bus Details
          </button>
        </div>
      )}
    </div>
  )
}

export default AddBusDetail
