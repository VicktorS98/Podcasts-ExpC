import React from "react"
import styles from "../styles/PodItems.module.css"
import { FaPlay } from "react-icons/fa"
import { GiPauseButton } from "react-icons/gi"

export default function Carousel({ title, duration, id, image, isActive, isPlaying, selectPod, toggleActive }) {


  return (
    <div className={styles.card}>
      <p className={styles.cardTitle}>{title}</p>
      <p className={styles.duration}>{duration}</p>
      <img src={image} alt="ilustración-podcast" />
      <button onClick={function () {
        selectPod()
        toggleActive()
      }} className={isActive ? `${styles.playButton} + ${styles.active}` : `${styles.playButton}`}>
        {isActive && isPlaying ? <GiPauseButton className={styles.pauseBtnItems} /> : <FaPlay className={styles.playBtnItems} />}
      </button>
      <div className={styles.darken}></div>
    </div>
  )
};