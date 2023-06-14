<script setup lang="ts">
import { EMAIL, PHONE } from '@/ts/constants'
import faceImage from '@/assets/face.png'
import ImageAndText from '@/components/ImageAndText.vue'
import CopyButton from '@/components/CopyButton.vue'
import Header from '@/components/Header.vue'
import JobTitle from '@/components/JobTitle.vue'
import Icon from '@/components/Icon.vue'
import Note from '@/components/Note.vue'

</script>

<template>
  <Header class="no-print">
    <a href="/andrew_persic_resume.pdf" download>
      <div class="button">
        <Icon name="download" class="mr-2" />Download
      </div>
    </a>
  </Header>

  <div class="resume px-8" style="max-width: 60rem; margin: 0 auto;">
    <div class="flex topRow" style="height: 2.1rem; justify-content: end;" >
      <ImageAndText class="contact nowrap mt-4" :image="faceImage" :rounded="true">
        <span>Andrew Persic</span>
        <br />
        <CopyButton :value="EMAIL">{{ EMAIL }}</CopyButton>
      </ImageAndText>
    </div>

    <!-- <h1 class="mt-8">
      Engineering
    </h1>
    
    <p>Experienced with high scale, data-intensive workloads across different regions and architectures. Highly competent in web technologies such as <i>Node.js</i>, <i>Vue.js</i> &amp; <i>React</i>. Backend expertise includes <i>AWS</i>, <i>Terraform</i>, <i>Java</i> and <i>SQL</i> + <i>NoSQL</i> databases.</p> -->

    <h1 class="mt-8">Collaboration, Planning, Execution, and Maintenance</h1>

    <p>Managed all pages on <a target="_blank" href="https://www.canva.com/">canva.com</a> and <a target="_blank" href="https://www.canva.cn/">canva.cn</a>. These 32,590 pages receive ~30 million requests per day. Collaboration and planning to deliver projects such as page experimentation frameworks, fallback mechanisms, and automated URL management.
    </p>

    <Note class="pr-4 pt-0" style="background-color: transparent">
      <JobTitle company="Canva" role="Senior Software Engineer (Full Stack)" date-from="2022" date-to="Current" :tech="[ 'TypeScript', 'React', 'Java', 'Terraform', 'AWS', 'GraphQL', 'Protobuf', 'PostgreSQL', 'DynamoDB' ]" />
      <ul>
        <li>I identified shortfalls in our Chinese infrastructure, established communication between the Beijing and Landing Pages teams, and delivered experimentation and fallback mechanisms in the CN region.</li>
        <li>Worked on CMS and page rendering features, syncing millions of rows of data between DynamoDB and Postgres databases and creating UIs for content managers.</li>
        <li>Implemented URL management in Canva's CMS, replacing over 10,000 hardcoded URL strings, increasing TTM and decreasing load on engineers.</li>
      </ul>
    </Note>

    <p>The best part of this role was mentoring junior engineers in China and seeing them grow to deliver projects on their own.</p>

    <h1>Ability to drive results in a fast-paced and agile organization</h1>

    <p>Working for a digital agency is as fast past as the software world gets. Some contracts were as short as two weeks, where I was expected to be the sole full-stack developer delivering a shopfront with features such as user accounts, surveys, recommendation algorithms and basic data analytics.</p>

    <Note class="pr-4 pt-0" style="background-color: transparent">
      <JobTitle company="Two Bulls" role="Software Engineer (Full Stack)" date-from="2020" date-to="2022" :tech="[ 'Vue.js', 'TypeScript', 'Node.js', 'C#', 'python', 'AWS', 'MySQL', 'DynamoDB' ]" />
      <ul>
        <li>Built numerous web applications with Vue frontend and Serverless / Typescript backend, deployed with AWS.</li>
        <li>Created a framework for bootstrapping web projects lightning fast, which is still used today</li>
        <li>Projects include: <a target="_blank" href="https://www.kidsdoconcall.com.au/">KidsDoc</a> telehealth, <a target="_blank" href="https://fit.theonetwo.com/">TheOneTwo</a> shopfront, <a target="_blank" href="https://www.service.vic.gov.au/services/border-permit/home">Victorian COVID border permits</a> (reached #3 on the app store!) and the <a target="_blank" href="https://release.me/">Release.Me</a> land sales platform.</li>
      </ul>
    </Note>

    <h1>
      3D Math & Linear Algebra
    </h1>

    <h2></h2>

    <p>Linear algebra, vector calculus, and other mathematical concepts have played a large role in my career, having applied them in 2D and 3D protein visualisation software:</p>

    <Note class="pr-4 pt-0" style="background-color: transparent">
      <JobTitle company="Monash Uni Immersive Analytics" role="Software Engineer (Research)" date-from="2017" date-to="2019" :tech="[ 'JavaScript', 'Three.js', 'WebGL', 'python', 'R' ]" />
      <ul>
        <li>Developed a web application for 2D and 3D visualisation of protein complexes and cross-link mass
  spectrometry data using <i>Three.js</i> and <i>WebGL</i>.</li>
      </ul>

    </Note>

    <p class="mt-2">I have continued to develop 2D and 3D graphics applications since then, including in this very repository! See the collision checking code in <a target="_blank" href="https://github.com/andrew-p-dev/resume/blob/master/src/ts/draw-mode/MatterLine.ts#L124">MatterLine.ts</a> or visit <a href="/draw">persic.cloud/draw</a> to see the result.</p>

    <h3 class="mt-2 no-print">Inquire to find out more...</h3>
    <ul class="no-print">
      <li>UAVs</li>
      <li>Cluster computing</li>
      <li>In memory data bases and 22 million rows in 10 minutes</li>
      <li>Side projects</li>
    </ul>
    <br class="only-print" />
    <span class="only-print">Inquire to find out about: UAVs, cluster computing, side projects, in memory databases.</span>

    <div class="no-print flex" style="height: 4.5rem;">&nbsp;</div>
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

ul {
  padding-top: 1rem;
  &>li {
    left: -2.5rem;
    display: inline;
    &::marker, &::after {
      content: ' ';
    }
  }
}

@media print{    
  .resume > .topRow {
    flex-direction: row !important;
    margin-top: 1rem !important;
  }

  ul {
    /* padding-top: 1.05rem; */
    /* & > li {
      display: inline;
    } */
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
