<script setup lang="ts">
import { onMounted, onUpdated, ref, type Ref } from "vue"
import * as MathLive from 'mathlive'
import '../../../node_modules/mathlive/dist/mathlive-fonts.css'

// https://cortexjs.io/mathlive/reference/commands/

import Codeblock from '@/components/Codeblock.vue'
import Article from '@/components/Article.vue'
import External from '@/components/External.vue'

const navItems = [
  { href: "/blog", label: "Back", classes: "mb-3" },
  {
    href: '#p1',
    label: 'What is PPO?',
  },
]

const staticmath = ref() as Ref<HTMLElement>

function renderStaticMath() {
  MathLive.renderMathInElement(staticmath.value)
}

onMounted(() => {
  renderStaticMath()
})


// TODO: only used during development
onUpdated(() => {
  renderStaticMath()
})


</script>

<template>
  <Article :items="navItems" id="top">

    <p class="text-3xl">Training PPO agents on RAM observations</p>

    <p>This post explores what proximal policy optimisation is, and my learning process when implementing it to train an
      agent to play the Atari game "breakout".</p>

    <p class="text-xl mt-8" id="p1">What is PPO?</p>

    <p>Proximal Policy Optimisation (PPO) falls under the family of Reinfocement Learning (RL) techniques that has gained
      significant attention in recent years. If you are familiar with other policy optimization methods, PPO offers
      improvements in sample efficiency, stability, and robustness in training deep neural networks for reinforcement
      learning tasks. A key feature of PPO is the clipped surrogate objective. This limit on the loss strike a balance
      between exploration and exploitation, and PPO has demonstrated remarkable performance across a wide range of complex
      environments, including robotics, game playing, and autonomous control systems.</p>

    <p>One important difference between PPO and other RL algorithms such as DQN is that PPO is learns online. i.e. it
      learns directly from whatever observations are provided by the environment as its agent performs actions.</p>

    <div class="flex justify-center text-xl" ref="staticmath">\[L^{PG}(\theta) = \hat{\Bbb{E}}\scriptstyle t \displaystyle
      \lbrack
      log \pi \scriptstyle \theta
      \displaystyle (a \scriptstyle t \displaystyle | s \scriptstyle t \displaystyle) \hat{A} \scriptstyle t \displaystyle
      \rbrack \]</div>

    <p>
      If you would like to learn more, the 2017 paper <External href="https://arxiv.org/pdf/1707.06347.pdf">Proximal
        Policy Optimization Algorithms</External> provides a good overview.
    </p>
    <p>

      <External href="https://arxiv.org/abs/1907.06704">PPO Dash: Improving Generalization in Deep Reinforcement Learning
      </External>
    </p>

    <Codeblock label="PPOArgs" language="python" :code="'PPOArgs()'" />

    <br />


  </Article>
</template>