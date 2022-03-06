<template>

  <Topbar />

  <div class="homeWrapper">

    <div class="card col-7" style="display: flex; justify-content: space-around; align-items: center; flex-direction: column">
      
      <div style="text-align: center;">
        <h1>Ranking of users</h1>
      </div>

        <DataTable class="my-5" :value="users" sortMode="multiple" :multiSortMeta="[{field: 'rebuildTheSongScore', order: -1}, {field: 'perfectPitchScore', order: -1}]" responsiveLayout="scroll">
            <Column field="username" header="Username"></Column>
            <Column field="rebuildTheSongScore" header="Rebuild The Song Score" :sortable="true"></Column>
            <Column field="perfectPitchScore" header="Perfect Pitch Score" :sortable="true"></Column>
        </DataTable>

      <div style="display: flex; align-items: center;">
        <router-link to="/">
          <Button class="p-button-info">Home</Button>
        </router-link>
      </div>
    </div>

  </div>
</template>

<script>
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Topbar from '@/components/Topbar'
import axios from "axios";

export default {
  name: 'Home',
  components: {
    Button,
    Topbar,
    DataTable,
    Column,
  },
  data() {
    return {
      users: []
    }
  },
  mounted: function() {
      axios.get("/users")
      .then((response) => {
          this.users = response.data
      })
      .catch(function (error) {
        console.log("Error playing note: ", error);
      })
  },
  methods: {

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
