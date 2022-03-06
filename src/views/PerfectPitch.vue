<template>

  <Topbar />

  <div class="homeWrapper">

    <div class="card col-7" style="display: flex; justify-content: space-around; align-items: center; flex-direction: column">
      
      <div style="text-align: center;">
        <h1>Welcome to the <u>Perfect Pitch</u> Mode!</h1>
        <img alt="TuneApp Logo" :src="TuneAppLogo" height="100" class="mt-5" />
      </div>

      <div style="text-align: center; display: flex; flex-direction: column; align-items: center;" class="my-5">
        <div>
          <Button class="p-button-info mb-3 mr-3" style="width: fit-content;" @click="playRandomNote()">Play a random note</Button>
          <Button class="p-button-info mb-3 ml-3" style="width: fit-content;" @click="playRandomChord()">Play a random chord</Button>
        </div>
        <fieldset id="settingsFieldset" class="p-3 mb-3" style="width: fit-content; border: groove 3px; text-align: center">
          <legend>Settings</legend>
          <div class="my-3" style="display: flex; align-items: center; flex-direction: column;">
            <h5>Guess notes from {{currentMinNote}} to {{currentMaxNote}}</h5>
            <Slider v-model="pitchRange" :range="true" :min="21" :max="102" class="mb-3" style="width: 14rem"/>
          </div>
          <div class="my-3" style="display: flex; align-items: center; flex-direction: column;">
            <h5>Number of options: {{numGuessingOptions}}</h5>
            <Slider v-model="numGuessingOptions" :min="2" :max="12" style="width: 14rem"/>
          </div>
          <Button class="p-button-info mb-3" style="width: fit-content;" @click="resetSettings()">Reset to default settings</Button>
        </fieldset>

        <h3 v-if="this.guessedSolution" class="my-3">Correct! The note was: {{chosenRandomNoteName}}</h3>

        <fieldset v-if="guessingOptions.length > 0" id="guessingOptionsFieldset" class="col-12 mt-3 p-3" style="border: groove 3px; text-align: center">
          <legend>Options</legend>
          <Button v-for="option in guessingOptions" :key="option" class="mx-2 my-2"
          @click="guessOption(option)" :class="getGuessColor(option)">{{option.note}}</Button>
        </fieldset>

        <div class="mt-4" style="width: 25rem">
          <ProgressBar :value=" numberOfAttempts == 0 ? 0 : parseInt((correctGuesses/numberOfAttempts*100).toFixed(2))" />
        </div>

        <h5>Number of guessing attempts: {{numberOfAttempts}}</h5>
        <h5>Number of correct guesses: {{correctGuesses}}</h5>
        <h5>Number of incorrect guesses: {{incorrectGuesses}}</h5>
      </div>

      <div style="display: flex; align-items: center;">
        <Button class="p-button-info mr-2" style="width: fit-content;" @click="resetStatistics()">Reset statistics</Button>
        <router-link to="/">
          <Button class="p-button-info ml-2">Home</Button>
        </router-link>
      </div>
    </div>

  </div>
</template>

<script>
import Button from 'primevue/button'
import Slider from 'primevue/slider'
import ProgressBar from 'primevue/progressbar';
import TuneAppLogo from "@/assets/TuneAppLogoCropped.png"
import Topbar from '@/components/Topbar'
import abcjs from "abcjs/midi";
import correctGuess from '../assets/sounds/correctGuess.mp3'
import incorrectGuess from '../assets/sounds/incorrectGuess.mp3'
import axios from "axios";

export default {
  name: 'Home',
  components: {
    Button,
    Slider,
    Topbar,
    ProgressBar,
  },
  data() {
    return {
      TuneAppLogo: TuneAppLogo,
      pitchRange: [60, 71],
      chosenRandomPitch: 0,
      numGuessingOptions: 6,
      guessingOptions: [],
      correctGuesses: 0,
      incorrectGuesses: 0,
      numberOfAttempts: 0,
      guessedSolution: false
    }
  },
  methods: {
    playRandomNote() {
      this.guessedSolution = false
      this.chosenRandomPitch = Math.floor(Math.random() * (this.pitchRange[1] - this.pitchRange[0])) + this.pitchRange[0]
      this.chosenRandomNote = {pitch: this.chosenRandomPitch, durationInMeasures: 2, volume: 70, instrument: 0}
      this.playNotes([this.chosenRandomNote])
      
      this.guessingOptions = []
      let optionsToTheLeft = Math.floor(Math.random() * this.numGuessingOptions)

      for (let i = 0; i < this.numGuessingOptions; i++) {
        if (i < optionsToTheLeft)
          this.guessingOptions.unshift({pitch: this.chosenRandomPitch - i - 1, note: abcjs.synth.pitchToNoteName[this.chosenRandomPitch - i - 1], points: 1})
        else if (i > optionsToTheLeft)
          this.guessingOptions.push({pitch: this.chosenRandomPitch + i - optionsToTheLeft, note: abcjs.synth.pitchToNoteName[this.chosenRandomPitch + i - optionsToTheLeft], points: 1})
        else
          this.guessingOptions.push({pitch: this.chosenRandomPitch, note: abcjs.synth.pitchToNoteName[this.chosenRandomPitch], points: 1})
      }
    },
    playRandomChord() {
      this.guessedSolution = false
      this.chosenRandomPitch = Math.floor(Math.random() * (this.pitchRange[1] - this.pitchRange[0])) + this.pitchRange[0]
      this.chosenRandomNote = {pitch: this.chosenRandomPitch, durationInMeasures: 2, volume: 70, instrument: 0}
      let fifthOfChosenRandomNote = {pitch: this.chosenRandomPitch + 7, durationInMeasures: 2, volume: 70, instrument: 0}
      let majorThirdOfChosenRandomNote = {pitch: this.chosenRandomPitch + 4, durationInMeasures: 2, volume: 70, instrument: 0}
      let minorThirdOfChosenRandomNote = {pitch: this.chosenRandomPitch + 3, durationInMeasures: 2, volume: 70, instrument: 0}

      this.guessingOptions = []
      let optionsToTheLeft = Math.floor(Math.random() * this.numGuessingOptions)

      let chordTypeProbability = Math.random()
      if (chordTypeProbability < 0.34) {
        this.playNotes([this.chosenRandomNote, fifthOfChosenRandomNote])
      
        for (let i = 0; i < this.numGuessingOptions; i++) {
          if (i < optionsToTheLeft)
            this.guessingOptions.unshift({pitch: this.chosenRandomPitch - i - 1, note: abcjs.synth.pitchToNoteName[this.chosenRandomPitch - i - 1].slice(0, -1) + "5", points: 2})
          else if (i > optionsToTheLeft)
            this.guessingOptions.push({pitch: this.chosenRandomPitch + i - optionsToTheLeft, note: abcjs.synth.pitchToNoteName[this.chosenRandomPitch + i - optionsToTheLeft].slice(0, -1) + "5", points: 2})
          else
            this.guessingOptions.push({pitch: this.chosenRandomPitch, note: abcjs.synth.pitchToNoteName[this.chosenRandomPitch].slice(0, -1) + "5", points: 2})
        }
      } else if (chordTypeProbability < 0.68) {
        this.playNotes([this.chosenRandomNote, majorThirdOfChosenRandomNote, fifthOfChosenRandomNote])
      
        for (let i = 0; i < this.numGuessingOptions; i++) {
          if (i < optionsToTheLeft)
            this.guessingOptions.unshift({pitch: this.chosenRandomPitch - i - 1, note: abcjs.synth.pitchToNoteName[this.chosenRandomPitch - i - 1].slice(0, -1), points: 3})
          else if (i > optionsToTheLeft)
            this.guessingOptions.push({pitch: this.chosenRandomPitch + i - optionsToTheLeft, note: abcjs.synth.pitchToNoteName[this.chosenRandomPitch + i - optionsToTheLeft].slice(0, -1), points: 3})
          else
            this.guessingOptions.push({pitch: this.chosenRandomPitch, note: abcjs.synth.pitchToNoteName[this.chosenRandomPitch].slice(0, -1), points: 3})
        }
      } else {
        this.playNotes([this.chosenRandomNote, minorThirdOfChosenRandomNote, fifthOfChosenRandomNote])
      
        for (let i = 0; i < this.numGuessingOptions; i++) {
          if (i < optionsToTheLeft)
            this.guessingOptions.unshift({pitch: this.chosenRandomPitch - i - 1, note: abcjs.synth.pitchToNoteName[this.chosenRandomPitch - i - 1].slice(0, -1) + "m", points: 3})
          else if (i > optionsToTheLeft)
            this.guessingOptions.push({pitch: this.chosenRandomPitch + i - optionsToTheLeft, note: abcjs.synth.pitchToNoteName[this.chosenRandomPitch + i - optionsToTheLeft].slice(0, -1) + "m", points: 3})
          else
            this.guessingOptions.push({pitch: this.chosenRandomPitch, note: abcjs.synth.pitchToNoteName[this.chosenRandomPitch].slice(0, -1) + "m", points: 3})
        }
      }
    },
    playNotes(notesToBePlayed) {
      // playEvent(notesToBePlayed, graceNotesToBePlayed, measureDurationInMilliseconds)
      abcjs.synth.playEvent(notesToBePlayed, [], 1000).then(function (response) {
        console.log("Note played");
      }).catch(function (error) {
        console.log("Error playing note: ", error);
      });
    },
    guessOption(option) {
      if (!this.guessedSolution) {
        this.numberOfAttempts++
        var audio;
        if (option.pitch === this.chosenRandomPitch) {
          option.isCorrect = true
          audio = new Audio(correctGuess);
          audio.volume = 0.15
          audio.play();
          this.correctGuesses++
          this.guessedSolution = true
          axios.put(`/users/updateScore/${this.$store.state.userId}`, {"mode": "perfectPitch", "earnedPoints": option.points})
        } else {
          option.isCorrect = false
          audio = new Audio(incorrectGuess);
          audio.volume = 0.4
          audio.play();
          this.incorrectGuesses++
        }
      }
    },
    getGuessColor(option) {
      if (option.isCorrect == true)
        return 'p-button-success'
      else if (option.isCorrect == false)
        return 'p-button-danger'
      else
        return 'p-button-primary'
    },
    resetStatistics() {
      this.correctGuesses = 0
      this.incorrectGuesses = 0
      this.numberOfAttempts = 0
    },
    resetSettings() {
      this.pitchRange = [60, 71]
      this.numGuessingOptions = 6
    }
  },
  watch: {
    pitchRange() {
      if (Math.abs(this.pitchRange[0] - this.pitchRange[1]) === 0 && this.pitchRange[0] === 21)
        this.pitchRange = [this.pitchRange[0], this.pitchRange[1] + 1]
      else if (Math.abs(this.pitchRange[0] - this.pitchRange[1]) === 0 && this.pitchRange[1] === 102)
        this.pitchRange = [this.pitchRange[0] - 1, this.pitchRange[1]]
      else if (Math.abs(this.pitchRange[0] - this.pitchRange[1]) === 0)
        this.pitchRange = [this.pitchRange[0] - 1, this.pitchRange[1]]
    },
  },
  computed: {
    currentMinNote() {
      return abcjs.synth.pitchToNoteName[this.pitchRange[0]]
    },
    currentMaxNote() {
      return abcjs.synth.pitchToNoteName[this.pitchRange[1]]
    },
    chosenRandomNoteName() {
      return abcjs.synth.pitchToNoteName[this.chosenRandomPitch]
    },
    currentProgressBarColor() {
      let percentage = parseInt((this.correctGuesses/this.numberOfAttempts*100).toFixed(2))
      if (isNaN(percentage))
        return "grey"
      else if (percentage <= 33.33)
        return "red"
      else if (percentage > 33.33 && percentage <= 66.66)
        return "orange"
      else
        return "green"
    }
  }
};

  <link rel="stylesheet" type="text/css" href="abcjs-audio.css"/>
</script>

<style>

.homeWrapper {
  display: flex;
  margin-right: -0.5rem;
  margin-left: -0.5rem;
  margin-top: -0.5rem;
  align-content: space-between;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
}

.p-button {
  place-content: center;
}

.p-progressbar .p-progressbar-value {
  background-color: v-bind("currentProgressBarColor");
}

</style>
