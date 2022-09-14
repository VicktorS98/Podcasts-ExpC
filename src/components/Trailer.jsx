import React from "react"
import styles from "../styles/Trailer.module.css"
import { FaPlay } from "react-icons/fa"
import { GiPauseButton } from "react-icons/gi"
import { FaChevronDown } from "react-icons/fa"

export default function Trailer({ title, image, duration, description, isActive, isPlaying, selectPod, toggleActive, isDesktop }) {

  const [infoDesplegada, setInfoDesplegada] = React.useState(false)

  function desplegarInfo() {
    setInfoDesplegada(!infoDesplegada)
  }

  return (
    <div className={styles.trailerCard}>
      <div className={styles.infoVisible}>
        <div className={styles.imgAndPlay}>
          <img src={image} className={styles.trailerImage} alt="ilustración-trailer" />
          <button onClick={function () {
            selectPod()
            toggleActive()
          }} className={isActive ? `${styles.playButton} + ${styles.active}` : `${styles.playButton}`}>
            {isActive && isPlaying ? <GiPauseButton className={styles.pauseBtnTrailer} /> : <FaPlay className={styles.playBtnTrailer} />}
          </button>
          <div className={styles.darken}></div>
          <p className={styles.duration}>{duration}</p>
        </div>
        <div className={styles.info}>
          <p className={styles.trailerTitle}>{title}</p>
          <p onClick={desplegarInfo} className={styles.moreInfoToggle}><span>Más info </span><FaChevronDown className={infoDesplegada ? `${styles.arrow} ${styles.active}` : styles.arrow}/></p>
        </div>
      </div>
      <div className={infoDesplegada ? `${styles.infoDesplegable} ${styles.active}` : styles.infoDesplegable}>
        <p className={styles.trailerDescription}>{description}</p>
        <ul>
          <li>Narración: Gabriel Gellon</li>
          <li>Producción: Renata di Tullio</li>
          <li>Música: Valentin Perez Cerutti y Santino di Tullio</li>
          <li>Gráfica: Paula González Giqueaux y Juan Ignacio Iribarren</li>
          <li>Contenido: Jimena Pereira, Francisco Weitzman, Manuel Fernández y Emmanuel González</li>
        </ul>
      </div>
    </div>
  )
};