<script setup lang="ts">
import Story from '@/components/Story.vue'
import Codeblock from '@/components/Codeblock.vue'
import Article from '@/components/Article.vue'
import Button from '@/components/Button.vue'

const usageCode = `<Story path="Button" />`

const implementationCode = `<script>
interface Props {
  path: string, // path relative to @/components/ not including .vue extension
}
const props = defineProps<Props>()

// Extract the component's name from its path, since vue instance does not provide names
const name = props.path.match(/(.*\/)?([A-z0-9\-\_]+)/)?.[2]

// Load the component from the provided path
const StoryComponent = defineAsyncComponent(() => import(\`./\${props.path}.vue\`))

</${'script'}>

<!-- Render the component, it's name, and controls for the props -->
<template>
  <h1>{{ name }}</h1>
  <!-- We'll work out the controls in a moment -->
  <ControlsForProps />
  <StoryComponent />
</template>
`

const controlsCode = `<script>
// Earlier scripts here...

// We will populate these once the component has loaded
const componentProps = reactive([])
const boundProps = reactive({})

// a default value for each prop type
// (optionally don't include this if you don't want default values injected)
const typeToDefaultValue = {
  'Boolean': false,
  'String': '',
  'Number': 0,
  'Array': []
}

// what type of control element to create for each prop type
const typeToInputType = {
  Boolean: 'checkbox',
  String: 'text',
  Number: 'number',
}

const StoryComponent = defineAsyncComponent(() => {
  const asyncImport = import(/* @vite-ignore */ \`./\${props.path}.vue\`)
  asyncImport.then(result => {
    // now that the component has loaded, we can parse out the props it supports
    const component = result.default

    // Assume component.props looks like:
    component.props = [{
      name: "label",
      type: "String",
    }]

    componentProps.push(...component.props)

    /**
     * Examine the component's props and create an object
     * with default values that we can bind controls to
     */

    for (const prop of component.props) {
      boundProps[prop.name] = typeToDefaultValue[prop.type]
    }
  })
  return asyncImport
})
</${'script'}>

<template>
  <!-- other Story code... -->

  <!-- the new controls -->
  <input
    v-for="prop in componentProps"
    :type="typeToInputType[prop.type]"
    v-model="boundProps[prop.name]"
  />

  <!-- bind the controls to the story component -->
  <StoryComponent v-bind="boundProps" />
</template>`

const slotCode = `for (const match of component.render.toString().matchAll(/_renderSlot\(.*, "(.*)"/g)) {
  slots.push(match[1])
}`

const slotTemplate = `<StoryComponent v-bind="boundProps">
  <template v-for="slot in slots" v-slot:[slot]>
    slot: {{ slot }}
  </template>
</StoryComponent>`

const passDirectCode = `<script>
import Button from '@/components/Button.vue'
</${'script'}>

<template>
  <Story :component="Button" />
</template>`

const navItems = [
  { href: "/", label: "Back", classes: "lg:mb-3" },
  {
    href: '#top',
    label: 'Top',
  },
  {
    href: '#basic',
    label: 'Rendering components',
  },
  {
    href: '#controls',
    label: 'Creating controls',
  },
  {
    href: '#slots',
    label: 'Populating slots',
  },
  {
    href: '#slot-problems',
    label: 'Thoughts on slots',
  },
  {
    href: '#passing-components',
    label: 'Passing components directly',
  },
]

const componentObjectCode = `{
  "__name": "Button",
  "__file": "/Users/andrew/Documents/resume/src/components/Button.vue",
  "__hmrId": "3c9d0845",
  "props": {
    "text": {
      "required": false
    },
    "disabled": {
      "required": false
    }
  }
}`

</script>

<template>

  <Article :items="navItems" id="top">

    <p class="text-3xl">Do It Yourself: Vue Stories</p>

    <p>Welcome to the DIY series where we explore how to implement common framework features from scratch. This series is intended as a learning exercise, not necessarily what you should aim for in production. Today we are looking at component stories, such as those provided by <a target="_blank" href="https://en.algorithmica.org/">Storybook.js</a> and <a target="_blank" href="https://histoire.dev/">Histoire</a>.</p>

    <p>Here is an example of what we will be building:</p>

    <Story
      path="Button"
      :defaults="{}"
      class="mb-4"
    />
    <br />

    <p>Usage:</p>

    <pre v-highlightjs><code class="html rounded">{{ usageCode }}</code></pre>

    <br />

    <p class="text-xl" id="basic">Rendering stories with dynamic components</p>

    <p>Vue provides a handy feature called <a target="_blank" href="https://vuejs.org/guide/components/async.html">Async Components</a> that we will need to render arbitrary components as stories. Async components <a target="_blank" href="https://vuejs.org/guide/components/registration.html">have their drawbacks</a> , however they are perfect for our use case, where we do not know what component we will be rendering at compile time.
    </p>

    <p>Without further ado, here is a basic implementation loading and rendering a component from a provided path:</p>

    <Codeblock label="Story.vue" language="html" :code="implementationCode" />

    <br />

    <p class="text-xl" id="controls">Creating controls</p>

    <p>Now we have a way of rendering an arbitrary component as a story, but it would be good to have some controls people can use to play with how it behaves. This is accomplished simply enough by mapping each of the basic data types to a simple <code>&lt;input&gt;</code> element.</p>

    <Codeblock label="Story.vue (parsing component props)" language="html" :code="controlsCode" />

    <br />

    <p class="text-xl" id="slots">Get a list of Vue component slots at runtime</p>

    <p>But what about slots? A couple of people <sup><a target="_blank" href="https://stackoverflow.com/questions/55613651/get-list-of-slot-names-from-vue-template">[1]</a> <a target="_blank" href="https://stackoverflow.com/questions/50545561/how-to-list-all-available-slots-in-vue-component">[2]</a></sup> have asked how to access slots of a component at runtime, and unfortunately there is no good answer at the time of posting. In order to obtain which slots a component is capable of rendering, the best solution I have found is to parse the component's render function using regex to extract the slot names.</p>

    <Codeblock label="Extract slot names" language="javascript" :code="slotCode" />

    <br />

    <Codeblock label="Bind to template using dynamic slots" language="html" :code="slotTemplate" />

    <br />

    <p>This will populate each component with a label in each of its slots. See the <a target="_blank" href="https://github.com/persuck/resume/blob/master/src/components/Story.vue">complete implementation</a> on GitHub which includes some things that were omitted here for simplicity. See the <a href="/components">stories for this website</a> to see more examples of what you can achieve with less that 100 lines of code.
    </p>

    <p class="text-xl mt-8" id="slot-problems">Difficulties obtaining slots</p>

    <p>The most difficult part of this project was obtaining a list of a component's slots. You may remember the <a target="_blank" href="https://vuejs.org/api/component-instance.html#slots"><code>$slots</code> property on the component instance</a>. However, this only tells you the slots that have actually been populated by the parent component, not the total list of slots that the component can support rendering.</p>

    <p>I also looked into Storybook to see how they introspect slots, but actually <a target="_blank" href="https://github.com/storybookjs/storybook/blob/next/code/renderers/vue3/src/render.ts">they don't bother</a> - they let users pass which slots they want to render in their stories. Not a bad solution, but I would rather have my library give me some default examples. (In case you're wondering what that Args argument looks like, and whether it contains a description of the slots, <a target="_blank" href="https://github.com/ComponentDriven/csf/blob/master/src/story.ts">it doesn't</a>.)</p>

    <p>Vue has some <a target="_blank" href="https://vuejs.org/guide/extras/render-function.html#rendering-slots">documentation</a> about how slots are rendered, but still no information about where they are recorded.</p>

    <p>Eventually what allowed me to crack the code was <a target="_blank" href="">this blog post</a> entitled "Diving into the Virtual DOM" by <a target="_blank" href="https://vuejs-course.com/">vuejs-course.com</a>, which talked in depth about component rendering and eventually led me to look into the <a target="_blank" href="https://github.com/vuejs/devtools/">Vue devtools repo</a> which finally provided the answer in their <a target="_blank" href="https://github.com/vuejs/devtools/blob/main/packages/app-backend-vue2/src/index.ts"><code>getComponentRenderCode()</code> API</a>.</p>

    <p class="text-xl mt-8" id="passing-components">Passing components directly</p>

    <p>You may wonder if it is possible to import components and pass them directly to <code>Story</code>, as below:</p>

    <pre v-highlightjs><code class="html rounded">{{ passDirectCode }}</code></pre>

    <p>This is possible, however the shape of a component imported this way does not contain that much useful metadata:</p>

    <pre v-highlightjs><code class="javascript rounded">{{ componentObjectCode }}</code></pre>

    <p>These properties look promising, but in production <code>__name</code> and <code>__file</code> are stripped, leaving only the props as useful information. There is no mapping from this object to actual VNodes rendered on the page, or to the slots, component name, or import path as far as I can tell.</p>

  </Article>
</template>
