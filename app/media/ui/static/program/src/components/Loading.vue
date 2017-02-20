<template>
    <div class="loading-container">
    	  <div class="spinning-whirlpool"></div>
        <label>{{message}}</label>
    </div>
</template>

<script>
export default {
    data() {
        return {
            message: "Loading…"
        }
    }
}
</script>

<style scoped>
.loading-container {
    position: absolute;
    z-index: 1000;
    top: 50%;
    left: 45%;
    height: 12rem;
    width: 10rem;
    background-color: #E4F1FE;
    border: 2px solid rgba(197, 239, 247, .75);
    border-radius: 5px / 7px;
    font-size: 1.2rem;
    text-align: center;
    letter-spacing: normal;
    color: #3591cf;
}
.loading-container label {
    display: block;
    margin-top: 10rem;
}

.spinning-whirlpool,
.spinning-whirlpool::before,
.spinning-whirlpool::after {
    z-index: 1100;
	  position: absolute;
	  top: 50%;
	  left: 50%;
	  border: 2px solid rgba(204,204,204,0.19);
	  border-left-color: rgb(0,153,255);
	  border-radius: 1499px;
		-o-border-radius: 1499px;
		-ms-border-radius: 1499px;
		-webkit-border-radius: 1499px;
		-moz-border-radius: 1499px;
}

.spinning-whirlpool {
	  margin: -38px 0 0 -38px;
	  height: 75px;
	  width: 75px;
	  animation: cssload-rotate 1400ms linear infinite;
		-o-animation: cssload-rotate 1400ms linear infinite;
		-ms-animation: cssload-rotate 1400ms linear infinite;
		-webkit-animation: cssload-rotate 1400ms linear infinite;
		-moz-animation: cssload-rotate 1400ms linear infinite;
}

.spinning-whirlpool::before {
	  content: "";
	  margin: -35px 0 0 -35px;
	  height: 66px;
	  width: 66px;
	  animation: cssload-rotate 1700ms linear infinite;
		-o-animation: cssload-rotate 1700ms linear infinite;
		-ms-animation: cssload-rotate 1700ms linear infinite;
		-webkit-animation: cssload-rotate 1700ms linear infinite;
		-moz-animation: cssload-rotate 1700ms linear infinite;
}

.spinning-whirlpool::after {
	  content: "";
	  margin: -44px 0 0 -44px;
	  height: 84px;
	  width: 84px;
	  animation: cssload-rotate 2017ms linear infinite;
		-o-animation: cssload-rotate 2017ms linear infinite;
		-ms-animation: cssload-rotate 2017ms linear infinite;
		-webkit-animation: cssload-rotate 2017ms linear infinite;
		-moz-animation: cssload-rotate 2017ms linear infinite;
}



@keyframes cssload-rotate {
	  100% {
		    transform: rotate(360deg);
	  }
}

@-o-keyframes cssload-rotate {
	  100% {
		    -o-transform: rotate(360deg);
	  }
}

@-ms-keyframes cssload-rotate {
	  100% {
		    -ms-transform: rotate(360deg);
	  }
}

@-webkit-keyframes cssload-rotate {
	  100% {
		    -webkit-transform: rotate(360deg);
	  }
}

@-moz-keyframes cssload-rotate {
	  100% {
		    -moz-transform: rotate(360deg);
	  }
}
</style>
