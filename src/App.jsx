import React from "react"
import { languages } from "./languages"
import { clsx } from "clsx"
import { getFarewellText, getRandomWord } from "./util"
import { motion } from "framer-motion"

export default function Hangman() {

  const [currentWord,setCurrentWord] = React.useState(getRandomWord())
  const [guessedLetters,setGuessedLetters] = React.useState([])
  const [isLightMode, setIsLightMode] = React.useState(false)
  const [farewellMessage,setFarewellMessage] = React.useState("")
  
  const alphabet="abcdefghijklmnopqrstuvwxyz"

  const wrongGuessesCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length
  const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))
  const isGameLost = wrongGuessesCount >= languages.length-1
  const isGameOver = isGameWon || isGameLost
  const lastGuessedLetter = guessedLetters[guessedLetters.length-1]
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

  React.useEffect(()=>{
    document.body.classList.toggle("light",isLightMode)
  },[isLightMode])

  function toggleTheme(){
    setIsLightMode(prev => !prev)
  }

  function addGuessedLetter(letter){
    setGuessedLetters(prevLetters =>{
      const updated = prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
      const isWrong = !currentWord.includes(letter)

      if(isWrong)
      {
        const nextWrongCount = updated.filter(l=>!currentWord.includes(l)).length
        setFarewellMessage(getFarewellText(languages[nextWrongCount - 1].name))
      }
      return updated
    })
  }

  function startNewGame()
  {
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
  }

  const languageElements = languages.map((lang, index)=>{
    const isLanguageLost = index < wrongGuessesCount
    const styles = {
    backgroundColor: lang.backgroundColor,
    color: lang.color
  }
  const className = clsx("chip", isLanguageLost && "lost")
  return(<motion.span className={className}
    key={lang.name}
    style={styles}
    animate={isLastGuessIncorrect&&index===wrongGuessesCount-1?{scale:[1,1.4,1]}:{}}
    transition={{duration: 0.4}}>{lang.name}</motion.span>)
  })
    
    const letterElements = currentWord.split("").map((letter,index)=>{
      const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
      const letterClassName = clsx(isGameLost&&!guessedLetters.includes(letter)&&"missed-letter")
      return(
      <span key={index} className={letterClassName}>
        {shouldRevealLetter ? <motion.span initial={{y: -20,opacity:0}}
        animate={{y: 0, opacity:1 }}
        transition={{duration: 0.3}}>
          {letter.toUpperCase()}</motion.span> : ""}
      </span>
    )
})

    const keyboardElements = alphabet.split("").map(letter=>{
      const isGuessed = guessedLetters.includes(letter)
      const isCorrect = isGuessed && currentWord.includes(letter)
      const isWrong = isGuessed && !currentWord.includes(letter)
      const className = clsx({
        correct : isCorrect,
        wrong : isWrong
      })
      return(
        <motion.button
        whileTap={{scale: 0.9}}
        whileHover={{scale: 1.1}}
        className={className}
        key={letter}
        disabled={isGameOver || guessedLetters.includes(letter)}
        onClick={() => addGuessedLetter(letter)}>{letter.toUpperCase()}
        </motion.button>
      )
    }
    )
    const gameStatusClass = clsx("game-status",{
      won : isGameWon,
      lost : isGameLost,
      farewell : !isGameOver && isLastGuessIncorrect
    })
    function renderGameStatus(){
    if(!isGameOver && isLastGuessIncorrect && farewellMessage){
      return <p className="farewellMessage">
        {farewellMessage}</p>
    }
    if(isGameWon)
    {
      return(
        <>
          <h2>You win!</h2>
          <p>Well Done! 🎉</p>
        </>
      )
    }
    if(isGameLost){
      return(
        <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly! 😭</p>
        </>
        )
    }
   return null
  }

    return (
        <main>
            <header>
              <h1 className="animated-title">Decompile the Code</h1>
              <p>Guess the hidden word before your attempts run out, or risk losing to an assembly-level crisis. Each wrong guess brings you closer to decompiling the code. Can you save the system in time? ⏳</p>
            </header>
            <div className="theme-toggle-wrapper">
            <button className="toggle-theme" onClick={toggleTheme}>
              {isLightMode ? "🌙 Dark Mode" : "🌞 Light Mode"}
            </button>
            </div>
            <section className={gameStatusClass}>
              {renderGameStatus()}
            </section>
            <section className="language-chips">
              {languageElements}
            </section>
            <motion.section className="word"
            animate={isLastGuessIncorrect?{x:[0,-5,-5,-5,0]}:{}}
            transition={{duration: 0.4}}>
              {letterElements}
            </motion.section>
            <section className="keyboard">
              {keyboardElements}
            </section>
            <section>
              {isGameOver && <button className="new-game" onClick={startNewGame}>New Game</button>}
            </section>
        </main>
    )
}