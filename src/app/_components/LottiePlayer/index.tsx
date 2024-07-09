const lottiejson = 'https://lottie.host/111eafd2-b609-4b2e-a4c2-4330aabccb79/10yotFeuPd.json'

import Lottie from 'lottie-react'

export default function Custom404() {
  return (
    <div className="flex flex-col w-full justify-center items-center">
      <Lottie animationData={lottiejson} className="flex justify-center items-center" loop={true} />
    </div>
  )
}
