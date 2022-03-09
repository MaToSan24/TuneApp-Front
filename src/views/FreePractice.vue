<template>

  <Topbar />

  <div class="homeWrapper">

    <div class="card col-7" style="width: auto; display: flex; justify-content: space-around; align-items: center; flex-direction: column">
      
      <div style="text-align-last: center;">
        <h1>Welcome to the <u>Free Practice</u> Mode!</h1>
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
    }
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
      let defaultContentString = `%abc-2.1
H:This file contains some example English tunes
% note that the comments (like this one) are to highlight usages
%  and would not normally be included in such detail
O:England             % the origin of all tunes is England
X:1                   % tune no 1
T:Dusty Miller, The   % title
T:Binny's Jig         % an alternative title
C:Trad.               % traditional
R:DH                  % double hornpipe
M:3/4                 % meter
K:G                   % key
%%MIDI program 32     % 32 = instrument code, defaults to 0
B>cd BAG|FA Ac BA|B>cd BAG|DG GB AG:|
Bdd gfg|aA Ac BA|Bdd gfa|gG GB AG:|
BG G/2G/2G BG|FA Ac BA|BG G/2G/2G BG|DG GB AG:|
W:Hey, the dusty miller, and his dusty coat;
W:He will win a shilling, or he spend a groat.
W:Dusty was the coat, dusty was the colour;
W:Dusty was the kiss, that I got frae the miller.`
      this.editorContent = defaultContentString
      this.$store.commit("updateFreePracticeEditor", defaultContentString)
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
