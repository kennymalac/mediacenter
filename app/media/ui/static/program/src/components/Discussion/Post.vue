<template>
    <div class="post">
        <div class="post-header">
            <div class="author">
                <div class="profile-pic">
                    <img src="https://c1.staticflickr.com/5/4101/4870567608_69fbf87121_b.jpg" />
                </div>

                <div class="author-details">
                    <span class="display-name">Kenster</span>
                    <span class="post-count">Posts: 370</span>
                </div>
            </div>
            <div class="post-details">
                <span class="title">{{ content_item.title }}</span>
                <span class="date">{{ content_item.created.format('LLLL') }}</span>
            </div>
        </div>
        <p class="text">{{ text }}</p>
    </div>
</template>

<script>
export default {
    props: {
        content_item: {
            type: Object
        },
        text: {
            type: String
        }
    }
}
</script>

<style lang="scss">
.post {
    min-width: 600px;
    margin: 10px 0;
    background: linear-gradient(135deg, white, rgb(236, 240, 241));
    border: 1px solid black;
    text-align: left;
    .date {
        color: grey;
    }
    
    .post-header {
        padding: 5px 10px;
        display: flex;
        flex-direction: row;
        
        .author {
            justify-content: center;
            display: flex;
            width: 45%;
            
            .profile-pic {
                display: inline-flex;
                width: 64px;
                height: 64px;
                img {
                    height: 100%;
                    border-radius: 50%;
                    width: 100%;
                }
                border-radius: 50%;
                background-color: white;
            }
            .author-details {
                padding-left: 10px;
                min-width: 200px;
                display: flex;
                align-items: left;
                flex-direction: column;
            }
        }
        .post-details {
            display: flex;
            align-items: left;
            flex-direction: column;
        }
        color: white;
        background: linear-gradient(180deg, #001f3f, rgba(52, 73, 94,1.0));
    }
    p.text {
        padding: 10px 20px;
    }        
}
</style>
