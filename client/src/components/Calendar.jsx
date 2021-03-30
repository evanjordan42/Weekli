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
  const [paint, setPaint] = useState(false);
  const [preference, setPreference] = useState(0);

  function handleClick(e) {

  }

  // runs when save button is clicked
  function savePrefs() {

  }


  return (
    <div className="calendar-container">
      <div className="sunday">

      </div>
      <div className="monday">

      </div>
      <div className="tuesday">

      </div>
      <div className="wednesday">

      </div>
      <div className="thursday">

      </div>
      <div className="friday">

      </div>
      <div className="saturday">

      </div>
    </div>
  )
}

export default Calendar;