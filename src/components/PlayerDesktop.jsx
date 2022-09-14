import React from "react"
import styles from "../styles/PlayerDesktop.module.css"
import { GrPlayFill } from "react-icons/gr"
import { GiPauseButton } from "react-icons/gi"
import { AiFillBackward } from "react-icons/ai"
import { AiFillForward } from "react-icons/ai"
import { BsFillVolumeMuteFill, BsFillVolumeOffFill, BsFillVolumeDownFill, BsFillVolumeUpFill } from "react-icons/bs"

export default function Player({ isPlaying, setIsPlaying, audioElem, durationSec, podTitle, podImage, currentTime, progressBar, adaptTimeToThumb, podIsActive, mute, setMute }) {

  // ref para volumen en desktop
  const volumeBar = React.useRef();

  const [volume, setVolume] = React.useState(100)

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
    if (length < 30) {
      return styles.justText
    } else if (length >= 30 && length <= 43) {
      return styles.loopSmall
    } else if (length >= 44 && length <= 53) {
      return styles.loopMedium
    } else if (length >= 53 && length <= 63) {
      return styles.loopBig
    } else if (length > 63) {
      return styles.loopHuge
    }
  }

  // adapta el volumen según la barra de volumen
  function adaptVolumeToThumb() {
    audioElem.current.volume = volumeBar.current.value / 100;
    setVolume(volumeBar.current.value);
    moveVolumeProgressColor()
  }

  function moveVolumeProgressColor() {
    volumeBar.current.style.setProperty("--seek-before-width-volume", `${volume}%`)
  }


  // mute audio y cambiar el state de mute a true para que cambie el icono del parlante
  function muteAudio() {
    audioElem.current.muted = !audioElem.current.muted 
    setMute(!mute)
  }


  // decide qué icono de parlante mostrar dependiendo del volumen
  function VolumeBtns() {
    return mute
    ? <BsFillVolumeMuteFill className={styles.volumeIcon} />
    : volume <= 20 ? <BsFillVolumeOffFill className={styles.volumeIcon} />
    : volume <= 70 ? <BsFillVolumeDownFill className={styles.volumeIcon} />
    : <BsFillVolumeUpFill className={styles.volumeIcon} />
  }

  return (
    <div className={styles.containerForDesktop}>
      <div className={styles.playerImage}>
        <img src={podImage} alt="pod-image" />
      </div>
      <div className={styles.barAndControl}>
        <div className={styles.songTitle}>
          <div className={calculateTitleAnimation(podTitle.length)}>
            <p>{durationSec !== 0 ? podTitle : "-"}</p>
          </div>
        </div>

        <div className={styles.navigation}>
          {/* progress bar */}
          <input className={styles.progressBar} ref={progressBar} type="range" defaultValue="0" onChange={adaptTimeToThumb} />
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
      <div className={styles.timeAndVolume}>
        <div className={styles.volumeControls}>
          <button className={styles.volumeBtn} onClick={muteAudio}>
            <VolumeBtns />
          </button>
          {/* volume bar */}
          <input ref={volumeBar} defaultValue="100" onChange={adaptVolumeToThumb} onClick={() => moveVolumeProgressColor()} type="range" className={styles.volumeBar} />
        </div>

        <div className={styles.timeDiv}>
          {/* current time */}
          <p className={styles.durationTracker}>
            {currentTime !== 0 && !isNaN(currentTime) ? calculateTime(currentTime) : "00:00"}
          </p>
          <p>/</p>
          {/* total duration */}
          <p className={styles.durationTracker}>
            {durationSec !== 0 && !isNaN(durationSec) ? calculateTime(durationSec) : "00:00"}
          </p>
        </div>
      </div>
    </div>
  )
}