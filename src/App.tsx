import React from 'react'
import './App.css'

//paths
//l diagonal x and y
//L diagonal to a position x and y
//h horizantal x
//H horizantal to a position x
//v horizantal y
//V horizantal to a position y
function App() {
  return (
    <div>
      <svg>
        <path d="M 150 77 l 300 300" stroke="black" />
        <circle cx="150" cy="77" r="40" />
      </svg>
      <svg>
        <path d="M 150 77 h 300" stroke="black" />
        <circle cx="150" cy="77" r="40" />
      </svg>
      <svg>
        <path d="M 150 77 v 300" stroke="black" />
        <circle cx="150" cy="77" r="40" />
      </svg>
    </div>
  )
}

export default App
