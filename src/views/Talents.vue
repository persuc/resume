<script setup lang="ts">
import Header from '@/components/Header.vue'
import Quote from '@/components/Quote.vue'

</script>

<template>

  <Header />

  <div class="talents px-8 pt-8" style="max-width: 60rem; margin: 0 auto;">
    <p class="text-xl">Foundation: Technical Leadership</p>

    <p>My technical leadership style is focused less on dictating what needs to be done and more on locating existing desires amongst partner teams and acting as a coordinator for others to rally around to achieve all of their goals in a holistic and coordinated way. I usually work in the following steps:</p>

    <ol class="ml-8 list-disc">
      <li>Understand the existing processes & systems</li>
      <li>Talk to individuals to identify opportunities</li>
      <li>Consolidate feedback and coordinate goal setting</li>
      <li>Provide technical expertise to address cross-cutting concerns</li>
    </ol>

    <p>Sometimes this happens on a large scale. E.g. when I brought together the landing pages, china, and SEO teams at Canva to create a framework for running experiments to see which web pages resulted in the most subscriptions in the China region. Other times it happens on a small scale, like when I noticed a few people asking for a way to manage a roster of on-call partnerships and helped write down some pairs of team members to facilitate collaboration and define ownership when faults happen.</p>

    <p class="text-xl mt-4">Complementary skills: Infrastructure and data-driven systems</p>

    <p>Often, the most valuable thing I have done is to ask the right questions. Following the above process often reveals that the crucial problems in a business are already well known. However when these problems are hidden or are poorly understood, having a technical background in infrastructure and data-driven is crucial. Why?</p>

    <Quote class="mx-4" quotation="Any organization that designs a system (defined broadly) will produce a design whose structure is a copy of the organization's communication structure." author="Melvin E. Conway"/>

    <p>It is my belief that by understanding the flow of data, and the architecture of a software product, you can glean valuable insights into where cross-cutting concerns may be found, and thus where the greatest opportunities to deliver value lie.<sup class="italic">1</sup></p>

    <p class="text-xl mt-4">Complementary skills: Personal skills</p>

    <p>All of this assumes that you are able to communicate in a constructive way! There are always delicacies because we as people are invested in the system we build. Everything from de-prioritising a request (even if it is the right thing for the business as a whole) to who spends the most time talking in a meeting must be handled with care. Being able to guide a conversation and address any unspoken anxieties or frustrations is something I think us engineers are stereotypically bad at, yet something crucial to our practice.</p>

    <div style="font-size: 0.75rem;">
      <hr class="mt-8" size="1" />
      <p class="italic my-2">1: This is a commonly quoted passage, and although Mr Conway was talking about communication structures within organisations, I think it holds for data flow in distributed systems. You can read his full paper <a target="_blank" href="https://www.melconway.com/Home/pdf/committees.pdf">How Do Committees Invent?</a> for more details.</p> 
    </div>

  </div>
</template>
