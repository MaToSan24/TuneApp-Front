<template>

  <Topbar />
  <Toast position="bottom-right"/>

  <div class="homeWrapper">

    <div class="card col-7" style="display: flex; justify-content: space-around; align-items: center; flex-direction: column">
      
      <h1>Song list</h1>

      <DataTable :value="songList" :paginator="true" class="p-datatable-gridlines" dataKey="_id"
      :rowHover="true" sortMode="multiple" :rows="5" :loading="loading" responsiveLayout="scroll"
      @page="currentPageSongsTable = $event.page">
        
        <template #header v-if="isCurrentUserAdmin == true">
            <div class="flex justify-content-between flex-column sm:flex-row">
              <div>
                <router-link to="/addSong">
                  <Button class="p-button-info"><i class="pi pi-plus mr-2"/>Add a new song</Button>
                </router-link>
              </div>
            </div>
        </template>

        <template #empty>
            No songs found.
        </template>

        <template #loading>
            Loading songs. Please wait.
        </template>

        <Column field="name" header="Name" :sortable="true" />
        <Column field="difficulty" header="Difficulty" :sortable="true" />
        <Column field="musicSheet" header="Music sheet" :sortable="true" v-if="isCurrentUserAdmin == true">
          <template #body="slotProps">
            {{slotProps.data[slotProps.field].substring(0, 400)}}{{slotProps.data[slotProps.field].length > 400 ? " (song continues...)" : ""}}
          </template>
        </Column>
        <Column field="actions" header="Actions">
          <template #body="slotProps">
            <router-link :to="'/rebuildSong/' + (slotProps.data._id)">
              <i class="pi pi-arrow-circle-right mr-3" />
            </router-link>
            <router-link v-if="isCurrentUserAdmin == true" :to="'/editSong/' + (slotProps.data._id)">
              <i class="pi pi-pencil mr-3" />
            </router-link>
            <router-link v-if="isCurrentUserAdmin == true" to="/rebuildSongList">
              <i class="pi pi-trash" @click="confirmDeleteSong(slotProps.data)" />
            </router-link>
          </template>
        </Column>
      
      </DataTable>

      <Dialog v-model:visible="deleteSongDialog" header="Confirm" :modal="true">
        <div class="flex align-items-center justify-content-center">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="songToDelete">Are you sure you want to delete the song: <b>{{songToDelete.name}}</b>?</span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteSongDialog = false"/>
          <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSong" />
        </template>
      </Dialog>

      <div class="my-5" style="display: flex; flex-direction: column; align-items: center;">
        <router-link to="/">
          <Button class="p-button-info">Home</Button>
        </router-link>
      </div>
    </div>

  </div>
</template>

<script>
import Button from 'primevue/button'
import Topbar from '@/components/Topbar'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Toast from 'primevue/toast'
import Dialog from 'primevue/dialog'
import axios from 'axios'

export default {
  name: 'Home',
  components: {
    Button,
    Topbar,
    DataTable,
    Column,
    Toast,
    Dialog
  },
  data() {
    return {
      songList: [],
      loading: false,
      currentPageSongsTable: 0,
      deleteSongDialog: false,
      isCurrentUserAdmin: false
    }
  },
  mounted() {
    axios.get("/songs", {params: {
      userId: this.$store.state.userId
    }})
    .then((respose) => {
      this.songList = respose.data
    })

    axios.get("/users/isAdmin", { params: {
      userId: this.$store.state.userId
    }})
    .then((res) => {
      this.isCurrentUserAdmin = res.data
    })
  },
  methods: {
    confirmDeleteSong(song) {
      this.songToDelete = song
      this.deleteSongDialog = true;
    },
    deleteSong() {
      axios.delete('/songs/' + this.songToDelete._id, {params: {
        userId: this.$store.state.userId
      }})
      .then(() => {
        this.songList.splice(this.songList.indexOf(this.songToDelete), 1)
        this.deleteSongDialog = false
        this.$toast.add({severity:'success', summary: 'Successful', detail: 'Song deleted', life: 3000});
      })
      .catch((e)=>{
        console.log('error' + e);
      })
    },
  },
  computed: {
  }  
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
