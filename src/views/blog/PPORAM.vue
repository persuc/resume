<script setup lang="ts">
import Codeblock from '@/components/Codeblock.vue'
import Article from '@/components/Article.vue'
import External from '@/components/External.vue'
import Formula from '@/components/Formula.vue'

const navItems = [
  { href: "/blog", label: "Back", classes: "mb-3" },
  {
    href: '#what-is-ppo',
    label: 'What is PPO?',
  },
  {
    href: '#first-attempt',
    label: 'First Attempt',
  },
  {
    href: '#ppo-dash',
    label: 'PPO Dash',
  },
]

</script>

<template>
  <Article :items="navItems" id="top">

    <p class="text-3xl">Training PPO agents on RAM observations</p>

    <p>This post explores what proximal policy optimisation is, and my learning process when implementing it to train an
      agent to play the Atari game "breakout".</p>

    <p class="text-xl mt-8" id="what-is-ppo">What is PPO?</p>

    <p>Proximal Policy Optimisation (PPO) falls under the family of Reinfocement Learning (RL) techniques that has gained
      significant attention in recent years. If you are familiar with other policy optimization methods, PPO offers
      improvements in sample efficiency, stability, and robustness in training deep neural networks for reinforcement
      learning tasks. A key feature of PPO is the clipped surrogate objective. This limit on the loss strikes helps
      balance
      between exploration and exploitation, and PPO has demonstrated remarkable performance across a wide range of complex
      environments, including robotics, game playing, and autonomous control systems.</p>

    <p>One important difference between PPO and other RL algorithms such as DQN is that PPO is learns online. i.e. it
      learns directly from whatever observations are provided by the environment as its agent performs actions. This means
      that traning data is not used as efficiently, since it only sees each batch of data once. However, this is not a
      problem for a situation like an emulated game environment, since we can generate as many examples as needed and we
      and so we are not limited by available training data.</p>

    <p>A second difference is how the loss function is calculated. Here is a stereotypical RL loss function:</p>

    <Formula value="L^{PG}(\theta) = \hat{\Bbb{E}}_t
      \Bigl[
      log\, {\large \pi}_\theta
      \displaystyle (a_t\, |\, s_t) \hat{A}_{t}
      \Bigr]" />

    <p>What do the terms mean?</p>
    <p>This is equation is trying to express is that the loss can be calculated as the expectation (empirical average over
      batches of samples) of the log of what action policy
      <Formula value="{\large \pi}_\theta" :inline="true" /> takes in a given state,
      multiplied by
      <Formula value="A_t" :inline="true" /> - an estimator of how much better or wrose that particular action is compared
      to the policy's average performance.
    </p>

    <p>
      If you would like to learn more, the 2017 paper <External href="https://arxiv.org/pdf/1707.06347.pdf">Proximal
        Policy Optimization Algorithms</External> provides a good overview.
    </p>

    <p class="text-xl mt-8" id="first-attempt">First Attempt?</p>

    <p class="text-xl mt-8" id="ppo-dash">PPO Dash</p>

    <p>

      <External href="https://arxiv.org/abs/1907.06704">PPO Dash: Improving Generalization in Deep Reinforcement Learning
      </External>
    </p>

    <p>There are two key parameter tweaks outlined in this paper which help solve the problem with my previous methods.
      Firstly, the number of steps per batch should be higher, and secondly, the learning rate should be lower.</p>
    <p>
      The idea here is to both prevent the policy from falling into a local minimum caused by rare outsized returns, and
      also so that the policy can "lock on" to the sparse reward (see
      <External href="https://arxiv.org/abs/1808.04355">Large-Scale Study of Curiosity-Driven Learning</External>)
    </p>

    <Codeblock label="PPOArgs" language="python" :code="'PPOArgs()'" />

    <br />

    <p class="my-16 py-16"></p>


  </Article>
</template>