<template>
    <div class="container">
        <div class="compass">
            <div class="directions">
                <div class="E">
                    <p>W</p>
                </div>
                <div class="W">
                    <p>E</p>
                </div>
                <div class="S">
                    <p>S</p>
                </div>
                <div class="N">
                    <p>N</p>
                </div>
            </div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="lines"></div>
            <div class="cover"></div>
            <div class="needle">
                <div class="main"></div>
                <div class="circle"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {

    }
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Patua+One');
.container,
.compass,
.directions,
.E,
.W,
.S,
.N,
.lines,
.cover,
.needle,
.main,
.circle{
    top:0;
    right:0;
    bottom:0;
    left:0;
    margin:auto;
    position:absolute;
}

.container{
    width:240px;
    height:240px;
    position:relative;
    transform:translateY(50px);
}
.compass{
    background-color:white;
    border:4px solid #2d3436;
    border-radius:50%;
    box-shadow: 0 3px 8px 0px rgba(255, 255, 255, .4);
}


.lines{
    width:3px;
    height:100%;
    background-color:#B6E3FC;
    // transform:translateX(-150%);
    z-index:0;
    &:nth-child(5n-4){
        width: 5px;
        background-color:#FF5252;
        // height: 90%;
    }
}



@for $i from 1 to 60{
    .lines:nth-child(#{$i}){
        transform: rotate(#{( 6 * $i) - 5}deg) 
    }
}

.directions{
    width:90%;
    height:90%;
    // background-color:red;
    border-radius:50%;
    text-align:center;
    font-size:25px;
    font-family: 'Patua One', cursive;
    color:#395060;
    z-index:2;
    .E{
        left:-85%;
        top:-40px;
        width:30px;
        height:30px;
    }
    .S{
        // left:-90%;
        top:50%;
        width:30px;
        height:30px;
    }
    .N{
        // left:-90%;
        top:-90%;
        width:30px;
        height:30px;
    }
    .W{
        left:80%;
        top:-35px;
        width:30px;
        height:30px;
    }
}

.needle{
    width:45%;
    height:45%;
    // background-color:black;
    transition:all 300ms;
    animation:rotate 1690ms alternate infinite;
    .main{
        width:60px;
        height:30px;
        background-color:#ff793f;
        transform: skew(60deg) scale(1.2);   
    }
    .circle{
        width:10px;
        height:10px;
        border-radius:50%;
        background-color:white;
        border:2px solid #30336b;
    }
}

.cover{
    background-color:white;
    width:90%;
    height:90%;
    border-radius:50%;
}

@keyframes rotate{
    0%{
        transform:rotate(100deg);
    }
    50%{
        transform:rotate(160deg);
    }
    100%{
        transform:rotate(130deg);
    }
}
</style>
