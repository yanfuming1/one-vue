<template>
    <div class="container">
        <div class="loading"></div>
    </div>
</template>

<script>
export default {
    name: 'loading',
    data () {
        return {
        }
    },

    methods: {},
}
</script>

<style lang='scss' scoped>
.container {
    background: $color-bg5;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0px;
    z-index: 9102;
    .loading {
        position: relative;
        width: 2em;
        height: 2em;
        border: 3px solid #ff316f;
        overflow: hidden;
        left: calc(50% - 38px);
        top: calc(50% - 38px);
        animation: spin 3s ease infinite;
    }

    .loading::before {
        content: '';
        position: absolute;
        top: -3px;
        left: -3px;
        width: 2em;
        height: 2em;
        background-color: hsla(185, 100%, 62%, 0.75);
        transform-origin: center bottom;
        transform: scaleY(1);
        animation: fill 3s linear infinite;
    }

    @keyframes spin {
        50%,
        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes fill {
        25%,
        50% {
            transform: scaleY(0);
        }
        100% {
            transform: scaleY(1);
        }
    }
}
</style>
