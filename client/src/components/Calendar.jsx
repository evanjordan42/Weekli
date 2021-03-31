import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Calendar(props) {
  /*
  prefs object example :
  {
    sun0000: -2,
    sun0015: -2,
    sun0030: -1,
    mon2345: 1,
  }
  */
  const [prefs, setPrefs] = useState({})
  const [paintMode, setPaintMode] = useState(false);
  const [painting, setPainting] = useState(false);
  const [selectedPref, selectPref] = useState(0);

  function handleClick(time) {
    if (paintMode) {
      if (painting) {
        setPainting(false);
      } else {
        setPainting(true)
      }
    }
    changePreference(time)
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

  function paintButtonText() {
    if (paintMode) {
      return 'Disable painting'
    } else {
      return 'Enable painting'
    }
  }

  function prefButtonText() {
    switch (selectedPref) {
      case -2: return 'Cannot work';
      case -1: return 'Prefer not to work';
      case 0: return 'No preference';
      case 1: return 'Prefer to work';
      case 2: return 'Must work';
    }
  }

  function handlePrefButton() {
    switch (selectedPref) {
      case -2: selectPref(-1); break;
      case -1: selectPref(0); break;
      case 0: selectPref(1); break;
      case 1: selectPref(2); break;
      case 2: selectPref(-2); break;
    }
  }

  return (
    <div className="calendar">
      <button onClick={() => { if (paintMode) { setPaintMode(false) } else { setPaintMode(true) } }} className="button">{paintButtonText()}</button>
      <button className="button" onClick={handlePrefButton}>{prefButtonText()}<div style={{ 'backgroundColor': getStyle(null, selectedPref) }} className="color-preview"></div></button>
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
    </div>
  )
}

export default Calendar;