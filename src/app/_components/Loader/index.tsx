// components/LoadingScreen.js
import styles from './index.module.scss'

const LoadingScreen = () => {
  return (
    <div className={styles.container}>
      <div className={styles.loader}></div>
      <p>Loading your content ...</p>
    </div>
  )
}

export default LoadingScreen
