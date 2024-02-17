<script setup lang="ts">
import Codeblock from '@/components/Codeblock.vue'
import Note from '@/components/Note.vue'
import Article from '@/components/Article.vue'
import External from '@/components/External.vue'
import Formula from '@/components/Formula.vue'
import SvgBehindImage from '@/components/SvgBehindImage.vue'
import VideoBlock from '@/components/VideoBlock.vue'

import example from '@/assets/ppo-ram/example_game.mp4'
import disappearingBall from '@/assets/ppo-ram/disappearing_ball.mp4'
import localMinimum from '@/assets/ppo-ram/memory-1/local_minimum.mp4'
import pixelVideo from '@/assets/ppo-ram/pixel/example.mp4'
import Expand from '@/components/Expand.vue'

const navItems = [
  "back",
  {
    href: '#what-is-ppo',
    label: 'What is PPO?',
  },
  {
    href: '#first-attempt',
    label: 'First Attempt',
  },
  {
    href: '#obs',
    label: 'Troubleshooting: Observation Space',
  },
  {
    href: '#tuning',
    label: 'Troubleshooting: Tuning Hyperparameters',
  },
  {
    href: '#manipulation',
    label: 'Troubleshooting: Memory Manipulation',
  },
  {
    href: '#seed',
    label: 'Troubleshooting: Randomness',
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
    title: {
      'value-loss': 'Value Loss',
      'ep-return': 'Score',
      'ep-len': 'Game Length',
    }[c]
  }))
}

// https://wandb.ai/persic/PPOMemory/runs/hsrt8q88
const memory1 = getChart('memory-1')

// https://wandb.ai/persic/PPOMemory/runs/sjtxeoh2/
const memory2 = getChart('memory-2')

const pixel = getChart('pixel')

const ppodash = getChart('ppo-dash')

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
      agent to play the Atari game Breakout using an <External
        href="https://www.gymlibrary.dev/environments/atari/breakout/">emulated environment</External>.</p>

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

    <div class="flex flex-col w-fit mx-auto">
      <SvgBehindImage class="w-full" v-for="chart in memory1" :key="chart.image" :image="chart.image" :svg="chart.svg">
        :svg="chart.svg">
        <span class="font-medium pl-2">{{ chart.title }}</span>
      </SvgBehindImage>
    </div>

    <p>Compare this to a training run where the actor and critic used a shared convolutional archiecture instead, and
      were given observations in the form of pixel data:</p>

    <div class="flex flex-col w-fit mx-auto">
      <SvgBehindImage class="w-full" v-for="chart in pixel" :key="chart.image" :image="chart.image" :svg="chart.svg">
        :svg="chart.svg">
        <span class="font-medium pl-2">{{ chart.title }}</span>
      </SvgBehindImage>
    </div>

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

    <p class="text-xl mt-8" id="obs">Troubleshooting: Reducing Observation Space</p>

    <p>The first thing I tried was narrowing the observation space to just the
      relevant variables. The idea is that if the model is more easily able to identify the really key information (the
      ball and paddle x positions) then it might learn to move the paddle underneath the ball immediately and avoid other,
      suboptimal patterns.
    </p>

    <p>I was skeptical that this would work, but it was the first thing I wanted to try.</p>

    <p>The reason for my pessimism is that the Atari only uses 128 bytes of RAM to store the state of Breakout,
      (represented to the model
      as 128 <code class="inline-code">uint8</code> values) so my simple archiecture with 64
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

    <div class="flex flex-col w-fit mx-auto">
      <SvgBehindImage class="w-full md:w-[32rem]" v-for="chart in memory2" :key="chart.image" :image="chart.image"
        :svg="chart.svg">
        <span class="font-medium pl-2">{{ chart.title }}</span>
      </SvgBehindImage>
    </div>

    <p>Unfortunately, even after this modification as well as many more training runs tweaking hyperparameters, the model
      is still stuck playing in the corner. Time to dive into some papers and see if I could find some secret sauce!</p>

    <p class="text-xl mt-8" id="tuning">PPO Dash</p>

    <p>
      <External href="https://arxiv.org/abs/1907.06704">PPO Dash: Improving Generalization in Deep Reinforcement
        Learning
      </External> is a paper that outlines various strategies for optimising the training of PPO agents on much more
      complex environments than Breakout (albeit on pixel data, not RAM). I found a few useful insights from the authors.
    </p>

    <p>There are two key parameter tweaks outlined in this paper which help solve the problem of falling into a local
      minimum due to suboptimal valleys of high reward. Firstly, the number of steps per batch should be higher, and
      secondly, the learning rate should be lower.</p>
    <p>
      The idea here is to both prevent the policy from falling into a local minimum caused by rare outsized returns by
      making these anomalies count for a smaller part of the data in each batch, and also to learn slower so that batches
      with outsized returns cause less dramatic changes in the gradients.
    </p>

    <Note>
      Note: there is also some evidence that these changes help the policy "lock on" to sparse rewards (see
      <External href="https://arxiv.org/abs/1808.04355">Large-Scale Study of Curiosity-Driven Learning</External>)
    </Note>

    <p>
      Other resources I found that were useful in tuning hyperparameters include: <External
        href="https://iclr-blog-track.github.io/2022/03/25/ppo-implementation-details/">The 37 Implementation
        Details of Proximal Policy Optimization</External> and <External href="https://openreview.net/pdf?id=nIAxjsniDzg">
        What Matters For On Policy Deep Actor
        Critic Methods? A Large Scale Study</External>
    </p>

    <p>So, how does the new model perform?</p>

    <div class="flex flex-col w-fit mx-auto">
      <SvgBehindImage class="w-full" v-for="chart in ppodash" :key="chart.image" :image="chart.image" :svg="chart.svg">
        :svg="chart.svg">
        <span class="font-medium pl-2">{{ chart.title }}</span>
      </SvgBehindImage>
    </div>

    <p class="text-xl mt-8" id="manipulation">Troubleshooting: RAM Manipulation</p>

    <p>It was at this point I noticed that something strange was happening. Does this look like peak performance to you?
    </p>

    <VideoBlock :src="disappearingBall" />

    <p>The full video is 20 minutes long. After the ball disappears, training continues until the agent reaches a
      specified maximum number of steps and the episode is forcefully terminated. I can only speculate that by being able
      to observe the RAM directly, the agent was able to manipulate the game to trigger a bug that de-spawned the ball.
    </p>

    <p>This in itself is not a problem. Since the agent gets no reward for episode duration, only for breaking blocks,
      this strategy is not incentivised. However, perhaps this implies that the agent is able to influence the game in
      ways that are harmful for training?</p>

    <p class="text-xl mt-8" id="seed">Troubleshooting: PRNGs</p>

    <p>After reviewing some video of successful Breakout agents, I noticed another suspicious behaviour. Remembering what
      I just said about the episode length limit, see if you can spot something unexpected.</p>

    <VideoBlock :src="pixelVideo" />

    <Expand label="Hint">
      It happens right at the start of the video
    </Expand>

    <p class="my-4">Did you spot it? If the agent only has limited time to act and accumulate score, then why delay at the
      start of the
      episode?</p>

    <p>This is only a guess, but given that we have seen the agent manipulate the game in unexpected ways by making the
      ball disappear, would it be so difficult to imagine that it is waiting a specific number of frames to influence
      where the first ball will spawn? It has no direct access to the system clock (I found a number of frame counters in
      the RAM, but no total running time) but the duration between the first frame and when the agent chooses to fire the
      ball might be enough to influence the random generation of the ball's start posiiton.</p>

    <p>How can we remedy this blatant rule bending? Actually it's quite simple, we don't even need to modify the
      environment. Now that we know which RAM addresses indicate whether the ball is alive, we can just hardcode a
      behaviour in our <code class="inline-code">play_step</code> function fires the ball instantly
      whenever it goes off the screen. However, as we see with the agent above, this doesn't seem necessary for
      the agent to perform well. To be clear, even with this trick, the agent is not just learning a sequence of moves by
      wrote.
    </p>

    <Codeblock label="PPOArgs" language="python" :code="'PPOArgs()'" />

    <br />

    <p class="my-16 py-16"></p>


  </Article>
</template>