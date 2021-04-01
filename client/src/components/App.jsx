import React, { useState, useEffect } from 'react';
import Calendar from './Calendar.jsx';
import Users from './Users.jsx';
import Schedules from './Schedules.jsx'

function App() {

  const [selectedUser, selectUser] = useState({});
  const [showingSchedules, showSchedules] = useState(false)


  return (
    <div>
      <h3 className="title">Weekli</h3>
      {
        selectedUser.name ? <Calendar user={selectedUser} selectUser={selectUser} /> : <Users selectedUser={selectedUser} selectUser={selectUser} />
      }
      <button onClick={() => { showSchedules(true) }} className="button">Generate Schedules</button>
      {
        showingSchedules ? <Schedules showingSchedules={showingSchedules} /> : null
      }
    </div>
  )
}

export default App;