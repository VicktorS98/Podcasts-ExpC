import React from 'react'
import styles from "../src/styles/App.module.css"
import Trailer from './components/Trailer'
import PodItems from "./components/PodItems"
import Player from './components/Player'
import PlayerDesktop from './components/PlayerDesktop'
import { parse } from "rss-to-json"
import { nanoid } from 'nanoid'
import MaterialDocente from './components/MaterialDocente'

export default function App() {

  const [xmlData, setXmlData] = React.useState([])
  const [podItemsArray, setPodItemsArray] = React.useState([])
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [podIsActive, setPodIsActive] = React.useState(false)
  const [currentlyPlayingPodURL, setCurrentlyPlayingPodURL] = React.useState()
  const [durationSec, setDurationSec] = React.useState(0)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [podTitle, setPodTitle] = React.useState("")
  const [podImage, setPodImage] = React.useState()
  const [mute, setMute] = React.useState(false)

  // ref para el audio
  const audioElem = React.useRef();
  // ref para el progressBar
  const progressBar = React.useRef();
  // ref para animación del color de progreso en la barra
  const colorProgress = React.useRef();


  // para que espere 2 seg antes de renderear el material docente así la pag no se ve rara al cargar
  const [waitedToMount, setWaitedToMount] = React.useState(false)

   // state que define si se está en tamaño desktop
   const [isDesktop, setIsDesktop] = React.useState(false)
   // cuando se carga la pag detecta el window width
   React.useEffect(() => {
   }, [])


  // llama a la función que parsea el RSS y da state a los items a penas se inicia la página
  React.useEffect(() => {
    fetchData()

    // detecta window width para saber si es desktop o no y cambiar el player
    if (window.innerWidth > 1000) {
      setIsDesktop(true)
    }

    // que espere medio segundo antes de renderear el material docente
    setTimeout(() => {
      setWaitedToMount(true)
    }, 500)
  }, [])


  const RSS_URL = "https://anchor.fm/s/2fe1f008/podcast/rss"

  // funcion que parsea el RSS y pone toda la info en los states que creé arriba
  async function fetchData() {
    const data = await parse(RSS_URL)
    setXmlData(data)
    setPodItemsArray(data.items.map(item => {
      // sacarle los tags a la description o a lo que sea necesario
      const quitarTags = /(<([^>]+)>)/ig;
      const description = item.description.replace(quitarTags, "");
      return {
        title: item.title,
        duration: checkDuration(item.itunes_duration),
        durationMs: item.enclosures[0].length,
        id: nanoid(8),
        image: item.itunes_image.href,
        podURL: item.enclosures[0].url,
        isActive: false,
        description: description
      }
    }))
  }

  // checkea la duración del pod y decide si mandar horas o no
  function checkDuration(dur) {
    if (dur.charAt(1) == 0) {
      return dur.slice(3)
    }
  }


  // funcion que checkea isPlaying para empezar a reproducir el audio 
  React.useEffect(() => {
    if (isPlaying) {
      audioElem.current.play()
    } else {
      audioElem.current.pause()
    }
  }, [isPlaying])


  // funcion que pone como activo solo al pod clickeado
  function toggleActive(id) {
    setPodItemsArray(oldItems => oldItems.map(item => {
      return item.id === id ?
        { ...item, isActive: true } :
        { ...item, isActive: false }
    }))
  }


  // funcion que selecciona el pod que va a reproducirse y setea los states necesarios para que eso pase
  function selectPod(item) {
    const currentURL = item.podURL
    if (currentURL === currentlyPlayingPodURL) {
      setIsPlaying(!isPlaying)
    } else {
      setIsPlaying(false)
      setProgressBarToZero(); //arregla glitch visual al cambiar de podcast
      setCurrentlyPlayingPodURL(currentURL)
      setTimeout(() => {
        setIsPlaying(true)
      }, 500)
      setPodTitle(item.title)
      setPodImage(item.image)
      setPodIsActive(true)
    }
  }

  // funcion que detecta las duraciones y activa la barra, mientras se reproduce el audio seleccionado 
  function whilePlaying() {

    const duration = audioElem.current.duration
    const currentTime = audioElem.current.currentTime
    setDurationSec(duration)
    setCurrentTime(currentTime)
    progressBar.current.max = Math.floor(duration);

    // que la barra se mueva con el currentTime
    progressBar.current.value = audioElem.current.currentTime

    if (isPlaying) {
      colorProgress.current = requestAnimationFrame(adaptProgressColor)
    }
  }


  // checkea si llegó al final y si es así pone pausa
  React.useEffect(() => {
    if (currentTime / durationSec * 100 === 100) {
      setIsPlaying(false)
    }
  }, [currentTime])


  // funcion que llamo con el requestanimationframe que adapta el color de progreso en chrome y safari
  function adaptProgressColor() {
    progressBar.current.style.setProperty("--seek-before-width", `${progressBar.current.value / Math.floor(durationSec) * 100}%`)
  }

  // adapta el tiempo actual de reproducción a lo que se defina en el thumb de la barra
  function adaptTimeToThumb() {
    audioElem.current.currentTime = progressBar.current.value
    adaptProgressColor()
  }

  // funcion para pasar cuando se cambia de podcast para que no haya un glitch visual del remanente de la barra de progreso del último podcast(en chrome y safari)
  function setProgressBarToZero() {
    progressBar.current.style.setProperty("--seek-before-width", "0")
  }

  // poniendo el titulo del trailer en una variable para comparar, filtrar y ponerlo en otra variable diferente a los episodios del podcast
  const trailerTitulo = "Trailer Expedición a las Historias de la Ciencia Podcast"
  const trailerElement = podItemsArray
    .filter(item => item.title === trailerTitulo)
    .map(item => (
      <Trailer
        key={item.title}
        title={item.title}
        duration={item.duration}
        image={item.image}
        description={item.description}
        isActive={item.isActive}
        isPlaying={isPlaying}
        isDesktop={isDesktop}
        toggleActive={() => toggleActive(item.id)} // compara id´s para poner como activo al clickeado
        selectPod={() => selectPod(item)} // para setear el resto de los states necesarios
      />
    ))

  /* filtrando el trailer y devolviendo el resto */
  const podElements = podItemsArray
    .filter(item => item.title !== trailerTitulo)
    .map(item => (
      <PodItems
        key={item.title}
        title={item.title}
        duration={item.duration}
        id={item.id}
        image={item.image}
        description={item.description}
        isActive={item.isActive}
        isPlaying={isPlaying}
        toggleActive={() => toggleActive(item.id)} // compara id´s para poner como activo al clickeado
        selectPod={() => selectPod(item)} // para setear el resto de los states necesarios
      />
    ))

  return (
    <div className={podIsActive && isDesktop ? `${styles.appContainer} ${styles.desktop}` : podIsActive && !isDesktop ? `${styles.appContainer} ${styles.mobile}` : styles.appContainer}>
      <div className={styles.trailerContainer}>
        {trailerElement}
      </div>
      <div className={styles.podsContainer}>
        {podElements}
      </div>
      <div className={podIsActive ? `${styles.playerContainer} ${styles.active}` : `${styles.playerContainer}`}>
        {!isDesktop && <Player
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          audioElem={audioElem}
          durationSec={durationSec}
          podTitle={podTitle}
          podImage={podImage}
          currentTime={currentTime}
          progressBar={progressBar}
          adaptTimeToThumb={adaptTimeToThumb}
          podIsActive={podIsActive}
        />}
        {isDesktop && <PlayerDesktop
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          audioElem={audioElem}
          durationSec={durationSec}
          podTitle={podTitle}
          podImage={podImage}
          currentTime={currentTime}
          progressBar={progressBar}
          adaptTimeToThumb={adaptTimeToThumb}
          podIsActive={podIsActive}
          mute={mute}
          setMute={setMute}
        />}
      </div>
      <div className={styles.materialDocenteContainer}>
        {waitedToMount && <MaterialDocente />}
      </div>
      <audio ref={audioElem} src={currentlyPlayingPodURL} onTimeUpdate={whilePlaying} preload="auto" muted={false}></audio>
    </div>
  )
}

