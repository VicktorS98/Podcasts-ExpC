import React from "react"
import styles from "../styles/Player.module.css"
import { GrPlayFill } from "react-icons/gr"
import { GiPauseButton } from "react-icons/gi"
import { AiFillBackward } from "react-icons/ai"
import { AiFillForward } from "react-icons/ai"

export default function Player({ isPlaying, setIsPlaying, audioElem, durationSec, podTitle, currentTime, progressBar, adaptTimeToThumb, podIsActive }) {

  // cuando se carga la pag detecta el window width para detectar cuando dejar de animar los titulos según tamaño
  const [widthOver750, setWidthOver750] = React.useState(false)
  React.useEffect(() => {
    if (window.innerWidth >= 750) {
    setWidthOver750(true)
    }
  }, [])

  // pone play y pausa
  function togglePlayPause() {
    setIsPlaying(!isPlaying)
  }

  // calcula el tiempo de ms a segundos, minutos y horas(de ser necesario)
  function calculateTime(secs) {
    const hours = Math.floor((secs / 3600) % 24)
    const returnedHours = hours < 10 ? `0${hours}` : `${hours}`
    const minutes = Math.floor((secs / 60) % 60)
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
    const seconds = Math.floor(secs % 60)
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`
    if (returnedHours === "00") {
      return `${returnedMinutes}:${returnedSeconds}`
    } else {
      return `${returnedHours}:${returnedMinutes}:${returnedSeconds}`
    }
  }

  // 15seg para atrás
  function backFifteen() {
    audioElem.current.currentTime -= 15;
  }
  // 15seg para adelante
  function forwardsFifteen() {
    audioElem.current.currentTime += 15;
  }

  // caclula si el título va a tener que animarse haciendo un loop. Depende de la cantidad de letras
  const calculateTitleAnimation = (length) => {
    if (length < 42) {
      return styles.justText
    } else if (length >= 42 && length < 52) {
      return styles.loopSmall
    } else if (length >= 52 && length < 62) {
      return styles.loopMedium
    } else if (length >= 62 && length < 72) {
      return styles.loopBig
    } else if (length >= 72) {
      return styles.loopHuge
    }
  }

  return (
    <div className={styles.containerForMobile}>
        <div className={styles.songTitle}>
          <div className={durationSec && !widthOver750 ? calculateTitleAnimation(podTitle.length) : podTitle}>
            {durationSec ? podTitle : "-"}
          </div>
        </div>

        <div className={styles.navigation}>

          {/* current time */}
          <p className={styles.durationTracker}>
            {podIsActive && !isNaN(currentTime) ? calculateTime(currentTime) : "00:00"}
          </p>

          <input className={styles.progressBar} ref={progressBar} type="range" defaultValue="0" onChange={adaptTimeToThumb} />

          {/* total duration */}
          <p className={styles.durationTracker}>
            {podIsActive && !isNaN(durationSec) ? calculateTime(durationSec) : "00:00"}
          </p>
        </div>

        <div className={styles.controls}>
          <button className={styles.minusPlusSec} onClick={backFifteen}>
            <p>15</p>
            <AiFillBackward />
          </button>

          <button onClick={durationSec !== 0 ? togglePlayPause : undefined} className={styles.playerPlayPause}>
            {isPlaying ? <GiPauseButton className={styles.pauseBtnPlayer} /> : <GrPlayFill className={styles.playBtnPlayer} />}
          </button>

          <button className={styles.minusPlusSec} onClick={forwardsFifteen}>
            <AiFillForward />
            <p>15</p>
          </button>
      </div>
    </div>
  )
}