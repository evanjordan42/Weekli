import React, { useState, useEffect } from 'react';
import Calendar from './Calendar.jsx';
import Users from './Users.jsx';
import Schedules from './Schedules.jsx'
import Title from './Title.jsx'
import axios from 'axios';

function App() {

  const [isMainPage, setIsMainPage] = useState(false)
  const [selectedUser, selectUser] = useState({});
  const [showingSchedules, showSchedules] = useState(false)
  const [shifts, setShifts] = useState([]);
  const [bestSchedule, setBestSchedule] = useState([]);

  function goToSchedule() {
    // showSchedules(true);
    // set user to add shifts
    axios.get('/users')
      .then((res) => {
        for (var user of res.data) {
          if (user.name === 'Add Shifts') {
            selectUser(user)
            showSchedules(true)
          }
        }
      })
  }

  useEffect((() => {
    if (!isMainPage) {
      setIsMainPage(true);
    } else {
      setIsMainPage(false);
    }
  })
    , [selectedUser.name || showingSchedules])

  return (
    <div id="app-grid">
      <Title isMainPage={isMainPage} selectUser={selectUser} />
      {
        showingSchedules ? <div className="menu"><Calendar bestSchedule={bestSchedule} setBestSchedule={setBestSchedule} user={selectedUser} selectUser={selectUser} shifts={shifts} setShifts={setShifts} showingSchedules={showingSchedules} showSchedules={showSchedules} /></div> :
          <div className="menu">
            {
              selectedUser.name && !showingSchedules ? <Calendar showingSchedules={showingSchedules} user={selectedUser} selectUser={selectUser} /> : <div><Users selectedUser={selectedUser} selectUser={selectUser} />
                <button id="go-to-schedule-button" onClick={goToSchedule} className="button">Go to schedule</button></div>
            }
          </div>
      }
    </div>
  )
}

export default App;