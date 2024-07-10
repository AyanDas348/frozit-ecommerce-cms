const lottiejson = 'https://lottie.host/111eafd2-b609-4b2e-a4c2-4330aabccb79/10yotFeuPd.json'

import Lottie from 'lottie-react'

import classes from './index.module.scss'

export default function Custom404() {
  return (
    <div className={classes.svgContainer}>
      <svg
        version="1.1"
        id="L7"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 100 100"
        enable-background="new 0 0 100 100"
        xmlSpace="preserve"
        width="50px"
        height="50px"
      >
        <path
          fill="#000"
          d="M82,35.7C74.1,18,53.4,10.1,35.7,18S10.1,46.6,18,64.3l7.6-3.4c-6-13.5,0-29.3,13.5-35.3s29.3,0,35.3,13.5
        L82,35.7z"
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            dur="1s"
            from="0 50 50"
            to="360 50 50"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
  )
}
