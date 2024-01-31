import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RenderWords from "../../RenderWords/RenderWords";
import ButtonToBack from "../../Button/ButtonToBack/ButtonToBack";
import {ProgressData} from "../../Data/ProgressData";
import SaveExperience from "../../../utils/SaveExperience";

export default function TranslateWord({ words, sideWords, tab, stateHeader}) {
  //Откладываем изменения состояния хеадера до рендеринга app
  useEffect(() => {stateHeader(false)}, [stateHeader])
  
  const [randomWord, setRandomWord] = useState({})
  const [wordsArray, setWordsArray] = useState([])

  const [stateButton, setStateButton] = useState(false)
  const [alertState, setAlertState] = useState(false)

  const body = document.querySelector('body')
  
  const [count, setCount] = useState(0)

  const funcRandomWord = () => {
    setStateButton(true)

    // Генерируем новые случайные слова
    const newRandomWord = words[Math.floor((Math.random() * words.length))]
    const newWordsRUS = [newRandomWord.rus]

    // Инициализируем 3 побочных слова
    for (let count = 1; count < 4; count++) {
      let sideWord = sideWords[Math.floor((Math.random() * sideWords.length))]
      newWordsRUS.push(sideWord)
    }

    // Устанавливаем новые случайные слова и обнуляем массив
    setRandomWord(newRandomWord)
    setWordsArray(newWordsRUS)
  }

  // Перемешиваем массив wordsArray 
  const shuffleArray = array => array.sort(() => Math.random() - 0.5)
  
  // Присваиваем
  const shuffledArray = shuffleArray([...wordsArray]);

  // Получаем содержимое нажатой кнопки
  const getWord = (content) => {
    // Проверка на праильность нажатой кнопки
    if(content === randomWord.rus){

      setCount(count + 1)
      body.style.background = '#099121'
      setTimeout(function() {body.style.background = '#03030e'}, 800)
    }else{
      if(count > 0){
        setCount(count - 1)
      }
      body.style.background = '#310404'
      setTimeout(function() {body.style.background = '#03030e'}, 800)
    }

    funcRandomWord()
  }

  const toBackPopupAlert = () => {
    setAlertState(!alertState)
    stateHeader(true)
  } 


    //Save Progress Word
    function addProgressWords() {
      // Увеличиваем прогресс на 1
      ProgressData.trasnlateWords += 1
    
      // Сохраняем обновленное значение в локальное хранилище
      localStorage.setItem('trasnlateWords', ProgressData.trasnlateWords);

      SaveExperience(50)

      return stateHeader(true)
    }

    //Save Progress Color
    function addProgressColors() {
      // Увеличиваем прогресс на 1
      ProgressData.trasnlateColors += 1;
    
      // Сохраняем обновленное значение в локальное хранилище
      localStorage.setItem('trasnlateColors', ProgressData.trasnlateColors);
  

      SaveExperience(35)

      return stateHeader(true);
    }


  return (
    <div>
      <ButtonToBack toBackPopupAlert={toBackPopupAlert} alertState={alertState}/>

      <button className={stateButton === true ? 'disabled-button' : 'active-button'} onClick={funcRandomWord}>Начать</button>
      
      {stateButton === true && <p className="count">Count: <span>{count}</span></p>}

      {randomWord !== '' && <RenderWords count={count} randomWord={randomWord} shuffledArray={shuffledArray} getWord={getWord}/>}

      {(count === 5) && (tab === 'Word' ? <h2 className="plus-experience">+50 очков опыта!</h2> : <h2 className="plus-experience">+35 очков опыта!</h2>)}

      {count === 5 && <button onClick={tab === 'Word' ? addProgressWords : addProgressColors}><Link to="/" className='button-to-back__center'>Закончить</Link></button>}
    </div>
  )
}