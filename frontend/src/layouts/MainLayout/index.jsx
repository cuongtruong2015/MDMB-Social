import Header from 'components/Header';
import React from 'react';
function MainLayout({ Name, Avatar,children }) {
  return (
    <>
      <Header Name={Name} Avatar={Avatar}/>
      {children}
    </>
  );
}
export default MainLayout;
