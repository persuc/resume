<script setup lang="ts">
import Codeblock from '@/components/Codeblock.vue'
import Note from '@/components/Note.vue'
import Article from '@/components/Article.vue'
import External from '@/components/External.vue'
import Formula from '@/components/Formula.vue'
import SvgBehindImage from '@/components/SvgBehindImage.vue'
import VideoBlock from '@/components/VideoBlock.vue'


const navItems = [
  {
    href: '#top',
    label: 'Top',
  },
]

const GPT2ModulesCode = `GPT2Model(
  (wte): Embedding(50257, 1024)
  (wpe): Embedding(1024, 1024)
  (drop): Dropout(p=0.1, inplace=False)

  # We are using up to this point, plus three of the next GPT2Blocks as the base for perplexity prediction
  (h): ModuleList(
    (0-23): 24 x GPT2Block(
      (ln_1): LayerNorm((1024,), eps=1e-05, elementwise_affine=True)
      (attn): GPT2Attention(
        (c_attn): Conv1D()
        (c_proj): Conv1D()
        (attn_dropout): Dropout(p=0.1, inplace=False)
        (resid_dropout): Dropout(p=0.1, inplace=False)
      )
      (ln_2): LayerNorm((1024,), eps=1e-05, elementwise_affine=True)
      (mlp): GPT2MLP(
        (c_fc): Conv1D()
        (c_proj): Conv1D()
        (act): NewGELUActivation()
        (dropout): Dropout(p=0.1, inplace=False)
      )
    )
  )
  (ln_f): LayerNorm((1024,), eps=1e-05, elementwise_affine=True)
)

# usually a linear layer is used to transform hidden state into logits (LM head)
Linear(in_features=1024, out_features=50257, bias=False)`

</script>

<template>
  <Article :items="navItems" back="/blog" id="top">

    <p class="text-3xl">Perplexity Prediction</p>

    <p>Knowing the perplexity score may be useful for the process of supplementing a larger model using a smaller model
      in order to save computational resources. In this post I will focus on the text generation usecase. The way it
      works
      is that there are three models: the small model, the large model, and the perplexity prediction model. The large
      model is
      computationally expensive, but performs well. The small model in computationally inexpensive, but performs worse
      that the large model. The perplexity prediction model is responsible for estimating how close the small model's
      output is to the large model's.
    </p>

    <p>The key challenge for the perplexity prediction model is to be able to discern places within the output sequence
      where the small
      model performs as well or almost as well as the large model, and therefore computational resources can be saved by
      avoiding using the large model to generate those tokens. How can we train such a model?</p>

    <p>My idea for the architecture is simple: all three models will use the bottom 5 layers (embedding and 3 hidden
      layers) of the large model (with
      pretrained weights) as a
      base. The perplexity prediction model is just a final linear layer on top of this hidden state which outputs a
      single number: the predicted perplexity if we fed the input plus one token of the small model to the large model.
    </p>

    <p>Training is quite simple.</p>
    <ol>
      <li>Choose a text generation dataset</li>
      <li>For each example, run the small model to produce one token</li>
      <li>Feed the input plus the new token into the large model and calculate a perplexity score</li>
      <li>Run the perplexity prediction model to produce an esitmated perplexity score</li>
      <li>Backpropogate through the perplexity prediction model to minimise the difference between the predicted and
        actual perplexity scores</li>
      <li>Note: It probably helps if the dataset contains an even split of examples where the small model can and cannot
        do as
        well as the large model</li>
    </ol>

    <p class="text-xl mt-8" id="what-is-ppo">Code example</p>

    <p class="text-xl mt-8" id="what-is-ppo">Further thoughts</p>

    <ul>
      <li>Can we reuse the computations done in the shared part of the architecture?</li>
      <li>Could the perplexity prediction model be implemented in some way other than a neural network?</li>
      <li>It might be better just to train the perplexity prediction model as a predictor of whether the small_model is
        likely to be correct or not. We might just train directly on a dataset instead of on the large model's output
      </li>
      <li></li>
    </ul>

    <p class="my-16 py-16"></p>

  </Article>
</template>