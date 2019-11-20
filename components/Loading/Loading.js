import React from 'react';


const Loading = (props) => (
  <div className="loader mx-auto d-block">
    <div />
    <div />
    <div />
    <div />

    <style jsx>{`
      .loader {
        display: inline-block;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -50px;
        margin-left: -50px;
        width: 64px;
        height: 64px;
      }
      .loader div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 51px;
        height: 51px;
        margin: 6px;
        border: 6px solid var(--greenapple);
        border-radius: 50%;
        animation: loader 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: var(--greenapple) transparent transparent transparent;
      }
      .loader div:nth-child(1) {
        animation-delay: -0.45s;
      }
      .loader div:nth-child(2) {
        animation-delay: -0.3s;
      }
      .loader div:nth-child(3) {
        animation-delay: -0.15s;
      }
      @keyframes loader {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `}</style>

  </div>
);

export default Loading;