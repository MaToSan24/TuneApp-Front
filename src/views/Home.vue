<template>
  <Topbar />

  <div class="homeWrapper">

    <div class="card col-7" style="display: flex; justify-content: space-around; align-items: center; flex-direction: column; height: 50rem">
      
      <div style="text-align-last: center;">
        <h1>Welcome to TuneApp</h1>
        <img alt="TuneApp Logo" :src="TuneAppLogo" height="100" class="mt-5" />
      </div>

      <div style="display: flex; flex-direction: column; align-items: center;">
        <router-link to="/rebuildSong">
          <Button class="p-button-info">Rebuild the song</Button>
        </router-link>
        <router-link to="/freePractice">
          <Button class="p-button-info mt-5">Free practice</Button>
        </router-link>
        <router-link to="/perfectPitch">
          <Button class="p-button-info mt-5">Perfect pitch</Button>
        </router-link>
        <router-link to="/ranking">
          <Button class="p-button-info mt-5">Ranking</Button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Button from 'primevue/button'
import TuneAppLogo from "@/assets/TuneAppLogoCropped.png"
import Topbar from '@/components/Topbar'

export default {
  name: 'Home',
  components: {
    Button,
    Topbar,
  },
  data() {
    return {
      TuneAppLogo: TuneAppLogo
    }
  },
  methods: {
  },
  computed: {
  }  
}
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

</style>
