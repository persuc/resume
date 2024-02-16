<script setup lang="ts">
import Codeblock from '@/components/Codeblock.vue'
import Article from '@/components/Article.vue'
import External from '@/components/External.vue'
import Formula from '@/components/Formula.vue'
import SvgBehindImage from '@/components/SvgBehindImage.vue'
import VideoBlock from '@/components/VideoBlock.vue'

import example from '@/assets/ppo-ram/example_game.mp4'
import localMinimum from '@/assets/ppo-ram/memory-1/local_minimum.mp4'
import Expand from '@/components/Expand.vue'


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
    href: '#troubleshooting',
    label: 'Troubleshooting',
  },
  {
    href: '#ppo-dash',
    label: 'PPO Dash',
  },
]

const charts = ['value-loss', 'ep-return', 'ep-len'] as const

function getChart(run: string) {
  return charts.map(c => ({
    svg: `ppo-ram/${run}/${c}-axes`,
    image: `ppo-ram/${run}/${c}.png`,
  }))
}

// https://wandb.ai/persic/PPOMemory/runs/hsrt8q88
const memory1 = getChart('memory-1')

// https://wandb.ai/persic/PPOMemory/runs/sjtxeoh2/
const memory2 = getChart('memory-2')

const pixel = getChart('pixel')

const ramValues = {
  blocks: "6..30",
  lives: "57",
  paddle_from_right: "70",
  paddle_from_left: "72",
  ball_x: "99",
  ball_y: "101",
  ball_y_speed: "103",
  ball_x_speed: "105",
}

function saveWandBCanvas(name) {
  const canvas = document.querySelector(".fullscreen-mode.content canvas")
  var newWindow = window.open()
  newWindow.document.write(`<img src="${canvas.toDataURL('image/png')}" />`)

  const svg = document.querySelector(".fullscreen-mode.content svg").outerHTML.replace(/width="([0-9]+)" height="([0-9]+)"/, "viewBox=\"0 0 $1 $2\"")

  // need to set stroke="#E6E6E9" fill="none" stroke-width="2px" on rv-xy-plot__axis--vertical > line and rv-xy-plot__axis--horizontal

  var svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" })
  var svgUrl = URL.createObjectURL(svgBlob)
  var downloadLink = document.createElement("a")
  downloadLink.href = svgUrl
  downloadLink.download = `${name}-axes.svg`
  // const actions = document.querySelector(".fullscreen .actions")
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
}

</script>

<template>
  <Article :items="navItems" id="top">

    <p class="text-3xl">Training PPO agents on RAM observations</p>

    <p>This post explores what proximal policy optimisation is, and my learning process when implementing it to train an
      agent to play the Atari game Breakout.</p>

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

    <p class="text-xl mt-8" id="first-attempt">First Attempt</p>

    <p>My first attempt at training on RAM ended in the model falling into a trap early in training that it was never able
      to recover from. Here are the charts:</p>

    <SvgBehindImage class="w-full" v-for="chart in memory1" :key="chart.image" :image="chart.image" :svg="chart.svg" />

    <!-- <iframe
      src="https://wandb.ai/persic/PPOMemory/reports/Training-PPO-Agent-on-Breakout-RAM-Attempt-1--Vmlldzo2ODMzNzkw"
      style="border:none;height:1024px;width:100%"></iframe> -->

    <p>Compare this to a training run where the actor and critic used a shared convolutional archiecture instead, and
      were given observations in the form of pixel data:</p>

    <SvgBehindImage class="w-full" v-for="chart in pixel" :key="chart.image" :image="chart.image" :svg="chart.svg" />

    <p>Notice that the RAM agent's charts are very flat, a sure indicator that the model is struggling. The RAM agent and
      the pixel agent actually performed quite similarly until around 50,000 steps through training,at which point the
      pixel agent learned to extract the features it needed (ball x position, paddle x position, etc.) However the RAM
      agent doesn't
      even have to perform feature extraction, it just needs to look at the relevant integers in the RAM and do a very
      simple linear transformation, so why is it struggling?</p>

    <p>Have a look at how the agent plays, and see if you can identify why the model was able to improve to an average
      score of 4-5 points, but no further.</p>

    <!-- <iframe src="https://wandb.ai/persic/PPOPixels/reports/Training-PPO-Agent-on-Breakout-Pixels--Vmlldzo2ODMzODMz"
      style="border:none;height:1024px;width:100%"></iframe> -->

    <VideoBlock :src="localMinimum" />

    <p>You may have noticed that the agent is playing in a very "deterministic" way. It simply keeps the paddle on the
      left side of the screen, which every now and then will catch the ball in a very profitable cycle of 3-4 bounces,
      before it inevitably ends up somewhere other than the left corner of the screen and the agent gives up trying to hit
      it.
    </p>

    <p>This is an example of the model falling into a "local minimum" &#x2012; a strategy which is vastly better than
      anything else the model has tried so far, but ultimately not very close to the optimal policy. This problem is
      particularly treacherous in this circumstance, because the suboptimal strategy has a low probability of working, but
      when it dose work it produces a ver high reward (not just one point, but 3-4 points) giving it a very large effect
      on the weights, and trapping the model in this suboptimal pattern.</p>

    <p class="text-xl mt-8" id="troubleshooting">Troubleshooting</p>

    <p>The first thing I tried was narrowing the observation space to just the
      relevant variables. The idea is that if the model is more easily able to identify the really key information (the
      ball and paddle x positions) then it might learn to move the paddle underneath the ball immediately and avoid other,
      suboptimal patterns.
    </p>

    <p>I was skeptical that this would work, but it was the first thing I wanted to try.</p>

    <p>The reason for my pessimism is that the Atari only uses 128 bytes of RAM to store the state of Breakout,
      (represented to the model
      as 128 <code class="bg-gray-100 py-0.5 px-1 rounded-md">uint8</code> values) so my simple archiecture with 64
      neurons in its hidden dimension should be more than capable of
      pulling out the useful values.
    </p>

    <p>Despite these concerns, I wrote a simple visualiser for the Breakout RAM so I could
      manually identify the useful variables and pass them explicitly to the model. Watch the
      video below and see if you can work out what each memory address represents
      in the game!</p>

    <VideoBlock :src="example">Model performance after 248835 training steps</VideoBlock>

    <p>
      I've highlighted the relevant parts of the memory in blue. From my observations, here are the what each highlighted
      address represents:
    </p>


    <div class="flex justify-center my-4">
      <Expand label="Show hidden answers" expanded-label="Locations of important values">
        <div class="grid grid-cols-2 gap-x-12 gap-y-2 text-lg">
          <template v-for="k, v in ramValues" :key="`ramvalue-${k}`">
            <div class="font-medium">{{ v }}</div>
            <div class="font-mono">{{ k }}</div>
          </template>
        </div>
      </Expand>
    </div>

    <p>Let's see if this helps the model avoid suboptimal strategies and get straight to the rosetta stone: <code
        class="bg-gray-100 py-0.5 px-1 rounded-md">paddle.x = ball.x</code></p>

    <SvgBehindImage class="w-full" v-for="chart in memory2" :key="chart.image" :image="chart.image" :svg="chart.svg" />

    <p>Unfortunately, even after this modification as well as many more training runs tweaking hyperparameters, the model
      is still stuck playing in the corner. Time to dive into some papers and see if I could find some secret sauce!</p>

    <p class="text-xl mt-8" id="ppo-dash">PPO Dash</p>
    <p>
      <External href="https://arxiv.org/abs/1907.06704">PPO Dash: Improving Generalization in Deep Reinforcement
        Learning
      </External>
    </p>

    <p>There are two key parameter tweaks outlined in this paper which help solve the problem with my previous methods.
      Firstly, the number of steps per batch should be higher, and secondly, the learning rate should be lower.</p>
    <p>
      The idea here is to both prevent the policy from falling into a local minimum caused by rare outsized returns, and
      also so that the policy can "lock on" to the sparse reward (see
      <External href="https://arxiv.org/abs/1808.04355">Large-Scale Study of Curiosity-Driven Learning</External>)
    </p>

    <External href="https://iclr-blog-track.github.io/2022/03/25/ppo-implementation-details/">The 37 Implementation
      Details of Proximal Policy Optimization</External>

    <External href="https://openreview.net/pdf?id=nIAxjsniDzg">What Matters For On Policy Deep Actor
      Critic Methods? A Large Scale Study</External>

    <Codeblock label="PPOArgs" language="python" :code="'PPOArgs()'" />

    <br />

    <p class="my-16 py-16"></p>


  </Article>
</template>