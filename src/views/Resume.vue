<script setup lang="ts">
import { EMAIL, PHONE } from '@/ts/constants'
import faceImage from '@/assets/face.png'
import monashLogo from '@/assets/monash.png'
import ImageAndText from '@/components/ImageAndText.vue'
import CopyButton from '@/components/CopyButton.vue'
import Header from '@/components/Header.vue'
import JobTitle from '@/components/JobTitle.vue'
import Icon from '@/components/Icon.vue'
import Button from '@/components/Button.vue'

</script>

<template>
  <Header class="print:hidden">
    <a href="/andrew_persic_resume.pdf" download class="plain">
      <Button>
        <Icon name="download" class="mr-2 w-5" />Download
      </Button>
    </a>
  </Header>

  <div class="resume px-8" style="max-width: 60rem; margin: 0 auto;">
    <div class="flex justify-between topRow" style="height: 2.1rem;">
      <div class="text-2xl">
        Skills
      </div>
      <ImageAndText class="contact whitespace-nowrap mt-4" :image="faceImage" :rounded="true">
        <p class="mb-1" style="line-height: 1em;">Andrew Persic</p>
        <CopyButton :value="EMAIL" style="line-height: 1.5em;">{{ EMAIL }}</CopyButton>
        <!-- <br /> -->
        <!-- <CopyButton :value="PHONE" style="line-height: 1.2em;">{{ PHONE }}</CopyButton> -->
      </ImageAndText>
    </div>

    <!-- <p class="mt-2 text-xl">Technical Leadership</p>
    <p>I build relationships and pursue initiatives targeting cross-cutting concerns. My leadership style is asking
      questions based on a solid understanding of business processes and software architecture, then facilitating
      communication to define goals. I enjoy mentoring, with the aim of helping more junior engineers hone their skills so
      they can deliver projects on their own.
    </p> -->

    <p class="mt-2 text-xl">Engineering</p>
    <p>Experienced with high scale, data-intensive workloads across different regions and architectures. Highly competent
      in web technologies such as <i>Node.js</i>, <i>Vue.js</i> &amp; <i>React</i>, as well as backend technologies
      including <i>AWS</i>,
      <i>Terraform</i>, <i>Java</i> and <i>SQL</i> + <i>NoSQL</i> databases.
    </p>

    <div class="mt-4 text-2xl">
      Relevant Experience
    </div>

    <JobTitle class="mt-2" company="Canva" role="Senior Software Engineer (Backend + Frontend)" date-from="2022"
      date-to="Current"
      :tech="['TypeScript', 'React', 'Java', 'Terraform', 'AWS', 'GraphQL', 'Protobuf', 'PostgreSQL', 'DynamoDB']" />
    <ul class="list-disc ml-8">
      <li>Managed all pages on <a target="_blank" href="https://www.canva.com/">canva.com</a>
        and <a target="_blank" href="https://www.canva.cn/">canva.cn</a>.
        These 32,590 pages receive ~30 million requests per day.</li>
      <li>Identified shortfalls in our Chinese infrastructure, established communication between the Beijing and Landing
        Pages teams, and delivered experimentation and fallback mechanisms in the CN region.</li>
      <li>Worked on CMS and page rendering features, syncing millions of rows of data between DynamoDB and Postgres
        databases and creating UIs for content managers.</li>
      <li>Implemented URL management in Canva's CMS, replacing over 10,000 hardcoded URL strings, increasing TTM and
        decreasing load on engineers.</li>
    </ul>

    <JobTitle class="mt-2" company="Two Bulls" role="Software Engineer (Backend + Frontend)" date-from="2020"
      date-to="2022" :tech="['Vue.js', 'TypeScript', 'Node.js', 'C#', 'Python', 'AWS', 'MySQL', 'DynamoDB']" />
    <ul class="list-disc ml-8">
      <li>Delivered bespoke web applications including <a target="_blank"
          href="https://www.kidsdoconcall.com.au/">KidsDoc</a> telehealth, <a target="_blank"
          href="https://fit.theonetwo.com/">TheOneTwo</a> shopfront, <a target="_blank"
          href="https://www.service.vic.gov.au/services/border-permit/home">Victorian COVID border permits</a> (reached #3
        on the app store!) and the <a target="_blank" href="https://release.me/">Release.Me</a> land sales platform.</li>
      <li>Worked with clients ranging from startups in the inception phase, to state governments to find unique solutions.
      </li>
    </ul>

    <JobTitle class="mt-2" company="Unico" role="Software Engineer (Backend)" date-from="2019" date-to="2020"
      :tech="['Java', 'MySQL', 'Python', 'MATRIXX', 'Linux', 'Docker', 'Spring']" />
    <ul class="list-disc ml-8">
      <li>Performed large scale database migrations (ETL) for prominent
        telecommunications vendors.</li>
      <li>Successfully migrated over 20 million records to the <i>MATRIXX</i> in-memory database in a single day.</li>
      <li>Gained experience in data-intensive systems and concurrency, sensitive data and reverse engineering older
        systems.</li>
    </ul>

    <JobTitle class="mt-2" company="Monash Uni Immersive Analytics Dept" role="Software Engineer (Research)"
      date-from="2017" date-to="2019" :tech="['JavaScript', 'Three.js', 'WebGL', 'Python', 'R']" />
    <ul class="list-disc ml-8">
      <li>Developed a highly performant web application for 2D and 3D
        visualisation of protein complexes and cross-link mass
        spectrometry data using <i>Three.js</i> and <i>WebGL</i>.</li>
    </ul>

    <div class="flex justify-between">
      <div>
        <p class="text-lg mt-2 print:hidden">Inquire to find out more...</p>
        <ul class="list-disc ml-8 print:hidden">
          <li>UAVs</li>
          <li>Cluster computing</li>
          <li>Side projects</li>
        </ul>
        <div class="hidden print:block">
          <br />
          <p class="text-lg">Inquire to find out about:</p>
          <p>Deepfake detection, speech synthesis using style diffusion, mechanistic interpretability</p>
        </div>
      </div>
      <ImageAndText class="contact whitespace-nowrap mt-4" :image="monashLogo" :size="'4rem'">
        <p class="mb-1">Monash University</p>
        <p style="font-style: italic;">Bachelor of Computer Science</p>
      </ImageAndText>
    </div>
  </div>
  <div style="height: 10rem;" class="print:hidden" />
</template>

<style scoped lang="postcss">
.education {
  bottom: -1rem;
}

@media print {
  .resume>.topRow {
    flex-direction: row !important;
    margin-top: 1rem !important;
  }

  /*
  ul {
    padding-left: 1.05rem;

    &>li {
      display: inline;

      &::marker,
      &::after {
        content: ' ';
      }
    }
  }
  */

  .education {
    bottom: -6.5rem;
    right: 1rem;
  }
}

.resume>.topRow {
  flex-direction: column-reverse;
  margin-top: 6rem;
}

@media (min-width: 1024px) {
  .resume>.topRow {
    flex-direction: row;
    margin-top: 2rem;
  }
}
</style>
