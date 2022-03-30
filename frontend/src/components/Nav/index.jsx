import React from 'react';
import { Link } from 'react-router-dom';
import './nav.scss';

function Nav() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">A</Link>
        </li>
        <li>
          <Link to="/login">B</Link>
        </li>
        <li>
          <Link to="/register">C</Link>
        </li>
      </ul>
    </nav>
  );
}
export default Nav;
