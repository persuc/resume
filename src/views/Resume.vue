<script setup lang="ts">
import { EMAIL } from '@/ts/constants'
import faceImage from '@/assets/face.png'
import monashLogo from '@/assets/monash.png'
import Article from '@/components/Article.vue'
import External from '@/components/External.vue'
import ImageAndText from '@/components/ImageAndText.vue'
import CopyButton from '@/components/CopyButton.vue'
import JobTitle from '@/components/JobTitle.vue'
import Icon from '@/components/Icon.vue'
import Button from '@/components/Button.vue'
import BackButton from '@/components/BackButton.vue'

</script>

<template>
  <div class="overflow-hidden">
    <BackButton />
    <a href="/andrew_persic_resume.pdf" download class="relative float-right -right-6 top-0 plain w-auto print:hidden">
      <Button variant="primary">
        <Icon name="download" class="mr-2 w-5" />Download
      </Button>
    </a>
    <Article back="/" class="pt-16 md:pt-24 px-4 print:!pt-0">
      <ImageAndText class="w-fit mx-auto pr-0" :image="faceImage" :rounded="true">
        <p class="mb-1" style="line-height: 1em;">Andrew Persic</p>
        <CopyButton :value="EMAIL" style="line-height: 1.5em;">{{ EMAIL }}</CopyButton>
        <!-- <br /> -->
      </ImageAndText>
      <div class="w-fit mx-auto text-center">
        Frontend & backend web • Data-intensive workloads • Cloud infrastructure
      </div>

      <JobTitle class="mt-2" company="ARENA 3.0" role="Participant" date-from="8 weeks"
        :tech="['Python', 'NumPy', 'PyTorch', 'Einops', 'NNsight', 'TransformerLens']" />
      <ul class="list-disc ml-8">
        <li>The <External href="https://www.arena.education/">the ARENA 3.0 program</External> led by <External
            href="https://www.perfectlynormal.co.uk/">Callum McDougall</External> offers a deep-dive into machine
          learning
          with a focus on mecahnistic interpretability
        </li>
        <li>Built convolutional networks, residual networks,
          optimizers, GANs, VAEs and transformers from scratch</li>
        <li>Interpreted open source models with techniques such as function vectors, SAEs, and tools like <External
            href="https://nnsight.net/">
            NNSight
          </External> and <External href="https://neelnanda-io.github.io/TransformerLens/">TransformerLens</External>
        </li>
        <li>Applied various training techniques, including Q-learning, PPO and RLHF</li>
      </ul>

      <JobTitle class="mt-2" company="Canva" role="Senior Software Engineer" role-qualifier="Backend + Frontend"
        date-from="2022" date-to="2024"
        :tech="['TypeScript', 'React', 'Java', 'Terraform', 'AWS', 'GraphQL', 'Protobuf', 'PostgreSQL', 'DynamoDB']" />
      <ul class="list-disc ml-8">
        <li>Managed all pages on <a target="_blank" href="https://www.canva.com/">canva.com</a>
          and <a target="_blank" href="https://www.canva.cn/">canva.cn</a>.
          These 32,590 pages receive ~30 million requests per day</li>
        <li>Expanded infrastructure to the China region, established communication between the Beijing and Landing
          Pages teams, and delivered experimentation and fallback mechanisms in the China region</li>
        <li>Created web tools to manage our pages and synchronise millions of daily content changes</li>
        <li>Implemented an experimentation service for A/B testing page changes in real time across 2 regions</li>
      </ul>

      <JobTitle class="mt-2" company="Two Bulls" role="Senior Software Engineer" role-qualifier="Backend + Frontend"
        date-from="2020" date-to="2022"
        :tech="['Vue.js', 'TypeScript', 'Node.js', 'C#', 'Python', 'AWS', 'MySQL', 'DynamoDB']" />
      <ul class="list-disc ml-8">
        <li>Delivered bespoke web applications including <a target="_blank"
            href="https://www.kidsdoconcall.com.au/">KidsDoc</a> telehealth, <a target="_blank"
            href="https://fit.theonetwo.com/">TheOneTwo</a> shopfront, <a target="_blank"
            href="https://www.service.vic.gov.au/services/border-permit/home">Victorian COVID border permits</a>
          (reached
          #3
          on the app store!) and the <a target="_blank" href="https://release.me/">Release.Me</a> land sales platform
        </li>
        <li>Responsible for project leadership as well as frontend &amp; backend technical proficiency</li>
        <li>Learned to work with clients ranging from startups in the inception phase, to state governments to find
          unique
          solutions</li>
      </ul>

      <JobTitle class="mt-2" company="Unico" role="Software Engineer" role-qualifier="Backend" date-from="2019"
        date-to="2020" :tech="['Java', 'MySQL', 'Python', 'MATRIXX', 'Linux', 'Docker', 'Spring']" />
      <ul class="list-disc ml-8">
        <li>Performed large scale database migrations (ETL) for prominent telecommunications vendors</li>
        <li>Successfully migrated over 20 million records to the <i>MATRIXX</i> in-memory database in a single day</li>
        <li>Gained experience in data-intensive systems and concurrency</li>
      </ul>

      <JobTitle class="mt-2" company="Immersive Analytics" role="Software Engineer" role-qualifier="Research"
        date-from="2017" date-to="2019" :tech="['JavaScript', 'Three.js', 'WebGL', 'Python', 'R']" />
      <ul class="list-disc ml-8">
        <li>Developed a highly performant web application for 2D and 3D
          visualisation of protein complexes and cross-link mass
          spectrometry data using <i>Three.js</i> and <i>WebGL</i></li>
      </ul>

      <div class="flex flex-col md:flex-row md:justify-between print:hidden">
        <div>
          <div>
            <br />
            <p class="text-lg">Inquire to learn more about</p>
            <p>UAVs, speech synthesis, cluster computing</p>
          </div>
        </div>
        <ImageAndText class="whitespace-nowrap mt-4 w-fit mx-auto md:mx-4" :image="monashLogo" :size="'4rem'">
          <p class="mb-1">Monash University</p>
          <p class="italic">Bachelor of Computer Science</p>
        </ImageAndText>
      </div>
    </Article>
    <div style="height: 10rem;" class="print:hidden" />
  </div>
</template>
