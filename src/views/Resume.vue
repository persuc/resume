<script setup lang="ts">
import faceImage from '@/assets/face.png'
import monashLogo from '@/assets/monash.png'
import ImageAndText from '@/components/ImageAndText.vue'
import CopyButton from '@/components/CopyButton.vue'
import Header from '@/components/Header.vue'
import IconDownload from '@/components/icons/IconDownload.vue'
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
        <p class="mb-1" style="line-height: 1em;">Andrew Persic</p>
        <CopyButton :value="EMAIL" style="line-height: 1.5em;">{{ EMAIL }}</CopyButton>
        <br />
        <CopyButton :value="PHONE" style="line-height: 1.2em;">{{ PHONE }}</CopyButton>
      </ImageAndText>
    </div>
    
    <h3 class="mt-2">Technical Leadership</h3>
    <p>I build relationships and lead initiatives across multiple teams to target cross-cutting concerns. My leadership style is asking questions based on a solid understanding of business processes and software architecture, then facilitating communication to define goals. I enjoy mentoring, with the aim of helping more junior engineers hone their skills so they can deliver projects without relying on other teams.
    </p>
    
    <h3 class="mt-2">Engineering</h3>
    <p>Experienced with high scale, data-intensive workloads across different regions and architectures. Highly competent in web technologies such as <i>Node.js</i>, <i>Vue.js</i> &amp; <i>React</i>. Backend expertise includes <i>AWS</i>, <i>Terraform</i>, <i>Java</i> and <i>SQL</i> + <i>NoSQL</i> databases.</p>

    <h1 class="mt-4 mb-0">
      Relevant Experience
    </h1>

    <JobTitle company="Canva" role="Senior Software Engineer (Full Stack)" date-from="2022" date-to="Current" :tech="[ 'TypeScript', 'React', 'Java', 'Terraform', 'AWS', 'GraphQL', 'Protobuf', 'PostgreSQL', 'DynamoDB' ]" />
    <ul>
      <li><b class="only-print">Role: </b>Managed all pages on <a target="_blank" href="https://www.canva.com/">canva.com</a> and <a target="_blank" href="https://www.canva.cn/">canva.cn</a>. These 32,590 pages receive ~30 million requests per day.</li>
      <li>Led projects to enable page experimentation and fallback mechanisms in the China region.</li>
      <li>Worked on CMS and page rendering features, syncing millions of rows of data between DynamoDB and Postgres databases and creating UIs for content managers.</li>
      <li>Implemented URL management in Canva's CMS, replacing over 10,000 hardcoded URL strings, increasing TTM and decreasing load on engineers.</li>
    </ul>

    <JobTitle class="mt-2" company="Two Bulls" role="Software Engineer (Full Stack)" date-from="2020" date-to="2022" :tech="[ 'Vue.js', 'TypeScript', 'Node.js', 'C#', 'python', 'AWS', 'MySQL', 'DynamoDB' ]" />
    <ul>
      <li><b class="only-print">Role: </b>Built numerous web applications with Vue frontend and Serverless / Typescript backend, deployed with AWS.</li>
      <li>Created a framework for bootstrapping web projects at Two Bulls, which is still used today</li>
      <li>Projects include: <a target="_blank" href="https://www.kidsdoconcall.com.au/">KidsDoc</a> telehealth, <a target="_blank" href="https://fit.theonetwo.com/">TheOneTwo</a> shopfront, <a target="_blank" href="https://www.service.vic.gov.au/services/border-permit/home">Victorian COVID border permits</a> (reached #3 on the app store!) and the <a target="_blank" href="https://release.me/">Release.Me</a> land sales platform.</li>
    </ul>

    <JobTitle class="mt-2" company="Unico" role="Software Engineer (Backend)" date-from="2019" date-to="2020" :tech="[ 'Java', 'MySQL', 'python', 'MATRIXX', 'Linux', 'Docker', 'Spring' ]" />
    <ul>
      <li><b class="only-print">Role: </b>Performed database migrations (ETL) for large telecommunications vendors.</li>
      <li>Wrote <i>Java / Spring</i> applications to move databases of up to 20 million records to the <i>MATRIXX</i> in-memory database.</li>
      <li>Gained experience in data-intensive systems and concurrency, sensitive data and reverse engineering older systems.</li>
    </ul>

    <JobTitle class="mt-2" company="Monash Uni Immersive Analytics" role="Software Engineer (Research)" date-from="2017" date-to="2019" :tech="[ 'JavaScript', 'Three.js', 'WebGL', 'python', 'R' ]" />
    <ul>
      <li><b class="only-print">Role: </b>Developed a highly performant web application for 2D and 3D visualisation of protein complexes and cross-link mass
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

  ul {
    padding-left: 1.05rem;
    & > li {
      display: inline;
      &::marker, &::after {
        content: ' ';
      }
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
