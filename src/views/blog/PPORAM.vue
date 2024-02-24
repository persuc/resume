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
import finalGame from '@/assets/ppo-ram/final.mp4'
import pixelVideo from '@/assets/ppo-ram/pixel/example.mp4'
import Expand from '@/components/Expand.vue'

const navItems = [
  {
    back: '/blog',
  },
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
  {
    href: '#result',
    label: 'Final Results',
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

const randomSpawn = getChart('random-spawn')

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

const spawnCode = `class BreakoutRandomEnv(gym.Wrapper):
    def __init__(self, env, seed: int):
        """Randomise the ball start position, and set x velocity to 0 after being fired
        """
        gym.Wrapper.__init__(self, env)
        self.rng = np.random.default_rng(seed + 1)
        self.ale = env.unwrapped.ale
        self.awaiting_launch = False
        self.new_x = 0

    def step(self, ac):
        """
          params:
            ac: the action selected by the agent. 1 == fire ball
        """
        ram = self.ale.getRAM()
        # RAM address 101 is ball y position
        # If it is 0, there is no ball (ready to fire)
        # Or if it is >= 208 the ball is off the bottom of the screen, and a new one can also be fired
        if ac == 1 and (ram[101] == 0 or ram[101] >= 208):
            self.awaiting_launch = True
            self.new_x = self.rng.integers(64, 201)

        # Step environment based on the sampled action (after this, the ball is launched)
        obs, rewards, dones, infos = self.env.step(ac)
        
        if self.awaiting_launch:
            self.awaiting_launch = False

            self.ale.setRAM(99, self.new_x) # set the x position to a random value
            self.ale.setRAM(101, 112) # set y position to near the top of the screen
            self.ale.setRAM(105, 0) # set x speed to 0

            # update the observation to reflect our changes to the RAM
            obs[99] = self.new_x
            obs[101] = 112
            obs[105] = 0

        return obs, rewards, dones, infos`

// Used during development only to download assets from Weights and Biases
function saveWandBCanvas(name) {
  const canvas = document.querySelector(".fullscreen-mode.content canvas")
  const newWindow = window.open()
  newWindow.document.write(`<img src="${canvas.toDataURL('image/png')}" />`)

  let svg = document.querySelector(".fullscreen-mode.content svg").outerHTML
  svg = svg.replace(/width="([0-9]+)" height="([0-9]+)"/, "viewBox=\"0 0 $1 $2\"")
  svg = svg.replaceAll(/\&quot;/g, '&quotcolon')
  svg = svg.replaceAll(/stroke:\s*([^;"]+);?(.*?)"/g, '$2" stroke="$1"')
  svg = svg.replaceAll(/stroke-width:\s*([^;"]+);?(.*?)"/g, '$2" stroke-width="$1"')
  svg = svg.replaceAll(/fill:\s*([^;"]+);?(.*?)"/g, '$2" fill="$1"')
  svg = svg.replaceAll(/style="\s*"/g, '')
  svg = svg.replaceAll(/class="(rv-xy-plot__axis__line|rv-xy-plot__axis__tick__line|rv-xy-plot__grid-lines__line)"/g, 'stroke="#E6E6E9" stroke-width="2px"')
  svg = svg.replaceAll(/\&quotcolon/g, '&quot;')
  const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" })
  const svgUrl = URL.createObjectURL(svgBlob)
  const downloadLink = document.createElement("a")
  downloadLink.href = svgUrl
  downloadLink.download = `${name}-axes.svg`
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

    <p>Proximal Policy Optimisation (PPO) falls under the family of Reinforcement Learning (RL) techniques that has gained
      significant attention in recent years. If you are familiar with other policy optimization methods, PPO offers
      improvements in sample efficiency, stability, and robustness in training deep neural networks for reinforcement
      learning tasks. A key feature of PPO is the clipped surrogate objective. This limit on the loss strikes helps
      balance
      between exploration and exploitation, and PPO has demonstrated remarkable performance across a wide range of complex
      environments, including robotics, game playing, and autonomous control systems.</p>

    <p>One important difference between PPO and other RL algorithms such as DQN is that PPO is learns online. i.e. it
      learns directly from whatever observations are provided by the environment as its agent performs actions. This means
      that training data is not used as efficiently, since it only sees each batch of data once. However, this is not a
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

    <SvgBehindImage class="max-w-[30rem] mb-4 mx-auto" v-for="chart in memory1" :key="chart.image" :image="chart.image"
      :svg="chart.svg">
      <span class="font-medium pl-2">{{ chart.title }}</span>
    </SvgBehindImage>

    <p>Compare this to a training run where the actor and critic used a shared convolutional architecture instead, and
      were given observations in the form of pixel data:</p>

    <VideoBlock :src="pixelVideo">Agent trained on pixel data performs well</VideoBlock>

    <SvgBehindImage class="max-w-[30rem] mb-4 mx-auto" v-for="chart in pixel" :key="chart.image" :image="chart.image"
      :svg="chart.svg">
      <span class="font-medium pl-2">{{ chart.title }}</span>
    </SvgBehindImage>

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

    <p>I was sceptical that this would work, but it was the first thing I wanted to try.</p>

    <p>The reason for my pessimism is that the Atari only uses 128 bytes of RAM to store the state of Breakout,
      (represented to the model
      as 128 <code class="inline-code">uint8</code> values) so my simple architecture with 64
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

    <SvgBehindImage class="max-w-[30rem] mb-4 mx-auto" v-for="chart in memory2" :key="chart.image" :image="chart.image"
      :svg="chart.svg">
      <span class="font-medium pl-2">{{ chart.title }}</span>
    </SvgBehindImage>

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

    <SvgBehindImage class="max-w-[30rem] mb-4 mx-auto" v-for="chart in ppodash" :key="chart.image" :image="chart.image"
      :svg="chart.svg">
      <span class="font-medium pl-2">{{ chart.title }}</span>
    </SvgBehindImage>

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

    <p>I decided to review the footage of the successful Breakout agent trained on pixel data, and I noticed another
      suspicious behaviour. Take note of when
      the agent seems to do well, and when it makes mistakes.</p>

    <VideoBlock :src="pixelVideo" />

    <Expand label="Hint">
      Is the ball any more likely to be in certain places?
    </Expand>

    <p class="my-4">Did you spot it? The agent is capitalising on a statistical quirk of the Atari implementation of
      Breakout.
      After analysing thousands of games of Breakout, I discovered that the ball is much more likely to end up towards the
      edge of the screen rather than the center.</p>

    <p>I'm not exactly sure why this is the case. One reason is probably that the ball bounces off the side walls, meaning
      it naturally has to spend more time at the edge of the screen than travelling across the center. But given that we
      have seen the agent manipulate the game in unexpected ways by making the ball disappear, it could also be the case
      that the has found a way to influence
      where the ball will spawn, choosing an advantageous starting position.</p>

    <p>Whatever the reason, the agent is able to accumulate 3-4 points just by staying in one of the corners a lot of the
      time. How can we remedy this brazen rule bending? Actually it's quite simple, we don't even need to modify the
      environment. Now that we know which RAM addresses indicate whether the ball is alive, we can just add a
      wrapper to the environment that moves the ball instantly to a random location on spawn (as per the normal Breakout
      rules, but with a random number generator completely hidden to the model).</p>

    <p>Also, to address the fact that Breakout inherently has some bias for the ball to move to the edge of the screen, I
      set the ball's initial x velocity to 0, so that it falls in a straight line, meaning that after first being fired, a
      ball has a uniform probability of passing over each x coordinate at the bottom of the screen.
    </p>

    <p>Here is the code:</p>

    <Codeblock label="PPOAgent play_step() method:" language="python" :code="spawnCode" />

    <p class="text-xl mt-8" id="result">Final result</p>

    <p>After 300k steps, here is what the agent in the new environment looks like:</p>

    <VideoBlock :src="finalGame" />

    <SvgBehindImage class="max-w-[30rem] mb-4 mx-auto" v-for="chart in randomSpawn" :key="chart.image"
      :image="chart.image" :svg="chart.svg">
      <span class="font-medium pl-2">{{ chart.title }}</span>
    </SvgBehindImage>

    <p>You'll notice I had some long running episodes, and some hiccups in the training, but leaving those aside what
      seems to have happened is that the agent has found a new "statistical" method of playing Breakout, where it
      repeatedly swings the paddle across the screen to maximise the chance of hitting the ball, sort of like a blind man
      who can't tell where the ball is, and so must just make the paddle cover as much area as possible in the few steps
      during which the ball is able to collide with the paddle.</p>

    <p>At this point, a few hundred dollars poorer and quite low on sleep, I admit defeat. I have no idea a model that
      should be large enough to learn this task (2 hidden
      layers of size 64) is acting as if it has no observations to work on at all. If anyone has any advice they would
      like to give me, or would like to review the entire codebase for training these agents, you can <External
        href="https://github.com/persuck/memory-pixel-interp">
        check out the project on GitHub</External>.</p>

    <p>I actually had much grander plans for this project. My dream would have been to be able to train RAM-observation
      models for any Atari game, alongside a pixel-observation models, use the activations of the RAM-models to identify
      which memory addresses represent important features in each game. Then I could try to visualise extracted features
      in the
      pixel-observation models by tweaking the various memory addresses and seeing if there are common activation
      patterns, perhaps using a library like <External href="https://nnsight.net/">nnsight</External>. It would also have
      been pretty neat to be able to label each memory address with a picture of what
      the
      pixel-observation model thinks that memory address represents in the game.</p>



    <br />

    <p class="my-16 py-16"></p>


  </Article>
</template>