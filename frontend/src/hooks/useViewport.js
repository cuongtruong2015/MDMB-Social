import React from 'react';

function useViewport() {
  const [width, setWidth] = React.useState(window.innerWidth);
  // Add a second state variable "height" and default it to the current window height
  const [height, setHeight] = React.useState(window.innerHeight);

  React.useLayoutEffect(() => {
    const handleWindowResize = () => {
      setWidth(window.innerWidth);
      // Set the height in state as well as the width
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  // Return both the height and width
  return { width, height };
}

export default useViewport;
