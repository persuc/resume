<script setup lang="ts">
import Component from '@/components/Component.vue'
import Codeblock from '@/components/Codeblock.vue'
import Header from '@/components/Header.vue'
import Button from '@/components/Button.vue'

const usageCode = `<script>
  import Button from '@/components/Button.vue'
</${'script'}>
<template>
  <Story :component="Button" />
</template>`

const implementationCode = `<script>
interface Props {
  component: Component,
}
const props = defineProps<Props>()

// Extract the component's name from its filepath, since sometimes __name is unset
const name = props.component.__file.match(/.*\/([A-z]+)\.vue/)[1]

</${'script'}>

<!-- Render the component, it's name, and controls for the props -->
<template>
  <h1>{{ name }}</h1>
  <!-- We'll work out the controls in a moment -->
  <ControlsForProps :props="boundProps" />
  <component :is="component" v-bind="boundProps" />
</template>
`

const controlsCode = `<script>
  // other Story code...

  /*
   * Assume props.component.props looks like:
   * [{
   *   name: "label",
   *   type: "String",
   * }]
   */

  const typeToDefaultValue = {
    'Boolean': false,
    'String': '',
    'Number': 0,
    'Array': []
  }

  const typeToInputType = {
    Boolean: 'checkbox',
    String: 'text',
    Number: 'number',
  }

  /**
   * Examine the component's props and create an object with default values that we can bind controls to
   */
  const boundProps = reactive(
    Object.entries(props.component.props)
      .reduce((acc, val) => ({
        ...acc,
        [val[0]]: typeToDefaultValue[val[1].type]
      }), {})
  )
</${'script'}>

<template>
  <!-- other Story code... -->
  <input
    v-for="prop in props.component.props"
    :type="typeToInputType[prop.type]"
    v-model="boundProps[prop.name]"
  />
</template>`

const slotCode = `const slots: string[] = []
for (const s of props.component.render.toString().matchAll(/_renderSlot\(.*, "(.*)"/g)) {
  slots.push(s[1])
}`

const slotTemplate = `<component :is="component" v-bind="boundProps">
  <template v-for="slot in slots" v-slot:[slot]>
    slot: {{ slot }}
  </template>
</component>`

</script>

<template>

  <Header back-route="/blog" />

  <article class="article px-8 pt-8" style="max-width: 60rem; margin: 0 auto;">
    
    <p class="text-3xl">Do It Yourself: Vue Stories</p>

    <p>Welcome to the DIY series where we explore how to implement common framework features from scratch. This series is intended as a learning exercise, not necessarily what you should aim for in production. Today we are looking at component stories, such as those provided by <a target="_blank" href="https://en.algorithmica.org/">Storybook.js</a> and <a target="_blank" href="https://histoire.dev/">Histoire</a>.</p>

    <p>Here is an example of what we will be building:</p>

    <Component
      :component="Button"
      :defaults="{}"
      class="mb-4"
    />
    <br />

    <p>Usage:</p>

    <Codeblock label="Stories.vue" language="html" :code="usageCode" />

    <br />

    <p>Implementation:</p>

    <Codeblock label="Story.vue" language="html" :code="implementationCode" />

    <br />

    <p>Now we have a way of rendering an arbitrary component as a story, but it would be good to have some controls people can use to play with how it behaves. This is accomplished simply enough by mapping each of the basic data types to a simple <code>&lt;input&gt;</code> element.</p>

    <Codeblock label="Story.vue (cont.)" language="html" :code="controlsCode" />

    <br />

    <p class="text-xl">Get a list of Vue component slots at runtime</p>

    <p>But what about slots? A couple of people <a target="_blank" href="https://stackoverflow.com/questions/55613651/get-list-of-slot-names-from-vue-template">[1]</a> <a target="_blank" href="https://stackoverflow.com/questions/50545561/how-to-list-all-available-slots-in-vue-component">[2]</a> have asked how to access slots of a component at runtime, and unfortunately there is no good answer at the time of posting. In order to obtain which slots a component is capable of rendering, the best solution I have found is to parse the component's render function using regex to extract the slot names.</p>

    <Codeblock label="Extract slot names" language="javascript" :code="slotCode" />

    <br />

    <Codeblock label="Bind to template using dynamic slots" language="html" :code="slotTemplate" />

    <br />

    <p>This will populate each component with a label in each of its slots. See the <a target="_blank" href="https://github.com/persuck/resume/blob/master/src/components/Component.vue">complete implementation</a> on GitHub which includes some things that were omitted here for simplicity. See the <a href="/components">stories for this website</a> to see more examples of what you can achieve with less that 100 lines of code.
    </p>

    <p class="text-xl mt-8">Random learnings along the way</p>
    <p>The most difficult part of this project was obtaining a list of a component's slots. You may remember the <a target="_blank" href="https://vuejs.org/api/component-instance.html#slots"><code>$slots</code> property on the component instance</a>. However, this only tells you the slots that have actually been populated by the parent component, not the total list of slots that the component can support rendering.</p>

    <p>I also looked into Storybook to see how they introspect slots, but actually <a target="_blank" href="https://github.com/storybookjs/storybook/blob/next/code/renderers/vue3/src/render.ts">they don't bother</a> - they let users pass which slots they want to render in their stories. Not a bad solution, but I would rather have my library give me some default examples. (In case you're wondering what that Args argument looks like, and whether it contains a description of the slots, <a target="_blank" href="https://github.com/ComponentDriven/csf/blob/master/src/story.ts">it doesn't</a>.)</p>

    <p>Vue has some <a target="_blank" href="https://vuejs.org/guide/extras/render-function.html#rendering-slots">documentation</a> about how slots are rendered, but still no information about where they are recorded.</p>

    <p>Eventually what allowed me to crack the code was <a target="_blank" href="">this blog post</a> entitled "Diving into the Virtual DOM" by <a target="_blank" href="https://vuejs-course.com/">vuejs-course.com</a>, which talked in depth about component rendering and eventually led me to look into the <a target="_blank" href="https://github.com/vuejs/devtools/">Vue devtools repo</a> which finally provided the answer in their <a target="_blank" href="https://github.com/vuejs/devtools/blob/main/packages/app-backend-vue2/src/index.ts"><code>getComponentRenderCode()</code> API</a>.</p>

  <div class="my-16 py-16"></div>

  </article>
</template>
