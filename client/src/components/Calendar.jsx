import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Schedules from './Schedules.jsx'

function Calendar({ user, selectUser, displayMode, showingSchedules, showSchedules, shifts, setShifts, bestSchedule, setBestSchedule }) {
  /*
  prefs object example :
  {
    sun0000: -2,
    sun0015: -2,
    sun0030: -1,
    mon2345: 1,
  }

  */

  const [prefs, setPrefs] = useState(user.prefs)
  const [paintMode, setPaintMode] = useState(false);
  const [painting, setPainting] = useState(false);
  const [maxShifts, setMaxShifts] = useState(user.maxShifts);
  const [selectedPref, selectPref] = useState(0);

  function handleClick(time) {
    if (!showingSchedules) {
      if (paintMode) {
        if (painting) {
          setPainting(false);
        } else {
          setPainting(true)
        }
      }
      changePreference(time)
    }
  }

  function handleChange(e, func) {
    e.preventDefault();
    func(e.target.value)
  }

  function handleMouseOver(time) {
    if (painting) {
      changePreference(time);
    }
  }

  function changePreference(time) {
    //change color of cell
    var cell = document.getElementById(time)
    cell.style.backgroundColor = getStyle(null, selectedPref)

    //update pref object
    var newPrefs = prefs;
    newPrefs[time] = selectedPref;
    setPrefs(newPrefs);
  }

  // runs when save button is clicked
  function savePrefs() {
    axios.post('/prefs', { name: user.name, maxShifts, prefs })
      .then(() => { selectUser({}) })
  }

  function times() {
    var output = [];
    for (var i = 0; i < 24; i++) {
      for (var j = 0; j < 4; j++) {
        output.push(pad(`${i}${(j * 15) || '00'}`, 4))
      }
    }
    return output
    function pad(n, width, z) {
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
  }

  function getStyle(time, justColor) {
    if (user.name === 'Add Shifts') {
      // not doing if(justColor) becuase justColor can be zero
      if (justColor !== undefined) {
        switch (justColor) {
          case 0: return 'cornsilk';
          case 1: return 'rgba(169, 169, 169, 0.637)'
        }
      } else {
        switch (prefs[time]) {
          case undefined: return { 'backgroundColor': 'cornsilk' };
          case 0: return { 'backgroundColor': 'cornsilk' };
          case 1: return { 'backgroundColor': 'rgba(169, 169, 169, 0.637)' };
        }
      }
    } else {
      if (justColor !== undefined) {
        switch (justColor) {
          case -2: return 'red';
          case -1: return 'lightcoral';
          case 0: return 'cornsilk';
          case 1: return 'lightgreen';
          case 2: return 'green';
        }
      } else {
        switch (prefs[time]) {
          case -2: return { 'backgroundColor': 'red' };
          case -1: return { 'backgroundColor': 'lightcoral' };
          case undefined: return { 'backgroundColor': 'cornsilk' };
          case 0: return { 'backgroundColor': 'cornsilk' }
          case 1: return { 'backgroundColor': 'lightgreen' };
          case 2: return { 'backgroundColor': 'green' };
        }
      }
    }
  }

  function paintButtonText() {
    if (paintMode) {
      return 'Disable painting'
    } else {
      return 'Enable painting'
    }
  }

  function prefButtonText() {
    if (user.name === 'Add Shifts') {
      switch (selectedPref) {
        case 0: return 'No shift';
        case 1: return 'Shift'
      }
    } else {
      switch (selectedPref) {
        case -2: return 'Cannot work';
        case -1: return 'Prefer not to work';
        case 0: return 'No preference';
        case 1: return 'Prefer to work';
        case 2: return 'Must work';
      }
    }
  }

  function handlePrefButton() {
    if (user.name === 'Add Shifts') {
      setPainting(false);
      switch (selectedPref) {
        case 0: selectPref(1); break;
        case 1: selectPref(0); break;
      }
    } else {
      setPainting(false);
      switch (selectedPref) {
        case -2: selectPref(-1); break;
        case -1: selectPref(0); break;
        case 0: selectPref(1); break;
        case 1: selectPref(2); break;
        case 2: selectPref(-2); break;
      }
    }
  }

  function PageDescription() {
    if (showingSchedules) {
      return (<div className="user-name">Press <span className="bold">Generate Schedule</span> to display a schedule that best matches user preferences</div>)
    } else if (user.name === 'Add Shifts') {
      return (<div className="user-name bold">Setting Shifts</div>)
    } else {
      return (<div className="user-name">{'Setting preferences for'} <span className="bold">{user.name}</span></div>)
    }
  }

  return (
    <div className="calendar">
      {
        showingSchedules ? <button onClick={() => { selectUser({}); showSchedules(false) }} className="button">Back</button> :
          <div>
            <button onClick={() => { selectUser({}) }} className="button">Exit without saving</button>
            <button onClick={savePrefs} className="button">Save and exit</button>
            <button onClick={() => { if (paintMode) { setPaintMode(false) } else { setPaintMode(true) } }} className="button">{paintButtonText()}</button>
            <button className="button" style={{ 'backgroundColor': getStyle(null, selectedPref) }} onClick={handlePrefButton}><div className="preference-text">{prefButtonText()}</div></button>
          </div>
      }
      <PageDescription />
      {
        showingSchedules || user.name === 'Add Shifts' ? null : <form>
          Enter the maximum number of shifts you would work in a week:&nbsp;
        <input className="shift-form" onChange={(e) => { handleChange(e, setMaxShifts) }} value={maxShifts} type="number"></input>
        </form>
      }

      <div className="calendar-container">
        <div className="time-labels">
          {
            ['12 AM—', '1 AM —', '2 AM —', '3 AM —', '4 AM —', '5 AM —', '6 AM —', '7 AM —', '8 AM —', '9 AM —', '10 AM—', '11 AM—', '12 PM—', '1 PM —', '2 PM —', '3 PM —', '4 PM —', '5 PM —', '6 PM —', '7 PM —', '8 PM —', '9 PM —', '10 PM—', '11 PM—'].map((label) => (<div key={label} className="time-label">{label}</div>))
          }
        </div>
        <div className="sunday">Sunday
          {
            times().map((time) => {
              var cellTime = `sun${time}`
              if (time[2] !== '0') {
                return (<div onMouseOver={() => { handleMouseOver(cellTime) }} style={getStyle(cellTime)} onClick={() => { handleClick(cellTime) }} key={cellTime} id={cellTime} className="left-edge-cell-dashed"></div>)
              } else {
                return (<div onMouseOver={() => { handleMouseOver(cellTime) }} style={getStyle(cellTime)} onClick={() => { handleClick(cellTime) }} key={cellTime} id={cellTime} className="left-edge-cell"></div>)
              }
            })
          }
        </div>
        <div className="monday"> Monday
          {
            times().map((time) => {
              var cellTime = `mon${time}`
              if (time[2] !== '0') {
                return (<div onMouseOver={() => { handleMouseOver(cellTime) }} style={getStyle(cellTime)} onClick={() => { handleClick(cellTime) }} key={cellTime} id={cellTime} className="middle-cell-dashed"></div>)
              } else {
                return (<div onMouseOver={() => { handleMouseOver(cellTime) }} style={getStyle(cellTime)} onClick={() => { handleClick(cellTime) }} key={cellTime} id={cellTime} className="middle-cell"></div>)
              }
            })
          }
        </div>
        <div className="tuesday"> Tuesday
          {
            times().map((time) => {
              var cellTime = `tue${time}`
              if (time[2] !== '0') {
                return (<div onMouseOver={() => { handleMouseOver(cellTime) }} style={getStyle(cellTime)} onClick={() => { handleClick(cellTime) }} key={cellTime} id={cellTime} className="middle-cell-dashed"></div>)
              } else {
                return (<div onMouseOver={() => { handleMouseOver(cellTime) }} style={getStyle(cellTime)} onClick={() => { handleClick(cellTime) }} key={cellTime} id={cellTime} className="middle-cell"></div>)
              }
            })
          }
        </div>
        <div className="wednesday"> Wedensday
          {
            times().map((time) => {
              var cellTime = `wed${time}`
              if (time[2] !== '0') {
                return (<div onMouseOver={() => { handleMouseOver(cellTime) }} style={getStyle(cellTime)} onClick={() => { handleClick(cellTime) }} key={cellTime} id={cellTime} className="middle-cell-dashed"></div>)
              } else {
                return (<div onMouseOver={() => { handleMouseOver(cellTime) }} style={getStyle(cellTime)} onClick={() => { handleClick(cellTime) }} key={cellTime} id={cellTime} className="middle-cell"></div>)
              }
            })
          }
        </div>
        <div className="thursday"> Thursday
          {
            times().map((time) => {
              var cellTime = `thu${time}`
              if (time[2] !== '0') {
                return (<div onMouseOver={() => { handleMouseOver(cellTime) }} style={getStyle(cellTime)} onClick={() => { handleClick(cellTime) }} key={cellTime} id={cellTime} className="middle-cell-dashed"></div>)
              } else {
                return (<div onMouseOver={() => { handleMouseOver(cellTime) }} style={getStyle(cellTime)} onClick={() => { handleClick(cellTime) }} key={cellTime} id={cellTime} className="middle-cell"></div>)
              }
            })
          }
        </div>
        <div className="friday"> Friday
          {
            times().map((time) => {
              var cellTime = `fri${time}`
              if (time[2] !== '0') {
                return (<div onMouseOver={() => { handleMouseOver(cellTime) }} style={getStyle(cellTime)} onClick={() => { handleClick(cellTime) }} key={cellTime} id={cellTime} className="middle-cell-dashed"></div>)
              } else {
                return (<div onMouseOver={() => { handleMouseOver(cellTime) }} style={getStyle(cellTime)} onClick={() => { handleClick(cellTime) }} key={cellTime} id={cellTime} className="middle-cell"></div>)
              }
            })
          }
        </div>
        <div className="saturday"> Saturday
          {
            times().map((time) => {
              var cellTime = `sat${time}`
              if (time[2] !== '0') {
                return (<div onMouseOver={() => { handleMouseOver(cellTime) }} style={getStyle(cellTime)} onClick={() => { handleClick(cellTime) }} key={cellTime} id={cellTime} className="right-edge-cell-dashed"></div>)
              } else {
                return (<div onMouseOver={() => { handleMouseOver(cellTime) }} style={getStyle(cellTime)} onClick={() => { handleClick(cellTime) }} key={cellTime} id={cellTime} className="right-edge-cell"></div>)
              }
            })
          }
        </div>
      </div>
      {
        showingSchedules ? <Schedules user={user} bestSchedule={bestSchedule} setBestSchedule={setBestSchedule} shifts={shifts} setShifts={setShifts} showingSchedules={showingSchedules} /> : null
      }

    </div>
  )
}

export default Calendar;