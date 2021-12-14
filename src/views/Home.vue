<template>

  <div>
    <div style="display: flex;flex-direction: column; align-content: center; justify-content: center; align-items: center;
                position: absolute; top: 1rem; right: 2rem;">

      <router-link to="/login">
        <Button class="p-button-info mt-5" style="width: 150%;">Login</Button>
      </router-link>
      <p>
        Don't have an account yet? <router-link to="/register">Register now</router-link>
      </p>

    </div>
  </div>

  <div class="homeWrapper">

    <div class="card col-7" style="display: flex; justify-content: space-around; align-items: center; flex-direction: column; height: 50rem">
      
      <div style="text-align-last: center;">
        <h1>Welcome to TuneApp</h1>
        <img alt="TuneApp Logo" :src="TuneAppLogo" height="100" class="mt-5" />
      </div>

      <div style="display: flex; flex-direction: column; align-items: center;">
        <router-link to="/rebuildSong">
          <Button class="p-button-info" @click="checkUserLoggedIn()">Rebuild the song</Button>
        </router-link>
        <router-link to="/freePractice">
          <Button class="p-button-info mt-5" @click="addPartner">Free practice</Button>
        </router-link>
        <router-link to="/perfectPitch">
          <Button class="p-button-info mt-5" @click="addPartner">Perfect pitch</Button>
        </router-link>
      </div>
    </div>
    
  </div>

</template>

<script>
import Button from 'primevue/button'
import TuneAppLogo from "@/assets/TuneAppLogoCropped.png"
// import axios from 'axios'

export default {
  name: 'Home',
  components: {
    Button,
  },
  data() {
    return {
      TuneAppLogo: TuneAppLogo
    }
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
