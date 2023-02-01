<script setup lang="ts">
import Expand from '@/components/Expand.vue'
import Header from '@/components/Header.vue';
import Quote from '@/components/Quote.vue'

</script>

<template>

  <Header />

  <div class="accomplishments px-8 pt-8" style="max-width: 60rem; margin: 0 auto;">
    
    <h2>Canva: Fallback & Experiments</h2>

    <ul>
      <li>Identified pain points in the China region Pages go down without a fallback or being unable to test new designs for canva.com's pages</li>
      <li>Set up communication with China, Conversion Rate Optimisation and Landing Page teams to define goals</li>
      <li>Deployed a proxy service, landing page caching mechanism, and experiments config service in the China region</li>
      <li>Success metrics: Reduced number of 404s in the China region to near 0 and contributed to conversion rate improvement of 6% that year</li>
    </ul>

    <Expand class="ml-4 my-2" label="Read more" expanded-label="Read less">
      <div class="ml-2">
        <p>When I arrived at Canva the China region as a whole was somewhat neglected. Unfortunately, this is also Canva's fastest growing customer base, so letting  looked like a huge mistake. To enable these features I had to deploy a proxy service in the China region, responsible for looking at each incoming request and either passing it to the page rendering service or serving a cached version. This entails:
          <ol>
            <li>Setting up a new ECS Fargate deployment for an Nginx instance in the CN AWS region</li>
            <li>Refactoring our existing Nginx configuration to support mutliple environments</li>
            <li>Creating a scraper and S3 bucket to cache pages so they can be used for fallback</li>
          </ol>
        </p>
      </div>
    </Expand>

    <h2>Canva: CMS → Rendering Service Sync</h2>

    <ul>
      <li>Building relationships with content managers revealed that there is no retry or management process for errors when syncing data from the CMS to the landing page rendering service</li>
      <li>Set up communication with CMS team, SEO and Landing Page teams to define goals</li>
      <li>Deployed a message queue to contain sync operations between CMS and rendering service.</li>
      <li>Added error reporting using a dead letter queue and UI tools to inspect and retry failed sync operations</li>
      <li>Success metrics: Able to sync millions of rows of landing page data without intervention from engineers if there are conflicts between edits or data consistency issues</li>
    </ul>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2rem;
}

h3 {
  font-size: 1.2rem;
}

</style>
