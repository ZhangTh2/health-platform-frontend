<template>
  <div class="app-container">
    <h1>{{this.name}}</h1>
  </div>
</template>

<script>
    export default {
      name: "apiList",
      created(){
        console.log("进入api界面")
        this.getParams()
      },
      data(){
        return{
          id:'',
          name:''
        }
      },
      methods:{
        getParams(){
          this.id=this.$route.params.id
          this.name=this.$route.params.name
        }
      },
      watch:{
        '$route': 'getParams'
      }

    }
</script>

<style scoped>

</style>
