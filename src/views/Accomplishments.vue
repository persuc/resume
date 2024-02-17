<script setup lang="ts">
import Expand from '@/components/Expand.vue'
import BackButton from '@/components/BackButton.vue'

</script>

<template>
  <BackButton />

  <div class="accomplishments px-8 pt-24 md:pt-8" style="max-width: 60rem; margin: 0 auto;">

    <p class="text-xl">Canva: Fallback & Experiments</p>

    <ul class="list-disc ml-8">
      <li>Identified pain points in the China region Pages go down without a fallback or being unable to test new
        designs for canva.com's pages</li>
      <li>Set up communication with China, Conversion Rate Optimisation and Landing Page teams to define goals</li>
      <li>Deployed a proxy service, landing page caching mechanism, and experiments config service in the China region
      </li>
      <li>Success metrics: Reduced number of 404s in the China region to near 0 and contributed to conversion rate
        improvement of 6% that year</li>
    </ul>

    <Expand class="ml-4 my-2" label="Read more" expanded-label="Read less">
      <div class="ml-2">
        <p>When I arrived at Canva the China region as a whole was somewhat neglected. Unfortunately, this is also
          Canva's fastest growing customer base, so letting our CN landing pages fall behind the US looked like a huge
          mistake. To enable these features I had to deploy a proxy service in the China region, responsible for looking
          at each incoming request and either passing it to the page rendering service or serving a cached version. This
          entailed:</p>
        <ol class="list-decimal ml-8">
          <li>Setting up a new ECS Fargate deployment for an Nginx instance in the CN AWS region</li>
          <li>Refactoring our existing Nginx configuration to support multiple environments</li>
          <li>Creating a scraper and S3 bucket to cache pages so they can be used for fallback</li>
        </ol>
        <p>Only once this preliminary work was complete could I actually reach out to the feature control team and begin
          working on an experimentation framework for testing different page layouts and reporting back on their
          performance in terms of conversion rate, average time spent on the page, and technical metrics such as TTL.
        </p>
      </div>
    </Expand>

    <p class="text-xl">Canva: CMS → Rendering Service Sync</p>

    <ul class="list-disc ml-8">
      <li>Built relationships with content managers, revealing that there is no retry mechanism for errors syncing data
        from the CMS to the landing page rendering service</li>
      <li>Set up communication with CMS team, SEO and Landing Page teams to define goals</li>
      <li>Deployed a message queue to contain sync operations between CMS and rendering service.</li>
      <li>Added error reporting using a dead letter queue and UI tools to inspect and retry failed sync operations</li>
      <li>Success metrics: Able to sync millions of rows of landing page data without intervention from engineers if
        there are conflicts between edits or data consistency issues</li>
    </ul>

    <p class="text-xl">This site!</p>

    <ul class="list-disc ml-8">
      <li>Built and deployed in a few hours with Vue 3 + Vite + Tailwind + Cloudflare Pages</li>
      <li>See the code on <a target="_blank" href="https://github.com/andrew-p-dev/resume">GitHub</a></li>
    </ul>

    <div class="py-16"></div>
  </div>
</template>
