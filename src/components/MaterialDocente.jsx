import React from "react"
import styles from "../styles/MaterialDocente.module.css"
import dataDocente from "../dataMaterialDocente.json"
import { FaChevronDown } from "react-icons/fa"
import {IoMdDownload} from "react-icons/io"
 
export default function MaterialDocente() {

  const [materialDesplegado, setMaterialDesplegado] = React.useState(false)

  return (
    <>
    <a href="#material" onClick={() => setMaterialDesplegado(!materialDesplegado)} className={styles.tituloMaterial}>Material Docente <FaChevronDown className={materialDesplegado ? `${styles.arrow} ${styles.active}` : styles.arrow} /> </a>
    <div id="material" className={materialDesplegado ? `${styles.materialCards} ${styles.active}` : styles.materialCards}>
      {dataDocente.map(item => {
        return (
          <div key={item.title} className={styles.materialCard}>
            <img src={item.image} alt="pod-img"></img>
            <div className={styles.titleDownload}>
              <p>{item.title}</p>
              <a target="_blank" href={item.link}><IoMdDownload /> Descarga</a>
            </div>
          </div>
        )
      })}
    </div>
    </>
  )
};