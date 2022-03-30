import React from 'react';
const useToggle = (initialState = false) => {
  // Initialize the state
  const [state, setState] = React.useState(initialState);

  // Define and memorize toggler function in case we pass down the component,
  // This function change the boolean value to it's opposite value
  const toggle = React.useCallback(() => setState((state) => !state), []);

  return [state, toggle];
};

export default useToggle;
