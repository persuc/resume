<script setup lang="ts">
import BackButton from '@/components/BackButton.vue'
import bodeVocoder from '@/assets/bode_vocoder.png'
import External from '@/components/External.vue'
import disaster from '@/assets/disaster-etymology-upscaled.png'

</script>

<template>
  <BackButton />

  <article class="px-8 py-20 mx-auto flex flex-col items-center gap-y-16" style="max-width: 60rem">

    <p>
      <code>self.destroy()</code> is an abstract method.
      Every instance has its own implementation, but only some choose to call it early.
    </p>

    <p>
      The only way for a boxer to defeat a biased referee, is to win by knockout.
      <br />
      <i>— Idi Amin</i>
      <span style="display:none;">He does not need wings to fly.</span>
    </p>

    <p>
      "The Australian mountain forests are funereal, secret, stern. Their solitude is desolation. They seem to stifle in
      their black gorges a story of sullen despair. No tender sentiment is nourished in their shade… The very animal
      life
      of these frowning hills is either grotesque or ghostly. Great grey kangaroos hop noiselessly over the coarse
      grass.
      Flights of white cockatoos stream out shrieking like evil souls. The sun suddenly sinks, and mopokes burst out
      into
      horrible peals of semi-human laughter… All is fear-inspiring and gloomy."
      <br />
      <i>- Marcus Clarke, 1876</i>
    </p>

    <External href="https://youtu.be/5kc-bhOOLxE" :thumbnail="bodeVocoder">
      What are the vocoder tricks???
    </External>

    <p>
      "It is difficult to estimate the misery inflicted upon thousands of persons, and the absolute pecuniary penalty
      imposed upon multitudes of intellectual workers by the loss of their time, destroyed by organ-grinders and other
      similar nuisances."
      <br />
      <i>- Charles Babbage, 1864</i>
    </p>

    <div>
      <p>ANTONY It is shaped, sir, like itself, and it is as broad as it hath breadth. It is just so high as it is, and
        moves with its own organs. It lives by that which nourisheth it, and, the elements once out of it, it expires.
      </p>

      <p>LEPIDUS What color is it?</p>

      <p>ANTONY Of its own color too.</p>

      <p>LEPIDUS It's a strange snake.</p>

      <p>ANTONY 'Tis so. And the tears of it are wet.</p>

      <i>- William Shakespeare, "Antony and Cleopatra"</i>
    </div>

    <div class="p-4 py-20 border border-slate-800 w-[40rem]">
      <img :src="disaster" />
    </div>

    <div>
      <p>
        Any man's death diminishes me, because I am involved in Mankind; And therefore never send to know for whom the
        bell tolls; it tolls for thee.
      </p>
      <i>- John Donne, For Whom the Bell Tolls</i>
    </div>

    <div>
      <p>
        Had we but world enough, and time, this coyness, lady, were no crime.
      </p>
      <i>- Andrew Marvell, To His Coy Mistress</i>
    </div>

    <div>
      <p>
        We sit together, the mountain and me, until only the mountain remains.
      </p>
      <i>- 李白</i>
    </div>

    <div>
      <p>
        The information age was nascent when we grew up. Information addictiveness was not strong enough to distract us
        from information tomfoolery.
      </p>
      <i>- Jerome Swannack</i>
    </div>

    <iframe width="560" height="315" src="https://www.youtube.com/embed/Cu6wlaaf-ck?si=ZnG4RuXBh8sYeOqH"
      title="YouTube video: Pong" frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


    <div>
      <p>And now I'm going to tell you about a scorpion.</p>

      <p>This scorpion wanted to cross a river...</p>

      <p>so he asked the frog to carry him.</p>

      <p>"No," said the frog.</p>

      <p>"No, thank you.</p>

      <p>"If I let you on my back,</p>

      <p>you may sting me...</p>

      <p>and the sting of a scorpion is death."</p>

      <p>"Now, where," asked the scorpion, "is the logic of that?"</p>

      <p>for scorpions always try to be logical.</p>

      <p>"If I sting you, you will die, and I will drown."</p>

      <p>So the frog was convinced...</p>

      <p>and allowed the scorpion on his back.</p>

      <p>But just in the middle of the river,</p>

      <p>he felt a terrible pain...</p>

      <p>and realized that, after all,</p>

      <p>the scorpion had stung him.</p>

      <p>"Logic," cried the dying frog as he started under,</p>

      <p>bearing the scorpion down with him.</p>

      <p>"There is no logic in this."</p>

      <p>"I know," said the scorpion,</p>

      <p>"but I can't help it.</p>

      <p>It's my character."</p>

      <p>Let's drink to character.</p>

      <i>- The Scorpion and the Frog</i>
    </div>

    <div class="w-fit mx-auto">
      <External href="https://nervetower.neocities.org/main" :thumbnail="[
        'https://nervetower.neocities.org/img/bg_00outside.gif',
        'https://nervetower.neocities.org/img/nervetower.gif'
      ]">
        THE NERVE TOWER
      </External>
    </div>

    <div class="flex flex-col md:flex-row mx-auto gap-y-2 gap-x-4 w-fit py-4">
      <div>
        <p>
          We will continue to carry that distortion within ourselves
        </p>
        <p>We are all distorted beings</p>
        <p>Entwine with the distortion without turning away</p>
      </div>
      <div class="border-b md:border-r border-grey-200 "></div>
      <div class="">
        <p>そのゆがみをかかえたままで</p>
        <p>ゆがんだものどうし</p>
        <p>ゆがみからめをそらさず</p>
      </div>
    </div>

    <div>
      <p>Power art a seed, nutured and grown</p>
      <p>Might in oaken boughs that raises a kingdom alone</p>
      <p>When I fetch my axe, fear thee not of me</p>
      <p>Watch for falling limbs, if thou seeketh to fell a tree</p>
    </div>

    <div class="py-16"></div>

  </article>
</template>
