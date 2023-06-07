# Contributing to Super Sicko Draw Mode (name not finalized)

## What is the easiest way to contribute?

There are two easy ways to contribute:
1. Making your own levels (see [How do I make my own levels?](#how-do-i-make-my-own-levels))
2. Making your own themes (see [How do I make my own themes?](#how-do-i-make-my-own-themes))

Larger initiatives include:
1. Making your own worlds (see [How do I make my own worlds?](#how-do-i-make-my-own-worlds))
2. Improving the drawing code for better performance (see [MatterLine.ts](src/ts/draw-mode/MatterLine.ts))
3. Improving the game physics to prevent objects from intersecting / sliding through each other.
4. Adding sound effects / music

## What contributions are accepted?

I will consider all contributions made as pull requests with appropriate details including:
- description of the new feature / bug that has been fixed
- any manual tests conducted
- screenshots

You may also want to include:
- decisions made / explanation of code architecture
- any questions you may have

Feel free to open a PR without any code if you would like to leave suggestions.

## How do I make my own levels?

1. Copy an existing level from [/src/ts/draw-mode/levels/begin](./src/ts/draw-mode/levels/begin) and give it a unique name
2. Choose a world for your level to be in. You can add it to an existing world by dropping it into a subfolder of [/src/ts/draw-mode/levels/](./src/ts/draw-mode/levels/). To create your own world, see [How do I make my own worlds?](#how-do-i-make-my-own-worlds)
3. Add your level to the world's definition, which can be found in the "worlds" attribute inside [LevelPage.vue](src/components/draw-mode/LevelPage.vue)
4. Create a thumbnail for your level. It must be an 800x600 PNG image named the same as your level. Place the image in the world's [public asset folder](public/draw-mode/).
5. Modify the level you copied in step 1 as needed. Modify `MyLevel.ts` as needed, being sure to update the `id` field to `MyLevel` as well as updating the `text` field to tell players what the goal is.

To go over everything in one example, if I added a level called `MyLevel` to the `bloom` world, I would:
1. Copy [src/ts/draw-mode/levels/begin/BallOnCube.ts](src/ts/draw-mode/levels/begin/BallOnCube.ts) to [src/ts/draw-mode/levels/bloom/MyLevel.ts](src/ts/draw-mode/levels/bloom/MyLevel.ts)
2. Edit [LevelPage.vue](src/components/draw-mode/LevelPage.vue) by importing `MyLevel` and adding it to the bloom world data: `createWorldData('bloom', [])` -> `createWorldData('bloom', [ MyLevel ])`
3. Create a thumbnail and place it in [/public/draw-mode/bloom/MyLevel.png](/public/draw-mode/bloom/MyLevel.png)
4. Modify `MyLevel.ts` by updating the `id` field to `MyLevel` as well as updating the `text` field to, for example: `<span>This is my level</span>`. You don't have to use HTML in the `text`, but it is helpful for custom styling

Tips for creating levels:
- The matter-js coordinate system places (0, 0) in the top left of the canvas.
- Every level is 800x600 units (w x h)
- There are many types of objects you can use in levels such as hard-body objects, soft-body objects, ropes, pin joints, areas in which the player cannot draw, and more. See existing levels and [matter.js docs](https://brm.io/matter-js/) for examples.
- There are many ways you can create a win-condition for a level including: when two objects touch, when an object touches any object, when some function on the objects in the level is true, etc. See existing levels and [EndCondition.ts](src/ts/draw-mode/EndCondition.ts) for examples
- There are also helper functions in [BodyUtil.ts](src/ts/draw-mode/BodyUtil.ts) for creating different types of objects
- Try to make levels that you can beat yourself consistently once you have worked out the answer. Levels that incorporate too much random chance are boring to play.
- If you make lots of difficult levels, intersperse some easier levels in between, since a player needs to beat at least half of the levels on a page to unlock the next levels
- Worlds can have any number of levels, but the target number is 18 levels per world

## How do I make my own worlds?

A world is a grouping of levels. To make your own world:
1. Create a new folder in [src/ts/draw-mode/levels](src/ts/draw-mode/levels) and name it what you want your world to be called. This is where the levels for your world will live
2. Edit [LevelPage.vue](src/components/draw-mode/LevelPage.vue) by adding a calling `createWorld()` with your world data. e.g. `createWorldData('my-world', [])`
3. Create a folder with the same name in [public/draw-mode][public/draw-mode]. This is where the thumbnail for your world and its levels will live
4. Create a thumbnail for your world. It must be an 800x600 PNG image named the same as your world. Place the image in the thumbnail folder you created in step 2

Tips for creating worlds:
- Currently only the [begin](src/ts/draw-mode/levels/begin) world is finished, so look there for examples
- It is a good idea to make your own world if you want to make your own levels. Not only will grouping your levels together keep all your work in one place, but it will also help players find all the levels that you have made and help create a theme for each world since levels by the same designer will naturally have more similarity to each other
- You can use AI tools such as [Dezgo](https://dezgo.com/) or [DeepAI](https://deepai.org/machine-learning-model/text2img) to create thumbnails

## How do I make my own themes?

Themes are located in [src/ts/draw-mode/Theme.ts](src/ts/draw-mode/Theme.ts). Adding a new theme is as simple as adding an entry to the object `themes` and setting a value for each colour. [Any css-compatible colour format is allowed](https://brm.io/matter-js/docs/classes/Body.html#property_render.fillStyle), but existing themes use hex format.

## How do I see and edit my save data?

Save data is stored in local storage under the key "DrawModeState". It contains a string representation of a JSON object with all of the users preferences and progress. See [src/ts/draw-mode/State.ts](src/ts/draw-mode/State.ts) for more information.
