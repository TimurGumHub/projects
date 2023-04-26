import React from 'react';
import Calendar from './components/Calendar';
import imma from './images/2. Delete Mobile@2x.png';
function HomePage() {
  return (
    <div>
      <Calendar />
      <img src={imma} alt='Моя картинка' />
      
    </div>
  );
}

export default HomePage;
