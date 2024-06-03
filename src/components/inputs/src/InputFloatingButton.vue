<script lang="ts" setup>
import type { PropType } from 'vue'
import { ref } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  type: {
    type: String as PropType<'primary' | 'success' | 'alert' | 'progress' | 'disabled'>,
    default: 'primary'
  },
  subButtons: {
    type: Array<{
      icon: string
      color: string
      text: string
    }>,
    default: []
  }
})

const emit = defineEmits<{
  (e: 'onSubClick', id: number): void
  (e: 'onClick'): void
}>()

const isExpanded = ref(false)

const onClick = () => {
  if (props.subButtons.length > 0) {
    isExpanded.value = !isExpanded.value
  } else {
    emit('onClick')
  }
}

const onSubClick = (id: number) => {
  emit('onSubClick', id)
  isExpanded.value = false
}
</script>

<template>
  <div class="input-floating-button disabled-selection">
    <div v-if="isExpanded">
      <div
        v-for="(item, index) in subButtons"
        :key="index"
        class="sub-button-container"
        :class="isExpanded ? 'shown' : ''"
        @click="onSubClick(index)"
      >
        <span class="label">{{ item.text }}</span>
        <div class="sub-button" :style="{ 'background-color': item.color }">
          <i class="icon" :class="item.icon"></i>
        </div>
      </div>
    </div>

    <div class="main-button" :class="type" @click="onClick">
      <i class="icon" :class="icon"></i>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';

.input-floating-button {
  position: fixed;
  bottom: $floating-button-position;
  right: $floating-button-position;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: $component-margin;
  .main-button {
    width: $floating-button-size;
    height: $floating-button-size;
    padding: $section-margin;
    color: $white;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    cursor: pointer;
    &.primary {
      background: linear-gradient($primary-color, $orange);
    }
    &.success {
      background: linear-gradient($green, $dark-green);
    }
    &.alert {
      background: linear-gradient($orange, $red);
    }
    &.progress {
      background: linear-gradient($blue, $indigo);
    }
    &.disabled {
      background: linear-gradient($disabled-text-color, $text-color);
    }
    // .icon {
    //   font-size: $floating-button-size;
    // }
    &:hover {
      box-shadow: $hover-box-shadow;
      .icon {
        animation: shake 0.2s;
      }
    }
  }
  .sub-button-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: $component-margin;
    visibility: hidden;
    opacity: 0;
    transition: $transition;
    border-radius: $border-radius;
    background-color: $white;
    box-shadow: $box-shadow;
    padding: $component-margin;
    cursor: pointer;
    height: 0;
    &.shown {
      visibility: visible;
      opacity: 1;
      transition: $transition;
      height: auto;
      &:hover {
        box-shadow: $hover-box-shadow;
        background-color: $background-color;
        transition: $transition;
        .sub-button {
          box-shadow: $hover-box-shadow;
          .icon {
            animation: shake 0.2s;
          }
        }
      }
    }
    .label {
      font-size: $font-size-sm;
      font-weight: $font-weight-bold;
    }
    .sub-button {
      border-radius: 50%;
      color: $white;
      width: $floating-sub-button-size;
      height: $floating-sub-button-size;
      padding: $component-margin;
      box-shadow: $box-shadow;
      display: flex;
      justify-content: center;
      align-items: center;
      .icon {
        font-size: $floating-sub-button-size;
      }
    }
  }
  @keyframes shake {
    0% {
      transform: translate(1px, 1px) rotate(0deg);
    }
    10% {
      transform: translate(-1px, -2px) rotate(-1deg);
    }
    20% {
      transform: translate(-3px, 0px) rotate(1deg);
    }
    30% {
      transform: translate(3px, 2px) rotate(0deg);
    }
    40% {
      transform: translate(1px, -1px) rotate(1deg);
    }
    50% {
      transform: translate(-1px, 2px) rotate(-1deg);
    }
    60% {
      transform: translate(-3px, 1px) rotate(0deg);
    }
    70% {
      transform: translate(3px, 1px) rotate(-1deg);
    }
    80% {
      transform: translate(-1px, -1px) rotate(1deg);
    }
    90% {
      transform: translate(1px, 2px) rotate(0deg);
    }
    100% {
      transform: translate(1px, -2px) rotate(-1deg);
    }
  }
}
</style>
