<template>

  <Topbar />

  <div class="homeWrapper">

    <div class="card col-5" style="display: flex; justify-content: space-around; align-items: center; flex-direction: column">
      
      <div style="text-align-last: center;">
        <h1 v-if="$route.fullPath.includes('editSong')">Edit song</h1>
        <h1 v-if="!$route.fullPath.includes('editSong')">Add a song</h1>
      </div>

      <div class="p-fluid formgrid grid">

					<div class="field col-12 md:col-12">
						<label for="songName">Song Name</label>
            <InputText v-model="song.name" id="songName" name="songName" :class="{'p-invalid': submitted && errors.filter(e => e.field === 'name').length > 0}" />
            <small style="margin-top: 5px" class="p-error" v-for="error in errors.filter(e => submitted && e.field === 'name')" :key="error.message">{{error.message}}</small>
          </div>

          <div class="field col-12 md:col-12">
						<label for="solutionAudioFileName">Solution audio file name</label>
            <InputText v-model="song.solutionAudioFileName" id="solutionAudioFileName" name="solutionAudioFileName" :class="{'p-invalid': submitted && errors.filter(e => e.field === 'solutionAudioFileName').length > 0}" />
            <small style="margin-top: 5px" class="p-error" v-for="error in errors.filter(e => submitted && e.field === 'solutionAudioFileName')" :key="error.message">{{error.message}}</small>
          </div>

					<div class="field col-12 md:col-12">
						<label for="difficultyId">Difficulty ★</label>
            <Dropdown :options="difficultiesDropdown" v-model="song.difficulty" id="difficultyId" name="difficultyId" />
					</div>

					<div class="field col-12 md:col-12">
						<label for="musicSheetId">Music Sheet</label>
            <Textarea v-model="song.musicSheet" id="musicSheetId" name="musicSheetId" :autoResize="true" rows="5" cols="30"
            :class="{'p-invalid': submitted && errors.filter(e => e.field === 'musicSheet').length > 0}" />
            <small style="margin-top: 5px" class="p-error" v-for="error in errors.filter(e => submitted && e.field === 'musicSheet')" :key="error.message">{{error.message}}</small>
					</div>

          <div class="field col-12 md:col-12" style="display: flex; justify-content: space-around;">
            <div v-if="!this.$route.params.id" class="field col-12 md:col-4">
              <Button type="button" icon="pi pi-check" label="Create" class="p-button-info mt-4" @click="addSong()"/>
            </div>
            <div class="field col-12 md:col-4" v-else>
              <Button type="button" icon="pi pi-refresh" label="Update" class="p-button-info mt-4" @click="updateSong()"/>
            </div>
            <div class="field col-12 md:col-4">
              <router-link id="cancel" to="/rebuildSongList">
                <Button type="button" icon="pi pi-times" label="Back" class="p-button-secondary mt-4" />
              </router-link>
            </div>
          </div>
				</div>

    </div>

  </div>
</template>

<script>
import Textarea from 'primevue/textarea';
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Topbar from '@/components/Topbar'
import axios from 'axios'

export default {
  name: 'Home',
  components: {
    Textarea,
    InputText,
    Dropdown,
    Button,
    Topbar,
  },
  data() {
    return {
      song: {
        name: "",
        difficulty: 1,
        musicSheet: "",
      },
      difficultiesDropdown: [1, 2, 3, 4, 5],
      errors: [],
      submitted: false,
    }
  },
  created() {
    if (this.$route.params.id) {
      axios.get(`/songs/${this.$route.params.id}`, { params: {
        userId: this.$store.state.userId,
      }})
      .then((response) => {
        this.song = response.data;
      })
      .catch((e)=>{
        console.log('error' + e);
      })
    }
  },
  methods: {
    addSong() {
      this.submitted = true

      axios.post('/songs', this.song, { params: {
        userId: this.$store.state.userId,
      }})
      .then(() => {
        this.$router.push('/rebuildSongList')
      })
      .catch((error)=>{
        this.errors = error.response.data
      })
    },
    updateSong() {
      this.submitted = true
      axios.put('/songs/' + this.song._id, this.song, { params: {
        userId: this.$store.state.userId,
      }})
      .then(() => {
        this.$router.push({ path: `/rebuildSongList` })
      })
      .catch((error)=>{
        this.errors = error.response.data
      })
    }
  },
};
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
