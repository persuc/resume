<script setup lang="ts">
import Article from '@/components/Article.vue'
import External from '@/components/External.vue'
import Codeblock from '@/components/Codeblock.vue'

import BNvsIN from '@/assets/BNvsIN.png'

const navItems = [
  "back" as const,
  {
    href: '#top',
    label: 'Speech Syntheseis',
  },
  {
    href: '#instance-norm',
    label: 'Instance Normalisation',
  },
  {
    href: '#adain',
    label: 'Adaptive Instance Normalisation',
  },
]

</script>

<template>
  <Article :items="navItems" id="top">

    <p class="text-3xl">A History of Speech Synthesis</p>

    <p>In this post, I will explain how traditional speech synthesis models work, and what recent innovations have led to
      the ability to clone any voice from a short reference sample. I even wrote a CLI tool so that you can do this on
      your laptop right now!
    </p>

    <p class="text-xl" id="trad">Traditional Speech Synthesis</p>

    <p>
      Traditional methods are predominantly based on autoregressive models such as Tacotron. In these models, pitch,
      energy and other pheonetic qualities are all predicted at once. <External
        href="https://google.github.io/tacotron/publications/tacotron2/">Here are some examples</External>.
    </p>

    <p>One drawback of this approach is that it does not allow control of phonetic features &#x2012; the model learns a
      one-to-one mapping from text to waveforms. Researchers have tried to address this with non-autoregressive parallel
      TTS models such as Fastspeech and Glow-TTS.</p>

    <p>
      With these architectures, because phoneme duration, pitch, and energy are predicted independently from speech, it is
      possible to control speech synthesis and produce different intonations or styles. These models also have the
      advantage of generating speech in parallel, enabling faster speech synthesis.
    </p>

    <p>
      These models can be made to produce different speech styles by first training on samples from a
      single target speaker, and then concatenating different speaker embeddings with the encoder output. Models that
      explore speech styles also incorporate styles by concatenating style vectors and phoneme embeddings as input to the
      decoder.
    </p>

    <p class="text-xl" id="instance-norm">Instance Normalisation</p>

    <p>
      In contrast, the domain of style transfer introduces
      styles through conditional normalization methods like adaptive
      instance normalization (AdaIN). Adaptive Instance Normalization is simply the process of aligning the mean and
      variance of the content (synthesised speech) features with those of the style (reference clip) features.
    </p>

    <p>
      This is actually a technique first discovered for use in image processing models, where a "BatchNorm" layer was used
      to ease the training of feed-forward networks by normalizing feature
      statistics. Batch Normalisation simply involves taking a batch of N inputs, and normalising the mean
      and standard deviation for each individual feature channel. (For images, this would be the R, G and B colour
      channels)
    </p>

    <p>
      Instance normalization is almost the same, but performs style normalization by normalizing feature statistics, which
      have been found to carry the style information of an image. Like batch normalisation, μ(x) and σ(x) are
      computed across spatial dimensions independently for each channel, but also indepent to each sample!
    </p>

    <p>Perhaps it should be surprising that this more localised / less aggregated statistical change would be better at
      identifying overarching patterns, but it turns out that replacing BN layers with IN layers achieves significant
      improvements.</p>

    <img :src="BNvsIN" class="mx-auto" />

    <p>
      But why do these methods actually succeed in extracting style features? The intuition I can give you for is that
      neural networks encode not only the content but
      also the style information of the content. Moreover, the style and content are somewhat separable: e.g. it is
      possible to change the style of an image while preserving its content.
    </p>

    <p class="text-xl" id="adain">Adaptive Instance Normalisation</p>

    <p>
      Given a content input and a style
      input, AdaIN simply adjusts the mean and variance of the
      content input to match those of the style input. Through
      experiments, we find AdaIN effectively combines the con-
      tent of the former and the style latter by transferring feature
      statistics. A decoder network is then learned to generate the
      final stylized image by inverting the AdaIN output back to
      the image space

    </p>

    <p>For example, consider a feature channel that detects
      brushstrokes of a certain style. An image with these kind
      of strokes will produce a high average activation for this
      feature. The output produced by AdaIN will have the same
      high average activation for this feature, while preserving the
      spatial structure of the content image. The brushstroke fea-
      ture can be inverted to the image space with a feed-forward
      decoder, similar to [10]. The variance of this feature chan-
      nel can encoder more subtle style information, which is also
      transferred to the AdaIN output and the final output image</p>

    <p>You can read more about AdaIN in the paper <External href="https://arxiv.org/pdf/1703.06868v2.pdf">Arbitrary Style
        Transfer in Real-time with Adaptive Instance
        Normalization</External>.</p>


    <p>Style TTS is a series of speech synthesis models built with the aim of improving style transfer. The goal is to be
      able to train one model, and then provide a a reference audio file of some speech and have the model copy the pitch,
      prosody, tempo and other characteristics of the reference without specific categorisation of these traits.</p>
    <p>

      <External href="https://arxiv.org/pdf/2205.15439.pdf">StyleTTS: A Style-Based Generative Model for Natural and
        Diverse Text-to-Speech Synthesis</External>

      <External href="https://arxiv.org/pdf/2306.07691.pdf">StyleTTS 2: Towards Human-Level Text-to-Speech through Style
        Diffusion and Adversarial Training with Large Speech Language Models</External>

      <External href="https://huggingface.co/spaces/styletts2/styletts2">Demo on HuggingFace</External>
      <External href=""></External>
    </p>


    <Codeblock label="PPOArgs" language="python" :code="'PPOArgs()'" />

    <br />

    <p class="my-16 py-16"></p>


  </Article>
</template>