import { Moon, Sun } from '@styled-icons/heroicons-solid';
import { ThemeContext } from 'context/themeContext';
import React, { useContext } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const LightIcon = styled(Sun)`
  width: 1.4rem;
`;
const DarkIcon = styled(Moon)`
  width: 1.4rem;
`;

function ToggleTheme() {
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);

  return (
    <Wrapper onClick={toggleTheme}>
      {isDarkTheme ? <DarkIcon /> : <LightIcon />}
    </Wrapper>
  );
}

export default ToggleTheme;
