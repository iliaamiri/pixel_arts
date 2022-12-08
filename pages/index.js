import { useEffect, useState } from 'react'

import Pixels from '../components/Pixels'


function createBlankArray(number = 16) {
  return Array(number).fill(0).map(a => (Array(number).fill(0)))
}

export default function Home() {

  const [pixelColors, setPixelColors] = useState(createBlankArray(16))


  return (
    <>
      <div className='h-screen'>

        <div className='flex flex-col items-center justify-around h-1/6'>
          <h2 className="text-center text-7xl">Create a new drawing</h2>

          <div className='flex'>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-5"
              onClick={async () => {
                // save the matrix 
                // reset the matrix
                setPixelColors(createBlankArray(16))
              }}
            >
              save
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-5"
              onClick={() => {
                setPixelColors(createBlankArray(16))
              }}
            >
              reset
            </button>
          </div>

        </div>

        <div className="flex flex-col max-h-screen items-center h-5/6">
          <Pixels pixelColors={pixelColors} onPixelClick={(rowIndex, colIndex) => {
            const newPixelColors = [...pixelColors]
            newPixelColors[rowIndex][colIndex] = newPixelColors[rowIndex][colIndex] === 1 ? 0 : 1
            setPixelColors(newPixelColors)
          }} />
        </div>
      </div>
    </>
  )
}

