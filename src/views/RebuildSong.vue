<template>

  <Topbar />

  <div class="homeWrapper">

    <div class="card col-7" style="width: auto; display: flex; justify-content: space-around; align-items: center; flex-direction: column">
      
      <div style="text-align-last: center;">
        <h1>Welcome to the <u>Rebuild the Song</u> Mode!</h1>
      </div>

      <div class="col-9 mt-3 mb-1">
        <h2>Sound Font Options</h2>
        <div v-for="option in soundFontOptions" :key="option.url">
          <div class="mb-2">
            <RadioButton :id="option.name" name="soundFontOption" :value="option.url" v-model="soundFontUrl" @change="changeSoundfount" />
            <label class="ml-1" style="line-height: 1.66" :for="option.name">{{option.name}}</label>
          </div>
        </div>
      </div>

      <div class="flex align-items-center" v-if="songToGuess.solutionAudioFileName">
        <h3 class="m-0 mr-3">Play solution:</h3>
        <audio id="audioSource" controls preload>
          <source :src='require("../../public/songs/" + songToGuess.solutionAudioFileName + ".mp3")' type="audio/mpeg">
        </audio>
      </div>

      <div class="col-12" id="editorDiv" style="text-align: center">
        <v-ace-editor @input="rerender()" id="ace-editor" v-model:value="editorContent" lang="abc" theme="clouds" style="height: 400px; font-size: 16px" />
        <Button class="p-button-info mt-3" @click="resetEditorContent">Reset editor content</Button>
      </div>

      <div class="abcjsDiv mt-3">
        <textarea id="abc-source" v-model="editorContent" style="display: none" />
        <div id="midi"></div>
        <div id="paper" @click="selectInAceEditor()"></div>
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
import RadioButton from 'primevue/radiobutton';
import TuneAppLogo from "@/assets/TuneAppLogoCropped.png"
import Topbar from '@/components/Topbar'
import { VAceEditor } from 'vue3-ace-editor';
import ace from 'ace-builds';
import 'ace-builds/webpack-resolver';
import "font-awesome/css/font-awesome.min.css";
import 'abcjs/abcjs-midi.css';
import abcjs from "abcjs/midi";
import axios from 'axios'

export default {
  name: 'Home',
  components: {
    Button,
    RadioButton,
    Topbar,
    VAceEditor,
  },
  data() {
    return {
      songToGuess: {},
      TuneAppLogo: TuneAppLogo,
      progress: {},
      currentAbcFragment: "(none)",
      soundFontUrl: "",
      soundFontOptions: [
        {name: "FluidR3_GM", url: "https://paulrosen.github.io/midi-js-soundfonts/FluidR3_GM/"},
        {name: "FatBoy", url: "https://paulrosen.github.io/midi-js-soundfonts/FatBoy/"},
        {name: "MusyngKite", url: "https://paulrosen.github.io/midi-js-soundfonts/MusyngKite/"},
      ],
      render: null,
      editor: null,
      editorContent: ``,
      audioFile: null,
    }
  },
  created() {
    axios.get(`/songs/${this.$route.params.id}`, { params: {
      userId: this.$store.state.userId,
    }})
    .then((response) => {
      this.songToGuess = response.data;
      this.editorContent = this.songToGuess.musicSheet + "%Start typing here..."
    })
    .catch((e)=>{
      console.log('error' + e);
    })
  },
  mounted() {
    this.soundFontUrl = this.$store.state.selectedSoundFontUrl
    this.editorContent = this.$store.state.freePracticeEditorContent
    this.rerender()
  },
  methods: {
    listener(midiControl, progress) {
      // This provides a more linear view of the progress, for a progress bar or for an unrelated animation.
      this.progress = progress;
    },
    colorRange(range, color) {
      if (range && range.elements) {
        range.elements.forEach(function (set) {
          set.forEach(function (item) {
            item.setAttribute("fill", color);
          });
        });
      }
    },
    animate(lastRange, currentRange) {
      // This provides the actual visual note being played. It can be used to create the "bouncing ball" effect.
      this.colorRange(lastRange, "#000000"); // Set the old note back to black.
      this.colorRange(currentRange, "#3D9AFC"); // Set the currently sounding note to blue.
      if (currentRange)
        this.currentAbcFragment = this.editorContent.substring(currentRange.startChar, currentRange.endChar);
      else
        this.currentAbcFragment = "(none)";
    },
    changeSoundfount() {
      this.$store.commit("changeSoundFont", this.soundFontUrl)
      this.$router.go()
    },
    saveEditorContent() {
      this.$store.commit("updateFreePracticeEditor", this.editorContent)
    },
    resetEditorContent() {
      this.editorContent = this.songToGuess.musicSheet + "%Start typing here..."
      this.$store.commit("updateFreePracticeEditor", this.songToGuess.musicSheet + "%Start typing here...")
    },
    rerender() {
      this.saveEditorContent()
      abcjs.midi.setSoundFont(this.soundFontUrl)

      this.render = abcjs.renderAbc("paper", this.editorContent, {});

      this.editor = new abcjs.Editor("abc-source", {
        canvas_id: "paper",
        generate_midi: true,
        midi_id: "midi",
        abcjsParams: {
          add_classes: true,
          midiListener: this.listener,
          animate: {
           listener: this.animate,
          }
        }
      });
    },
    playSolution() {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      var context = new AudioContext();

      var source = context.createBufferSource();
      let pruebaBuffer = Buffer.from(this.songToGuess.solutionAudio.data, 'binary');
      console.log("Prueba buffer: ", pruebaBuffer)

      context.decodeAudioData(pruebaBuffer.buffer).then((res) => {
        console.log("Res: ", res)
        source.buffer = res
        source.connect(context.destination);
        console.log("Source: ", source)
        source.start(0);
      })
    },
    selectInAceEditor() {
      var aceEditor = ace.edit("ace-editor")
      let currentRow = 0
      let startRow = 0
      let endRow = 0
      let startFound = false
      let endFound = false
      this.editorContent = this.editorContent.replace(/(\r)/gm, "");
      let editorRows = this.editorContent.split("\n")
      let charsUntilSelectionStart = this.editor.editarea.getSelection().start
      let charsUntilSelectionEnd = this.editor.editarea.getSelection().end

      for (let row of editorRows) {

        if (!startFound && charsUntilSelectionStart - row.length <= 0) {
          startFound = true
          startRow = currentRow
          // console.log("Start found at row '" + startRow + "', column '" + charsUntilSelectionStart + "': ")
        }
        if (!endFound && charsUntilSelectionEnd - row.length <= 0) {
          endFound = true
          endRow = currentRow
          // console.log("End found at row '" + endRow + "', column '" + charsUntilSelectionEnd + "': ")
        }

        if (startFound && endFound) {
          aceEditor.selection.setSelectionRange(new ace.Range(startRow, charsUntilSelectionStart, endRow, charsUntilSelectionEnd))
          break
        } else {
          currentRow++
          charsUntilSelectionStart -= row.length + 1
          charsUntilSelectionEnd -= row.length + 1
        }
      } 
    },
  },
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

#source {
font-size: 18px;
max-width: 700px;
overflow: auto;
font-family: "Lucida Console", Monaco, monospace;
white-space: nowrap;
}
.select {
background-color: #FCF9BB;
box-shadow: 0 0 1px black;
}

input[type=text] {
	width: 50%;
}

textarea {
	width: 50%;
	height: 500px;
}

.layout-wrapper {
  min-width: fit-content;
}

</style>
