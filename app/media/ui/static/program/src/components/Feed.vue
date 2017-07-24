<template>
  <div class="pure-u">
    <div class="user-post">
      <div class="user-legend">
        <div class="user-img">
          <img :src="default_user_profile_pic" height="64" width="64"/>
          <span class="username">
            First name Surname
          </span>
        </div>
      </div>
      <div class="post-content pure-u-1-3">
        Here is something I found funny online:
        <img src="https://my.mixtape.moe/siuxun.jpg" class="pure-img" />
      </div>
      <div class="post-comment-thread pure-u-1-2">
        Comments:
        <div class="post-comment">
          Personally I found this offensive
        </div>
        <div class="post-comment">
          Lighten up, it's just a joke! This is seriously what people do online.
        </div>
        <div class="post-comment">
          I can't believe it.
        </div>
      </div>
    </div>
    <div class="user-post pure-u-1-2">
      <div class="user-legend">
        <div class="user-img">
         <img :src="default_user_profile_pic" height="64" width="64"/>
          <span class="username">
            First name Surname
          </span>
        </div>
      </div>
      <div class="post-content">
        <img src="https://my.mixtape.moe/hnwwqg.jpg" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'feed',
    data() {
        return {}
    }
}
</script>

<style scoped>
.user-legend, .user-post, .post-comment {
  border: 1px solid gray;
  border-radius: 2px;
  padding: 10px;
  }
  img {
  display: inline;
  }
  .post-content, .post-comment-thread {
  margin-top: 10px;
  }
</style>
