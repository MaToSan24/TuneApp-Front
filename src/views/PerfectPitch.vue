<template>

  <Topbar />

  <div class="homeWrapper">

    <div class="card col-7" style="display: flex; justify-content: space-around; align-items: center; flex-direction: column">
      
      <div style="text-align-last: center;">
        <h1>Welcome to the <u>Free Practice</u> Mode</h1>
        <img alt="TuneApp Logo" :src="TuneAppLogo" height="100" class="mt-5" />
      </div>

      <div class="mb-5">
        <Button class="p-button-info mb-3" @click="playRandomNote()">Play a random note</Button>
        <h5>Range: {{pitchRange[0]}}, {{pitchRange[1]}}</h5>
        <h5>Range: {{currentMinNote}}, {{currentMaxNote}}</h5>
        <Slider v-model="pitchRange" :range="true" :min="21" :max="102" class="mb-3" style="width: 14rem"/>
        <h5>Number of options for guessing: {{numGuessingOptions}}</h5>
        <Slider v-model="numGuessingOptions" :min="2" :max="12" style="width: 14rem"/>
        <h5>Chosen random pitch: {{chosenRandomPitch}}</h5>
        <h5>Chosen random note: {{chosenRandomNoteName}}</h5>
        <h5>Guessing options: {{guessingOptions}}</h5>
        <div id="guessingOptionsDiv">
          <Button v-for="option in guessingOptions" :key="option" class="p-button-info mx-2" @click="guessOption(option)">{{option.note}}</Button>
        </div>
        <h5>Number of guessing attempts: {{numberOfAttempts}}</h5>
        <h5>Number of correct guesses: {{correctGuesses}}</h5>
        <h5>Number of incorrect guesses: {{incorrectGuesses}}</h5>
        <ProgressBar :value="(correctGuesses/numberOfAttempts*100).toFixed(2) || 0" />
        <h5 v-if="this.guessedSolution">Correct! The note was: {{chosenRandomNoteName}}</h5>
        
      </div>
      <div style="display: flex; flex-direction: column; align-items: center;">
        <router-link to="/">
          <Button class="p-button-info">Home</Button>
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
      numGuessingOptions: 12,
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
          this.guessingOptions.unshift({pitch: this.chosenRandomPitch - i - 1, note: abcjs.synth.pitchToNoteName[this.chosenRandomPitch - i - 1]})
        else if (i > optionsToTheLeft)
          this.guessingOptions.push({pitch: this.chosenRandomPitch + i - optionsToTheLeft, note: abcjs.synth.pitchToNoteName[this.chosenRandomPitch + i - optionsToTheLeft]})
        else
          this.guessingOptions.push({pitch: this.chosenRandomPitch, note: abcjs.synth.pitchToNoteName[this.chosenRandomPitch]})
      }
    },
    // randomChord() {
    //   [   // a C chord
    //     {pitch:60,durationInMeasures:2,volume:70,instrument:0},
    //     {pitch:64,durationInMeasures:2,volume:70,instrument:0},
    //     {pitch:67,durationInMeasures:2,volume:70,instrument:0},
    //   ]
    // },
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
        if (option.pitch === this.chosenRandomPitch) {
          this.correctGuesses++
          this.guessedSolution = true
        } else
          this.incorrectGuesses++
      }
    }
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
      let percentage = (this.correctGuesses/this.numberOfAttempts*100).toFixed(2)
      console.log("Percentage: ", percentage)
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
