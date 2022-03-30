import React from 'react';
import './landing.scss';

function Landing() {
  return (
    <div class="Header">
      <div class="Header-background"></div>
      <div class="Header-content">
        <div class="Header-hero">
          <h1>
            The best app you've <br /> ever seen
          </h1>
          <p>You'll be blown away with all it does</p>
          <button class="Button">Sign up</button>
        </div>
        <div class="Header-visuals">
          <div class="Iphone"></div>
        </div>
      </div>
    </div>
  );
}
export default Landing;
