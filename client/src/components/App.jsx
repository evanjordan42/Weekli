import React, { useState, useEffect } from 'react';
import Calendar from './Calendar.jsx';
import Users from './Users.jsx';
import Schedules from './Schedules.jsx'
import Title from './Title.jsx'

function App() {

  const [isMainPage, setIsMainPage] = useState(true)
  const [selectedUser, selectUser] = useState({});
  const [showingSchedules, showSchedules] = useState(false)


  return (
    <div id="app-grid">
      <Title isMainPage={isMainPage} selectUser={selectUser} />
      <div id="menu">
        {
          selectedUser.name ? <Calendar user={selectedUser} selectUser={selectUser} /> : <div><Users selectedUser={selectedUser} selectUser={selectUser} />
            <button id="go-to-schedule-button" onClick={() => { showSchedules(true) }} className="button">Go to schedule</button></div>
        }

      </div>

      {
        showingSchedules ? <Schedules showingSchedules={showingSchedules} /> : null
      }
    </div>
  )
}

export default App;