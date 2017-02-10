<template>
    <header>
        <auth-menu></auth-menu>
    </header>

<!-- ;) -->

    <main>
        <router-view></router-view>
    </main>
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
