<script setup lang="ts">
import Quote from '@/components/Quote.vue'
import BackButton from '@/components/BackButton.vue'

</script>

<template>
  <BackButton />

  <div class="talents px-8 pt-24 md:pt-8" style="max-width: 60rem; margin: 0 auto;">
    <p class="text-xl">Technical Leadership</p>

    <p>My leadership style is focused less on dictating what needs to be done and more on locating existing
      desires amongst other teams and finding concise ways to communicate them to those who will be able to help them. I
      usually work in the following steps:</p>

    <ol class="ml-8 list-disc">
      <li>Understand the existing processes & systems</li>
      <li>Talk to individuals to identify opportunities</li>
      <li>Consolidate feedback and coordinate goal setting</li>
      <li>Provide technical expertise to get the work done</li>
    </ol>

    <p>Sometimes this happens on a large scale. E.g. when I brought together the landing pages, china, and SEO teams at
      Canva to create a framework for running experiments to see which web pages resulted in the most subscriptions in
      the
      China region. Other times it happens on a small scale, like when I noticed a few people asking for a way to manage
      a
      roster of on-call partnerships and wrote a tool to generate a roster of rotating pairs to facilitate collaboration
      and define ownership when faults happen.</p>

    <p class="text-xl mt-4">Infrastructure and data-driven systems</p>

    <p>Often, the most valuable thing I have done is to ask the right questions. Following the above process often
      reveals
      that the crucial problems in a business are already well known. However when these problems are not comunicated to
      those with the power to act on them, or resources have not been devoted to understand them deeply enough to come
      up with a plan to solve them, having a technical background in infrastructure and data-driven is crucial. Why?</p>

    <Quote class="mx-4"
      quotation="Any organization that designs a system (defined broadly) will produce a design whose structure is a copy of the organization's communication structure."
      author="Melvin E. Conway" />

    <p>For me, this quote has rung true across many organisations I have worked in. By taking the time to understand
      flow of datain a company and the architecture of a software product, you can glean
      valuable insights into where cross-cutting concerns may be found, and where the greatest opportunities to
      deliver value lie.<sup class="italic">1</sup></p>

    <p class="text-xl mt-4">Personal skills</p>

    <p>Making these analyses is key, but you must be able to communicate in a constructive, concise way. I like to be
      the one to spend time gathering data, so that I can present it in a condensed form for others to make their own
      judgement. However, it is also important to provide regular opportunities for invested parties to feel heard, so
      that no one feels ambushed when it does come time to make a decision.
      Being able to guide a conversation and address any unspoken anxieties or frustrations is something I think us
      engineers are stereotypically bad at, yet something crucial to our practice.</p>

    <p class="text-xl mt-4">Technical adaptability</p>

    <p>What is the measure of a great engineer? To me, it is someone who has accrued a wide array of experience, and is
      able to pick up new specialties to fill the gaps where others are weakest. I'm still on my journey to becoming a
      truly great engineer, but on the way so far I have tried to get experience in as many different areas as I can.
      Graphics programming, embeded systems, cluster computing, machine learning. Different languages, infrastructure
      tools, CI tools, cloud providers, frontend framworks, backend framworks, testing frameworks. I can talk about all
      these areas because I made it my agenda to learn new things and find the best tools for the job, not just stick to
      what works.</p>

    <p>My dream is to be a jack of all trades who can confidently work on any codebase and any problem, or at least who
      can learn new tricks faster than new paradigms are invented.</p>

    <div style="font-size: 0.75rem;">
      <hr class="mt-8" size="1" />
      <p class="italic my-2">1: This is a commonly quoted passage, and although Mr Conway was talking about
        communication
        structures within organisations, I think it holds for data flow in distributed systems. You can read his full
        paper <a target="_blank" href="https://www.melconway.com/Home/pdf/committees.pdf">How Do Committees Invent?</a>
        for more details.</p>
    </div>
    <div class="py-16"></div>

  </div>
</template>
