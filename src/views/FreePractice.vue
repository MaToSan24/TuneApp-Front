<template>

  <Topbar />

  <div class="homeWrapper">

    <div class="card col-7" style="display: flex; justify-content: space-around; align-items: center; flex-direction: column">
      
      <div style="text-align-last: center;">
        <h1>Welcome to the <u>Free Practice</u> Mode</h1>
        <img alt="TuneApp Logo" :src="TuneAppLogo" height="100" class="mt-5" />
      </div>

      <div class="col-9 mb-5" id="editorDiv">
        <v-ace-editor @change="rerender()" id="ace-editor" v-model:value="editorContent" lang="abc" theme="clouds" style="height: 300px;" />
      </div>

      <div class="my-3">
        <h2>Sound Font Options</h2>
        <p>Instructions: Reload the page, select the desired sound font and click the play button.</p>
        <div v-for="option in soundFontOptions" :key="option.url">
          <RadioButton :id="option.name" name="soundFontOption" :value="option.url" v-model="soundFontUrl" @change="rerender" />
          <label :for="option.name">{{option.name}}</label>
        </div>
      </div>

      <div class="abcjsDiv mt-5" >
        <textarea id="abc-source" v-model="editorContent" style="display: none"/>
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
import RadioButton from 'primevue/radiobutton';
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
  created: function () {
    this.soundFontUrl = this.soundFontOptions[0].url
  },
  mounted: function () {
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
    rerender() {
      let options = {}

      console.log("Setting soundfont: ", this.soundFontUrl)
      abcjs.midi.setSoundFont(this.soundFontUrl)

      abcjs.renderAbc("paper", this.editorContent, options);
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
