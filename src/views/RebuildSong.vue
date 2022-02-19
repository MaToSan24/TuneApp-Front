<template>

  <Topbar />

  <div class="homeWrapper">

    <div class="card col-7" style="display: flex; justify-content: space-around; align-items: center; flex-direction: column">
      
      <div style="text-align-last: center;">
        <h1>Welcome to the <u>Rebuild the Song</u> Mode</h1>
        <img alt="TuneApp Logo" :src="TuneAppLogo" height="100" class="mt-5" />
      </div>

      <div class="col-9" id="editorDiv">
        <v-ace-editor id="ace-editor" v-model:value="editorContent" lang="abc" theme="clouds" style="height: 300px;" :placeholder="editorPlaceholder"/>
      </div>

      <div class="abcjsDiv">
        <textarea id="abc-source" v-model="editorContent"></textarea>
        <div class="listener-output">
          <div class="label">Currently Playing: <span class="abc-string">{{currentAbcFragment}}</span></div>

          <div class="label">Parameters sent to listener callback: </div>
          <div>Progress: {{progress.progress }}</div>
          <div>Current Time: {{progress.currentTime }}</div>
          <div>Total Duration: {{progress.duration }}</div>
          <div>New Beat? {{progress.newBeat }}</div>
        </div>
        <div id="midi"></div>
        <div id="paper"></div>
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
import TuneAppLogo from "@/assets/TuneAppLogoCropped.png"
import Topbar from '@/components/Topbar'
import { VAceEditor } from 'vue3-ace-editor';
import 'ace-builds/webpack-resolver';
import "font-awesome/css/font-awesome.min.css";
import 'abcjs/abcjs-midi.css';
import abcjs from "abcjs/midi";

export default {
  name: 'Home',
  components: {
    Button,
    Topbar,
    VAceEditor,
  },
  data() {
    return {
      TuneAppLogo: TuneAppLogo,
      editorPlaceholder: "Input some alda code!",
      progress: { },
      currentAbcFragment: "(none)",
      tune: 'X:1\nT: Cooley\'s\nM: 4/4\nL: 1/8\nR: reel\nK: Emin\nD2|:"Em"EB{c}BA B2 EB|~B2 AB dBAG|"D"FDAD BDAD|FDAD dAFD|\n"Em"EBBA B2 EB|B2 AB defg|"D"afe^c dBAF|1"Em"DEFD E2 D2:|2"Em"DEFD E2 gf||\n|:"Em"eB B2 efge|eB B2 gedB|"D"A2 FA DAFA|A2 FA defg|\n"Em"eB B2 eBgB|eB B2 defg|"D"afe^c dBAF|1"Em"DEFD E2 gf:|2"Em"DEFD E4|]\n',
      editorContent: `%abc-2.1
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
B>cd BAG|FA Ac BA|B>cd BAG|DG GB AG:|
Bdd gfg|aA Ac BA|Bdd gfa|gG GB AG:|
BG G/2G/2G BG|FA Ac BA|BG G/2G/2G BG|DG GB AG:|
W:Hey, the dusty miller, and his dusty coat;
W:He will win a shilling, or he spend a groat.
W:Dusty was the coat, dusty was the colour;
W:Dusty was the kiss, that I got frae the miller.`,
    }
  },
  mounted: function () {
    abcjs.renderAbc("paper", this.editorContent, {});
    new abcjs.Editor("abc-source", {
      canvas_id: "paper",
      generate_midi: true,
      midi_id: "midi",
      abcjsParams: {
        midiListener: this.listener,
        animate: {
          listener: this.animate,
        }
      }
    });
  },
  methods: {
    listener(midiControl,progress) {
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
  },
  computed: {
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

</style>
