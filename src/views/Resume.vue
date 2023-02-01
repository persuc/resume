<script setup lang="ts">
import faceImage from '@/assets/face.png'
import monashLogo from '@/assets/monash.png'
import ImageAndText from '@/components/ImageAndText.vue'
import CopyButton from '@/components/CopyButton.vue'
import Header from '@/components/Header.vue'
import IconDownload from '@/components/icons/IconDownload.vue';
import { EMAIL, PHONE } from '@/ts/constants'

</script>

<template>
  <Header class="no-print">
    <a href="/andrew_persic_resume.pdf" download>
      <div class="button">
        <IconDownload class="mr-2" />Download
      </div>
    </a>
  </Header>

  <div class="resume px-8" style="max-width: 60rem; margin: 0 auto;">
    <div class="mt-4 flex space-between topRow" style="height: 2.1rem;" >
      <h1 class="mb-0">
        Skills
      </h1>
      <ImageAndText class="contact nowrap mt-4" :image="faceImage" :rounded="true">
        <p class="mb-0" style="line-height: 1em;">Andrew Persic</p>
        <CopyButton :value="EMAIL" style="line-height: 1.5em;">{{ EMAIL }}</CopyButton>
        <CopyButton :value="PHONE" style="line-height: 1.2em;">{{ PHONE }}</CopyButton>
      </ImageAndText>
    </div>
    
    <h3 class="mt-2">Technical Leadership</h3>
    <p>Have built relationships and led initiatives across other teams to target cross-cutting concerns and deliver broader value. My leadership style is asking questions based on a solid understanding of business processes and software architecture, and facilitating communication to come up with key goals.
    </p>
    
    <h3 class="mt-2">Engineering</h3>
    <p>Experienced with high scale data-intensive workloads across different regions and database architectures. Highly competent in <i>Java</i>, <i>AWS</i>, <i>Terraform</i>, <i>TypeScript</i> and <i>Vue.js</i>.</p>

    <h3>Personal</h3>
    <p>I always come to work with a smile since I enjoy the work I do, and I love the people who gravitate towards tech. I don’t mind working under pressure, always better to be too busy than bored.
    </p>

    <h1 class="mt-4 mb-0">
      Relevant Experience
    </h1>

    <div class="flex space-between">
      <h3>Canva • Senior Software Engineer</h3><i>October 2021 - Current</i>
    </div>

    <ul>
      <li>Managed all landing pages on <a target="_blank" href="https://www.canva.com/">canva.com</a> and <a target="_blank" href="https://www.canva.cn/">canva.cn</a>. On average these pages receive 30 million requests per day.</li>
      <li>Led projects to enable experimentation and fallback mechanisms in the China region.</li>
      <li>Worked on CMS and page rendering backend features in <i>Typescript</i> and <i>Java</i>, including syncing millions of rows of data between DynamoDB and Postgres databases.</li>
      <li>Led the initiative to let content managers configure page URLs, increasing TTM and decreasing load on engineering teams.</li>
    </ul>

    <div class="flex space-between mt-2">
      <h3>Two Bulls • Full-Stack Engineer</h3><i>January 2020 - October 2021</i>
    </div>
    <ul>
      <li>Built numerous web applications with Vue frontend and Serverless / Typescript backend, including deployment using AWS services.</li>
      <li>Projects include: <a target="_blank" href="https://www.kidsdoconcall.com.au/">KidsDoc telehealth</a>, <a target="_blank" href="https://fit.theonetwo.com/">TheOneTwo</a> shopfront, <a target="_blank" href="https://www.service.vic.gov.au/services/border-permit/home">Victorian COVID border permits</a> (reached #3 on the app store!) and the <a target="_blank" href="https://release.me/">Release.Me</a> land sales platform.</li>
    </ul>

    <div class="flex space-between mt-2">
      <h3>Unico • Associate Developer</h3><i>January 2019 - January 2020</i>
    </div>
    <ul>
      <li>Performed database migrations / ETL for large telecommunications vendors</li>
      <li>Wrote <i>Java / Spring</i> applications to move databases of up to 20 million records to the <i>MATRIXX</i> in-memory database</li>
      <li>Gained experience in data-intensive systems and concurrency, plus conducting thorough testing to secure personal data and reverse engineer older systems.</li>
    </ul>

    <div class="flex space-between mt-2">
      <h3>Monash University Immersive Analytics Team • Developer</h3><i>July 2017 - January 2019</i>
    </div>
    <ul>
      <li>Developed a highly performant web application for 2D and 3D visualisation of protein complexes and cross-link mass
spectrometry data using <i>Three.js</i> and <i>WebGL</i></li>
    </ul>

    <h3 class="mt-2 no-print">Inquire to find out more...</h3>
    <ul>
      <li class="only-print">Inquire to find out more: </li>
      <li>UAVs</li>
      <li>Cluster computing competitions</li>
      <li>Side projects</li>
    </ul>

    <ImageAndText class="education absolute r-0" :image="monashLogo" :size="'4rem'">
      <p class="mb-0" >Monash University</p>
      <p class="mb-2" style="font-style: italic;">Bachelor of Computer Science</p>
    </ImageAndText>
  </div>
  <div style="height: 10rem;" class="no-print" />
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 1.5rem;
}

h3 {
  font-size: 1.2rem;
}

.education {
  bottom: -1rem;
}

@media print{    
  .resume > .topRow {
    flex-direction: row !important;
  }

  ul > li {
    display: inline;
    &::after {
      content: ' ';
    }
  }

  .education {
    bottom: -6.5rem;
    right: 1rem;
  }
}

.resume > .topRow {
  flex-direction: column-reverse;
}

@media (min-width: 1024px) {
  .resume > .topRow {
    flex-direction: row;
  }
}
</style>
