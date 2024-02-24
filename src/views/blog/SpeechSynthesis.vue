<script setup lang="ts">
import Article from '@/components/Article.vue'
import External from '@/components/External.vue'

import BNvsIN from '@/assets/BNvsIN.png'
import melSpec from '@/assets/melSpec.webp'
import styleTTSArch from '@/assets/style-tts-architecture.png'
import noising from '@/assets/noising.jpg'
import denoising from '@/assets/denoising.jpg'
import usage from '@/assets/style-tts-usage.gif'

const navItems = [
  {
    href: '#top',
    label: 'Speech Syntheseis',
  },
  {
    href: '#mel-spec',
    label: 'Mel Spectrograms',
  },
  {
    href: '#instance-norm',
    label: 'Instance Normalisation',
  },
  {
    href: '#adain',
    label: 'Adaptive Instance Normalisation',
  },
  {
    href: '#text-aligners',
    label: 'Text Aligners',
  },
  {
    href: '#style-tts',
    label: 'Style TTS',
  },
  {
    href: '#style-tts-2',
    label: 'Style TTS 2',
  },
  {
    href: '#cli',
    label: 'Making my own CLI',
  },
  {
    href: '#further',
    label: 'Further Study',
  },
]

const components = {
  Encoder: "Transforms phonemes from the prompt into vectors in d<sub>model</sub> space (the hidden state)",
  'Text Aligner': "Generates an alignment between mel-spectrograms and phonemes",
  'Style Encoder': "Tranforms a mel-spectrogram into a style vector",
  Decoder: "Reconstructs a mel-spectrogram from encoded text, style, alignment and pitch",
}

</script>

<template>
  <Article :items="navItems" back="/blog" id="top">

    <p class="text-3xl">A History of Speech Synthesis</p>

    <p>In this post, I will explain how traditional speech synthesis models work, and what recent innovations have led to
      the ability to clone any voice from a short reference sample. I even wrote a CLI tool so that you can do this on
      your laptop right now!
    </p>

    <p class="text-xl" id="mel-spec">Mel Spectrograms</p>

    <p>The first thing to understand is how we encode audio samples for use in TTS models &#x2012; a mel-spectrogram.</p>

    <p>Simply put, a mel-spectrogram is what you get when you take an audio signal, extract the frequencies in the signal
      (with fourier transform), and then map those frequencies to a range of human-distinguishable frequencies known as
      the mel scale. (See <External
        href="https://medium.com/analytics-vidhya/understanding-the-mel-spectrogram-fca2afa2ce53">this post</External> for
      more info) At the end of the process, you get this:
    </p>

    <img :src="melSpec" class="mx-auto" />

    <p>Once more, this is simply a graph of all the (human-hearable) frequencies in an audio signal at each time step, and
      their relative loudness. I think it makes sense that this would be a reasonable way to encode both the "style"
      (pitch, energy, duration) and the "content" (phonemes that form words) of a
      speech sample.</p>

    <p>This will be used both for the input (reference audio) and output (synthesised speech) of the model. Next, let's
      take an overview of the taxonomy of a typical TTS model.</p>

    <p class="text-3xl" id="taxonomy">Taxonomy of of a TTS Model</p>

    <p>Here are the main components and their functions:</p>

    <div class="grid grid-cols-[1fr,auto] gap-x-12 gap-y-2 mx-auto my-4 max-w-lg">
      <template v-for="k, v in components" :key="`ramvalue-${k}`">
        <div class="font-medium">{{ v }}</div>
        <div class="font-mono">{{ k }}</div>
      </template>
    </div>

    <p>There are also other components such as Duration Predictors, Prosody Predictors and Pitch Extractors, but they are
      beyond the scope of this article, and quite straightforward in any case.</p>


    <p class="text-xl" id="trad">Mimicking Style Traditional Speech Synthesis</p>

    <p>
      Traditional methods are predominantly based on autoregressive models such as Tacotron. In these models, pitch,
      energy and other pheonetic qualities are all predicted at once. <External
        href="https://google.github.io/tacotron/publications/tacotron2/">Here are some examples</External>.
    </p>

    <p>One drawback of this approach is that it does not allow control of phonetic features &#x2012; the model learns a
      one-to-one mapping from text to waveforms. However, researchers have tried to address this with non-autoregressive
      parallel
      TTS models such as Fastspeech and Glow-TTS.</p>

    <p>
      With these architectures, because phoneme duration, pitch, and energy are predicted independently from speech, it is
      possible to control speech synthesis and produce different intonations or styles. These models also have the
      advantage of generating speech in parallel, enabling faster speech synthesis.
    </p>

    <p>
      These models can be made to produce different speech styles by first training on samples from a
      single target speaker, and then concatenating different speaker embeddings with the encoder output. It is also
      possible to concatenate style vectors and phoneme embeddings as input to the
      decoder.
    </p>

    <p class="text-xl" id="instance-norm">Instance Normalisation</p>

    <p>
      In contrast, the domain of style transfer introduces
      styles through conditional normalization methods like Adaptive
      Instance Normalization (AdaIN).
    </p>

    <p>
      The basis of this technique was first discovered for use in image processing models, where a "BatchNorm" layer was
      used
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
      Given a "content" input and a style reference input, AdaIN simply adjusts the mean and variance of the
      content to match those of the reference, which has been experimentally shown to effectively combine the
      content of the prompt and the style of the rederence just by transferring these feature
      statistics. A decoder network is then learned to generate the
      final stylized image by inverting the AdaIN output back to
      the image space.
    </p>

    <p>For example, consider a feature channel that detects
      brushstrokes of a certain style. An image with these kind
      of strokes will produce a high average activation for this
      feature. The output produced by AdaIN will have the same
      high average activation for this feature, while preserving the
      spatial structure of the content image. The brushstroke fea-
      ture can be inverted to the image space with a feed-forward
      decoder. The variance of this feature chan-
      nel can encoder more subtle style information, which is also
      transferred to the AdaIN output and the final output image.</p>

    <p>You can read more about AdaIN in the paper <External href="https://arxiv.org/pdf/1703.06868v2.pdf">Arbitrary Style
        Transfer in Real-time with Adaptive Instance
        Normalization</External>.</p>


    <p>Great, so now the only remaining task is to take the styled output of the model and convert it back into a
      waveform. This spectrogram -> phoneme mapping is the responsibility of the "text aligner".</p>


    <p class="text-xl" id="text-aligners">Text Aligners</p>

    <p>
      The text aligner generates an "alignment"
      between mel-spectrograms and phonemes. Autoregressive TTS models typically
      use an attention mechanism to learn these alignments on-line.

      One way to do this would simply be to use an external aligner such
      as the Montreal Forced Aligner that is pre-trained on a
      large dataset. However, since it is not trained on the TTS data and objectives, the alignments
      are not always optimal for speech synthesis.

      Another option would be to train the aligners ourselves. While this alleviates some generalization problems,
      overfitting is common as the aligners are trained
      on a smaller TTS dataset with only a mel-reconstruction loss.

      In order to resolve these problems, some have taken a hybrid approach where the aligner is initially trained on an
      automatic speech recognition (ASR) task, using a corpus such as LibriSpeech, and then fine-tuned alogside the
      decoder. This is known as a Transferable Monotonic Aligner (TMA).
    </p>

    <p class="text-xl" id="style-tts">StyleTTS</p>

    <p>Now that you understand the main components of TTS models, let's review an
      architecture.
    </p>

    <img :src="styleTTSArch" class="mx-auto" />

    <p>On the left, the decoder is trained to reconstruct input mel-spectrogram
      using pitch, energy, phonemes, alignment, and style vectors. On the right, pitch, energy, and alignment are
      predicted from the input text using these trained modules, and a style vector is extracted from a reference
      mel-spectrogram for synthesis.</p>

    <p>
      This particular model is called "StyleTTS" and you can read more about it in: <External
        href="https://arxiv.org/pdf/2205.15439.pdf">StyleTTS: A Style-Based Generative Model for Natural and
        Diverse Text-to-Speech Synthesis</External>. This is a good starting point, because now we are going to jump into
      the future a few years and review Style TTS's big brother, Style TTS 2.
    </p>


    <p class="text-xl" id="style-tts-2">StyleTTS 2</p>

    <p>
      StyleTTS 2 differs from its predecessor by
      modeling styles as a latent random variable through diffusion models. For one, this means that although reference
      speech can still be provided, it is no longer required. Also, it makes use of large pre-trained SLMs as
      discriminators using a technique the paper dubbs "differentiable duration modeling".

      See <External href="https://styletts2.github.io/">the StyleTTS 2 samples page</External> to get an idea of how it
      sounds, or try out the <External href="https://huggingface.co/spaces/styletts2/styletts2">demo on HuggingFace
      </External>
    </p>

    <p>So what is a diffusion model, and how can one be applied to speech synthesis? If you want an in depth explanation,
      I recommend <External href="https://lilianweng.github.io/posts/2021-07-11-diffusion-models/">this excellent blog
        post by Lilian Weng</External>. For the moment however, you can think of a diffusion model as a denoising model.
      The training process looks like this:</p>

    <img :src="noising" class="mx-auto max-w-xl" />

    <p>Where progressively more noise is added to an image, and the model is trained to reconstruct the original as below:
    </p>

    <img :src="denoising" class="mx-auto max-w-3xl" />

    <p>This is yet another technique borrowed from image models, however it has one drawback, namely that inference on
      waveforms is an iterative process, so their efficiency is limited
      compared to previously discussed methods. This is because they need to iteratively
      sample mel-spectrograms, waveforms, or other latent representations proportional to the target
      speech duration.</p>

    <p>Furthermore, although diffusion models initially outperformed GANs for speech synthesis, more recent studies (see
      the Style TTS 2 paper below) have shown GANs once more outperforming diffusion models, so perhaps there is still
      some hope
      for a parallelisable speech synthesis model?</p>

    <p>This is exactly the motivation for Style TTS 2. To address the limitations with using diffusion directly, another
      method is to only train the diffusion to produce a fixed-length style vector, conditioned on the input text. This
      enables end-to-end training, and speech synthesis is performed using a GAN-based model, with only the style vector
      dictating the diversity of speech sampled.</p>

    <p>
      You can read more about
      StyleTTS 2 in <External href="https://arxiv.org/pdf/2306.07691.pdf">StyleTTS 2: Towards Human-Level Text-to-Speech
        through Style
        Diffusion and Adversarial Training with Large Speech Language Models</External>
    </p>

    <p class="text-xl" id="cli">Making my own CLI</p>

    <p>
      Since there was no convenient way to run inference, I wrote a small CLI tool so that you can play with Style TTS 2
      on your local machine, and make adjustments to the inference process if you wish. The code is available <External
        href="https://github.com/persuck/StyleTTS2">on my fork</External>.
    </p>

    <p>Here are some examples of how fast the inference is, even on my laptop (M2 Macbook).</p>

    <img :src="usage" class="mx-auto my-4 max-w-3xl" />

    <p>My fork will also handle downloading external dependencies for you, so you should be able to simply clone the fork,
      <code class="inline-code">pip install -r requirements.txt</code>, drop some reference wav files in <code
        class="inline-code">Data/reference_audio</code>, and run <code class="inline-code">python synthesise.py</code>.
    </p>

    <br />

    <p class="text-xl" id="further">Further Study</p>

    <p>
      There are many other popular models that I haven't touched on here, such as
      <External href="https://github.com/coqui-ai/TTS">Coqui</External>, and little is known about state of the
      architecture behind state of the art commercial models such as those mode by <External
        href="https://elevenlabs.io/">ElevenLabs</External>. However it is impossible to summarise the entire field in one
      article.
    </p>

    <p>
      No doubt, at the time of writing the content of this article is sure to be rendered obsolete, but I hope you come
      away with an appreciation for how speech synthesis techniques have built upon one another, and borrowed from other
      tried and true methods in other domains, such as image generation, over the years.
    </p>

    <p>
      Hopefully you are now armed to understand whatever new architectures are released, and perhaps even implement your
      own ideas! I can't wait to see what comes next in this exciting era!
    </p>

    <p class="my-16 py-16"></p>


  </Article>
</template>