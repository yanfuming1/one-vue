<template>
  <div>
    <fieldset>
        <legend><i class="leftLine"></i><span class="fontColor"><slot></slot></span></legend>
    </fieldset>
  </div>
</template>
<script>
  export default {
     name: "titleLine"
  }
</script>

<style lang="scss" scoped>
fieldset {
    display: block;
    margin-inline-start: 2px;
    margin-inline-end: 2px;
    padding-block-start: 0.35em;
    padding-inline-start: 0.75em;
    padding-inline-end: 0.75em;
    padding-block-end: 0.625em;
    min-inline-size: min-content;
    border-width: 1px;
    border-style: solid;
    border-image: initial;
    border-bottom: 0;
    border-left: 0;
    border-right: 0;
}
legend {
    display: block;
    margin-left: 10px;
    padding-inline-start: 12px;
    padding-inline-end: 12px;
    border-width: initial;
    border-style: none;
    border-color: initial;
    border-image: initial;
}
.fontColor {
    color: #346fff;
    font-size: 14px;
}
.leftLine {
    border-left: 3px solid #346fff;
    padding-right: 15px;
  }
</style>