import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getAllBus } from '../endpoints/API'
import { Clock, MapPin, Bus } from "lucide-react";

function HomePage() {
  const [allBus, setAllBus] = useState([])

  useEffect(() => {
    const fetchAllBus = async () => {
      const res = await getAllBus()
      if (res) {
        setAllBus(res)
      }
    }
    fetchAllBus()
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Header />
      <main className="flex-grow p-6 text-white">
        <h2 className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent animate-fade-in">
          Bus Schedule
        </h2>

        {/* Bus List */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allBus.length > 0 ? (
            allBus.map((bus, index) => (
              <div
                key={index}
                className="group bg-gray-900/50 backdrop-blur-sm p-5 rounded-2xl border border-gray-800/50 hover:border-blue-500/50 hover:bg-gray-900/70 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
              >
                {/* Bus Name */}
                <h3 className="text-xl font-semibold mb-3 flex items-center text-blue-300 group-hover:text-blue-200 transition-colors">
                  <Bus className="w-5 h-5 mr-2" /> {bus.bus_name}
                </h3>

                {/* Route */}
                <div className="flex items-center text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                  <span className="text-sm">
                    {bus.start_stop} <span className="text-gray-500">→</span> {bus.destination_stop}
                  </span>
                </div>

                {/* Timing */}
                <div className="flex items-center text-gray-400">
                  <Clock className="w-4 h-4 mr-2 text-blue-400" />
                  <span className="text-sm">
                    {bus.start_time} - {bus.reach_time}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-400 text-lg animate-pulse">
                No buses available right now
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default HomePage


