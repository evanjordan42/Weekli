import React, { useState, useEffect } from 'react';
import Calendar from './Calendar.jsx';
import Users from './Users.jsx';
import Schedules from './Schedules.jsx'

function App() {

  const [selectedUser, selectUser] = useState({});
  const [showingSchedules, showSchedules] = useState(false)


  return (
    <div>
      <h2 className="title">Weekli</h2>
      <h6>a preference saving schedule maker for repeating weekly schedules</h6>
      {
        selectedUser.name ? <Calendar user={selectedUser} selectUser={selectUser} /> : <Users selectedUser={selectedUser} selectUser={selectUser} />
      }
      <button onClick={() => { showSchedules(true) }} className="button">Go to schedule</button>
      {
        showingSchedules ? <Schedules showingSchedules={showingSchedules} /> : null
      }
    </div>
  )
}

export default App;