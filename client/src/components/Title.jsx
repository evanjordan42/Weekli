import React from 'react';

function Title({ isMainPage, selectUser }) {
  if (isMainPage) {
    return (
      <div id="main-page-title">
        <div>Weekli</div>
        <div id="subtitle">a preference saving schedule maker for repeating weekly schedules</div>
      </div>
    )
  } else {
    <div id="not-main-page-title">
      <h2 onClick={() => { selectUser({}) }}>Weekli</h2>
    </div>
  }
}

export default Title