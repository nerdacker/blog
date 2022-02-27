# Coding blog powered by Eleventy

![build & deployment](https://github.com/nerdacker/blog/actions/workflows/build.yml/badge.svg)

### Technologies used:

- [Eleventy](https://www.11ty.dev/)
- [Alpine.js](https://github.com/alpinejs/alpine)
- [Tailwind CSS](https://tailwindcss.com/)

## Installation

### 1\. Install dependencies

```
yarn
```

### 2\. Build the project to generate the first CSS

This step is only required the very first time.

```
yarn run build
```

### 3\. Run Eleventy

```
yarn run start
```

## Article structure

Articles are stored in the `posts` folder of the specific locale subdirectory (`/de/post.md`).
An article must contain a valid front matter.

### Front matter properties

- *title* the title of the blogpost
- *description* short description (will appear in article preview and as preface on the artile itself)
- *date* publishing date
- *author* authors name as listed in the authors collection
- *image* url to the header image of your article (optional)
- *tags* list of categories the article belongs to
- *translationKey* property to determine the corresponding article in another language (optional)

#### Example

```
---
title: My Blogpost
translationKey: my-blbogpost
description: A short description of a really useful blogpost which will definetely blow your mind
date: 2020-09-02
author: Phil Osoph
image: my-awesome-pic.jpg
tags:
  - ethics
  - awesomeness
  - mustard
---
```

## Credits
**Icons:** 
- [heroicons](https://heroicons.dev/)
- [simpleicons](https://simpleicons.org/)
- [svgomg](https://jakearchibald.github.io/svgomg/) _svg minimization_
- [base64encoder](https://www.base64encode.org/) _base64 transformation for better yaml storage_


## Firebase

you need to add firebase-credentials.js to src/static/js folder in order to be able to establish firebase. :)