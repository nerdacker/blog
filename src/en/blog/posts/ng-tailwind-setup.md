---
title: Angular & TailwindCSS from Scratch
description: There are many tutorials and posts out there about how to setup tailwindcss in an Angular application. Some work, some might not. Here is my log of how to setup, without much tinkering in configs and source code.
date: "2020-09-30T00:00-00:00"
author: Oliver Erxleben
image: https://images.pexels.com/photos/996328/pexels-photo-996328.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260
tags:
  - Software
  - Howto
---

### Prerequisites

you will need the following packages available on your system:

* ng
* npm
* node

### Dependencies

Lets get started with creating our application


    ng new ngtw 


and choose SCSS for styling lib. After setting up the base application, enter

    npm install --save-dev tailwindcss
    npm install --save-dev @angular-builders/custom-webpack postcss-scss postcss-import postcss-loader 

Magic lies within the custom-webpack from @angular-builders. We need to configure our project to use that instead of the default one. 

First lets create a useful config. I found many incompatible configs because postcss and web pack seem to be very alive and APIs might change. This one works quite good as the time of writing (30.09.2020).

### Webpack

    touch webpack.config.js 


and enter

    module.exports = {
      module: {
        rules: [
          {
           test: /\.scss$/,
           loader: "postcss-loader",
             options: {
               postcssOptions: {
                 ident: "postcss",
                 syntax: "postcss-scss",
                 plugins: [
                   require("postcss-import"),
                   require("tailwindcss"),
                   require("autoprefixer"),
                 ],
               },
             },
           },
         ],
       },
     };

### Angular Config

Next step is to tell angular how to use our config. 

    ng config projects.ngtw.architect.build.builder @angular-builders/custom-webpack:browser

    ng config projects.ngtw.architect.build.options.customWebpackConfig.path webpack.config.js


The first is for the actual builder and the following

    ng config projects.ngtw.architect.serve.builder @angular-builders/custom-webpack:dev-server 

    ng config projects.ngtw.architect.serve.options.customWebpackConfig.path webpack.config.js

### Entering Tailwind


is made for the development server. Now as we have a working webpack configuration setup, it is time to initialize tailwind itself:

    npx tailwind init

The command above will add a *tailwind.config.js* to your project. We can leave it as is. 

In the global styles.scss file we need to import Tailwind now:

    @import 'tailwindcss/base';
    @import 'tailwindcss/components';
    @import 'tailwindcss/utilities';


With this work done you should be able to build angular templates with tailwindcss. Lets build a hello world in app.component.html

    <div class="bg-gray-100 mx-auto my-auto">
      <h1 class="my-8 text-center text-6xl font-bold">
        <span class="text-teal-500">TailwindCSS</span>
         and
        <span class="text-red-600">Angular</span>
         is awesome!
      </h1>
          <p class="text-center text-3xl">
            Thanks for reading
          </p>
    </div>


## Review

The Post shows in a very very short amount of time how to integrate custom webpack behavior and tailwindcss. Once I saw Flutter and SwiftUI I wanted a similar UI description layer for my very own applications. I make business apps and I am pretty in the web team.

With tailwind I am a lot more where I want to be. I value much of Angular`s framework or platform thinking and having all familiar options and longevity with me - plus - a nice and well-playing-together abstraction of UI elements I am pretty sure that this will stand some time. 

-----

Thank you! 
