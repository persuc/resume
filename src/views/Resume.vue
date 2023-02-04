<script setup lang="ts">
import faceImage from '@/assets/face.png'
import monashLogo from '@/assets/monash.png'
import ImageAndText from '@/components/ImageAndText.vue'
import CopyButton from '@/components/CopyButton.vue'
import Header from '@/components/Header.vue'
import IconDownload from '@/components/icons/IconDownload.vue';
import { EMAIL, PHONE } from '@/ts/constants'
import JobTitle from '@/components/JobTitle.vue'

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
    <div class="flex space-between topRow" style="height: 2.1rem;" >
      <h1 class="mb-0">
        Skills
      </h1>
      <ImageAndText class="contact nowrap mt-4" :image="faceImage" :rounded="true">
        <p class="mb-0" style="line-height: 1em;">Andrew Persic</p>
        <CopyButton :value="EMAIL" style="line-height: 1.5em;">{{ EMAIL }}</CopyButton>
        <br />
        <CopyButton :value="PHONE" style="line-height: 1.2em;">{{ PHONE }}</CopyButton>
      </ImageAndText>
    </div>
    
    <h3 class="mt-2">Technical Leadership</h3>
    <p>I build relationships and lead initiatives across multiple teams to target cross-cutting concerns. My leadership style is asking questions based on a solid understanding of business processes and software architecture, then facilitating communication to define goals.
    </p>
    
    <h3 class="mt-2">Engineering</h3>
    <p>Experienced with high scale data-intensive workloads across different regions and database architectures. Highly competent in <i>Java</i>, <i>AWS</i>, <i>Terraform</i>, <i>TypeScript</i> and <i>Vue.js</i> + many types of databases.</p>

    <h3>Personal</h3>
    <p>I always come to work with a smile since I enjoy the work I do, and I love the people who gravitate towards tech. I don’t mind working under pressure, always better to be too busy than bored.
    </p>

    <h1 class="mt-4 mb-0">
      Relevant Experience
    </h1>

    <JobTitle company="Canva" role="Senior Software Engineer (Backend)" date-from="October 2021" date-to="Current" />
    <ul>
      <li>Managed all landing pages on <a target="_blank" href="https://www.canva.com/">canva.com</a> and <a target="_blank" href="https://www.canva.cn/">canva.cn</a>. On average these pages receive 30 million requests per day.</li>
      <li>Led projects to enable experimentation and fallback mechanisms in the China region.</li>
      <li>Worked on CMS and page rendering backend features in <i>Typescript</i> and <i>Java</i>, including syncing millions of rows of data between DynamoDB and Postgres databases.</li>
      <li>Led the initiative to let content managers configure page URLs, increasing TTM and decreasing load on engineering teams.</li>
    </ul>

    <JobTitle class="mt-2" company="Two Bulls" role="Software Engineer (Full Stack)" date-from="January 2020" date-to="October 2021" />
    <ul>
      <li>Built numerous web applications with Vue frontend and Serverless / Typescript backend, including deployment using AWS services.</li>
      <li>Projects include: <a target="_blank" href="https://www.kidsdoconcall.com.au/">KidsDoc telehealth</a>, <a target="_blank" href="https://fit.theonetwo.com/">TheOneTwo</a> shopfront, <a target="_blank" href="https://www.service.vic.gov.au/services/border-permit/home">Victorian COVID border permits</a> (reached #3 on the app store!) and the <a target="_blank" href="https://release.me/">Release.Me</a> land sales platform.</li>
    </ul>

    <JobTitle class="mt-2" company="Unico" role="Software Engineer (Backend)" date-from="January 2019" date-to="January 2020" />
    <ul>
      <li>Performed database migrations / ETL for large telecommunications vendors.</li>
      <li>Wrote <i>Java / Spring</i> applications to move databases of up to 20 million records to the <i>MATRIXX</i> in-memory database.</li>
      <li>Gained experience in data-intensive systems and concurrency, plus conducting thorough testing to secure personal data and reverse engineer older systems.</li>
    </ul>

    <JobTitle class="mt-2" company="Monash Uni Immersive Analytics" role="Software Engineer (Research)" date-from="July 2017" date-to="January 2019" />
    <ul>
      <li>Developed a highly performant web application for 2D and 3D visualisation of protein complexes and cross-link mass
spectrometry data using <i>Three.js</i> and <i>WebGL</i>.</li>
    </ul>

    <h3 class="mt-2 no-print">Inquire to find out more...</h3>
    <ul class="no-print">
      <li>UAVs</li>
      <li>Cluster computing</li>
      <li>Side projects</li>
    </ul>
    <br class="only-print" />
    <span class="only-print">Inquire to find out about: UAVs, cluster computing, side projects.</span>

    <div class="no-print flex" style="height: 4.5rem;">&nbsp;</div>

    <ImageAndText class="education absolute l-4" :image="monashLogo" :size="'4rem'">
      <p class="mb-0" >Monash University</p>
      <p class="mb-2" style="font-style: italic;">Bachelor of Computer Science</p>
    </ImageAndText>
  </div>
  <div style="height: 10rem;" class="no-print" />
</template>

<style scoped lang="postcss">
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
    margin-top: 1rem !important;
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
  margin-top: 6rem;
}

@media (min-width: 1024px) {
  .resume > .topRow {
    flex-direction: row;
    margin-top: 2rem;
  }
}
</style>
