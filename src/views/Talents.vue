<script setup lang="ts">
import Header from '@/components/Header.vue'
import Quote from '@/components/Quote.vue'

</script>

<template>

  <Header />

  <div class="talents px-8 pt-8" style="max-width: 60rem; margin: 0 auto;">
    <p class="text-xl">Foundation: Technical Leadership</p>
    

    <p>My technical leadership style is focused less on dictating what needs to be done and more on locating existing desires amongst partner teams and acting as a coordinator for others to rally around to achieve all of their goals in a holistic and coordinated way. I usually work in the following steps:</p>

    <ol>
      <li>Understand the existing processes & systems</li>
      <li>Talk to individuals to identify opportunities</li>
      <li>Consolidate feedback and coordinate goal setting</li>
      <li>Provide technical expertise to address cross-cutting concerns</li>
    </ol>

    <p>Sometimes this happens on a large scale. E.g. when I brought together the landing pages, china, and SEO teams at Canva to create a framework for running experiments to see which web pages resulted in the most subscriptions in the China region. Other times it happens on a small scale, like when I noticed a few people asking for a way to manage a roster of on-call partnerships and helped write down some pairs of team members to facilitate collaboration and define ownership when faults happen.</p>

    <p class="text-xl">Complementary skills: Infrastructure and data-driven systems</p>

    <p>Often, the most valuable thing I have done is to ask the right questions. Following the above process often reveals that the crucial problems in a business are already well known. However when these problems are hidden or are poorly understood, having a technical background in infrastructure and data-driven is crucial. Why?</p>

    <Quote class="mx-4" quotation="Any organization that designs a system (defined broadly) will produce a design whose structure is a copy of the organization's communication structure." author="Melvin E. Conway"/>

    <p>It is my belief that by understanding the flow of data, and the architecture of a software product, you can glean valuable insights into where cross-cutting concerns may be found, and thus where the greatest opportunities to deliver value lie.<sup class="italic">1</sup></p>

    <p class="text-xl">Complementary skills: Personal skills</p>

    <p>All of this assumes that you are actually able to talk to people in a constructive way! Often times there are subtleties in relationships between teams. If someone is constantly de-prioritising your requests (even if it is the right thing for the business as a whole) you are less likely to want to help them when they ask something of you. Other times the juicy meat of the cross-cutting concerns becomes lost in discussions limited to single individuals or teams. Being able to guide a conversation and address any unspoken anxieties or frustrations is something I think us engineers are stereotypically bad at, yet something crucial to out practice.</p>

    <div class="mt-4" style="font-size: 0.75rem;">
      <hr class="mt-16" size="1" />
      <p class="italic my-2">1: This is a commonly quoted passage, and although Mr Conway was talking about communication structures within organisations, I think it holds for data flow in distributed systems. You can read his full paper <a target="_blank" href="https://www.melconway.com/Home/pdf/committees.pdf">How Do Committees Invent?</a> for more details.</p> 
    </div>

  </div>
</template>
