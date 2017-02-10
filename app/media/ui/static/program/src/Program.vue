<template>
    <header>
        <auth-menu></auth-menu>
    </header>


    <div id="program">
        <!-- <img src="./assets/logo.png"> -->
        <router-view></router-view>
    </div>
  </template>

<script>
 export default {
     name: 'program'
 }
</script>

<style>
 #program {
     font-family: 'Avenir', Helvetica, Arial, sans-serif;
     -webkit-font-smoothing: antialiased;
     text-align: center;
     color: #2c3e50;
     margin-top: 60px;
 }
</style>
