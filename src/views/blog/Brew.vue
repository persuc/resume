<script setup lang="ts">
import Codeblock from '@/components/Codeblock.vue'
import Article from '@/components/Article.vue'
import External from '@/components/External.vue'

import brewError from '@/assets/brew-error.png'

const navItems = [
  "back" as const,
  {
    href: '#top',
    label: 'How to write a homebrew formula',
  },
  {
    href: '#getting-started',
    label: 'Getting started',
  },
  {
    href: '#testing',
    label: 'How to test your formula',
  },
  {
    href: '#brew-deps',
    label: 'Depending on homebrew packages',
  },
  {
    href: '#other-deps',
    label: 'Other dependencies',
  },
  {
    href: '#system',
    label: 'Executing shell commands',
  },
  {
    href: '#brew-core',
    label: 'When all else fails',
  },
]

const brewCreateCode = `class MyFormula < Formula
  desc ""
  homepage ""
  url "https://github.com/user/repo",
  version "1.0.0"
  sha256 "5a2a999b68a979c92db9759dca5bd7c8392517c5f14a0084f52f6b9d8ce81e64"
  license ""

  depends_on "cmake" => :build

  def install
    # ENV.deparallelize  # if your formula fails when building in parallel
    system "cmake", "-S", ".", "-B", "build", *std_cmake_args
    system "cmake", "--build", "build"
    system "cmake", "--install", "build"
  end

  test do
    # TODO
    system "false"
  end
end`

const taggedCode = `class MyFormula < Formula
  desc "Some library that does something"
  homepage "https://github.com/user/repo"
  url "https://github.com/user/repo",
      tag:      "v1.0.0",
      revision: "979806b23a5e2ab9ff04cf60701f60489d13d311"
  head "https://github.com/user/repo.git", branch: "main"
  version "1.0.0"
  sha256 "5a2a999b68a979c92db9759dca5bd7c8392517c5f14a0084f52f6b9d8ce81e64"
  license "MIT"

  # the rest...

end`

const brewDepsCode = `class MyFormula < Formula
  # ...

  # dependency
  depends_on "gettext"

  # build dependency
  depends_on "gettext" => :build
  
  # build dependency with specific version
  depends_on "gettext" => ["3.2.4", :build]
  
  def install
    # ...
  end
end`

const otherDepsCode = `class MyFormula < Formula
  # ...

  resource "fbx" do
    url "https://www.autodesk.com/content/dam/autodesk/www/adn/fbx/2020-2-1/fbx202021_fbxsdk_clang_mac.pkg.tgz"
    sha256 "e6ea611a2d52107105680c9c57b6dbe99729fa95ef848539664f035d972bcb70"
  end
  
  def install
    # Extract the downloaded tarball in the build directory
    resource("fbx").stage "."

    pkg_filename = "fbx202021_fbxsdk_clang_macos.pkg"

    # Extract the .pkg contents into ./fbx_contents
    system "pkgutil", "--expand-full", pkg_filename, "fbx_contents"

    # Further extract the library files I need for my build into ./FBX SDK
    buildpath.install Dir["fbx_contents/Root.pkg/Payload/Applications/Autodesk/FBX\\ SDK"]
  end
end`

</script>

<template>
  <Article :items="navItems" id="top">

    <p class="text-3xl">How to write a homebrew formula</p>

    <p>My really short guide. No ruby knowledge required.</p>

    <p>Homebrew is a package manager for MacOS built on ruby scripts called "formalas". The <External
        href="https://docs.brew.sh/Formula-Cookbook">
        homebrew docs</External> are somehow both lengthy and lacking information, so this is my take.</p>

    <p class="text-xl mt-8" id="getting-started">Getting started</p>

    <p>Obviously you will need to <External href="https://docs.brew.sh/Installation">install homebrew</External>. Then, to
      generate a formula file, run <code class="inline-code">brew create</code>. For example, to build a C++
      application from a git repository run:</p>

    <pre class="my-4"
      v-highlightjs><code class="bash rounded">brew create --cmake https://github.com/user/repo --set-version 1.0.0</code></pre>

    <p>You can find a full list of available build systems <External
        href="https://docs.brew.sh/Manpage#create-options-url">here</External>. As far as I can tell, homebrew requires
      you to specify a tag and a revision &#x2012; you are discouraged from writing formulae that fetch the latest
      version. Instead you specify a version, and update your formula alongside the project's releases. Consequently, you
      should specify the same version for your formula as the release you are targeting.
    </p>

    <p>With that in mind, here is what your empty formula should look like:</p>

    <Codeblock label="my-formula.rb" language="ruby" :code="brewCreateCode" />

    <p>Unfortunately this doesn't work! You may have to include a lot of additional information, so fill in the template
      as below:</p>

    <Codeblock label="my-formula.rb" language="ruby" :code="taggedCode" />

    <p class="text-xl mt-8" id="testing">How to test your formula</p>

    <p>Great, now that you have the template filled in, how do you actually run your formula?</p>

    <Codeblock class="mb-4" label="Debug a formula" language="bash" code="brew install -vd MyFormula" />

    This will run your formula in debug and verbose mode, so you can see the output of each step of the install process,
    and if anything fails, you will have the option to enter a shell in the temporary build directory and investigate what
    happened.

    <img :src="brewError" class="mx-auto my-4" />

    <p class="text-xl mt-8" id="brew-deps">Depending on homebrew packages</p>

    <p>You may need other homebrew packages as dependencies. To declare them, add a <code
        class="inline-code">depends_on</code> line before the <code class="inline-code">install block</code></p>

    <Codeblock label="my-formula.rb" language="ruby" :code="brewDepsCode" />

    <p class="text-xl mt-8" id="other-deps">Other dependencies</p>

    <p>What if your dependency is not a homebrew package? Well of course you could make another formula, but fortunately
      in order to escape this branching, recursive nightmare you can specify other dependencies using <code
        class="inline-code">resource</code>. This will attempt to download a file from a URL which you can later "stage"
      for use during the build.
    </p>

    <p>In the example below, I am downloading, extracting and unpackaging the FBX SDK.</p>

    <Codeblock label="my-formula.rb" language="ruby" :code="otherDepsCode" />

    <p class="text-xl mt-8" id="system">Executing shell commands</p>

    <p>There are two ways of executing shell commands. One is using <code class="inline-code">system</code>, which will
      attempt to escape each argument for you. For example:</p>

    <pre class="my-4" v-highlightjs><code class="ruby rounded">system "ls", "FBX SDK"</code></pre>

    <p>Becomes:</p>

    <pre class="my-4" v-highlightjs><code class="bash rounded">ls FBX\ SDK</code></pre>

    <p>I personally find the many layers of escaping confusing, for example, check out this gnarly sed command I ended up
      with:</p>

    <pre class="my-4"
      v-highlightjs><code class="bash rounded">system "sed", "-i", "", "11s/.*/find_library(fbxsdk HINTS ${fbxsdk_dir}\\/2020.2.1\\/lib\\/clang\\/release\\/libfbxsdk.dylib)/", "CMakeLists.txt"</code></pre>

    <p>Too many backslashes! Instead, you may want to just include some shell scripts as dependencies and <External
        href="https://stackoverflow.com/questions/46478540/how-to-create-homebrew-formula-with-only-scripts">use brew to
        run them</External>.</p>

    <p class="text-xl mt-8" id="brew-core">When all else fails</p>

    <p>Clone <External href="https://github.com/Homebrew/homebrew-core/tree/master/Formula">homebrew-core</External> and
      look in <code class="inline-code">homebrew-core/Formula</code> for examples of what other people have done &#x2012;
      that's the only way I was able to write this post.
    </p>

    <hr class="my-4" />

    <p class="text-xl mt-8" id="brew-core">The end!</p>

    <p>Good luck writing your formulas. May none of your projects depend on OpenGL, otherwise I don't think a single blog
      post will be able to cover porting OpenGL programs to Metal... just use Rosetta 😅</p>


    <p class="my-16 py-16"></p>


  </Article>
</template>