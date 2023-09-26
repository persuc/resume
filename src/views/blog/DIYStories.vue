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

    <p>This will populate each component with a label in each of its slots. See the complete implementation for more features such as: controls for slots, controls for array props, and some omissions that were not included here for simplicity.</p>

    <!-- I first looked into Storybook to see how they introspect slots, but actually they don't bother -->
    <!-- https://github.com/storybookjs/storybook/blob/a3cdabb025524822807318bc137f69be006596c2/code/renderers/vue3/src/render.ts -->
    <!-- https://github.com/search?q=repo%3Astorybookjs%2Fstorybook%20getSlots&type=code -->
    <!-- https://github.com/ComponentDriven/csf/blob/4c735fea4f0c9605b93497238303cb4ab9304727/src/story.ts -->

    <!-- https://vuejs.org/guide/extras/render-function.html#rendering-slots -->

    <!-- https://vuejs-course.com/blog/diving-into-the-virtual-dom -->
    <!-- https://github.com/vuejs/devtools/blob/122207de2ed79d839c572438b095ce3f5ea1fed9/packages/app-backend-vue2/src/index.ts#L70 -->

  <div class="my-16 py-16"></div>

  </article>
</template>
