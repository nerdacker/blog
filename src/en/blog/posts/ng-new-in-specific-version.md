---
title: ng new in a specific version
description: Ever wanted to test out an angular application from not the latest stable? Here is an approach of how to do exactly this!
date: "2019-11-01T00:22-00:00"
author: Oliver Erxleben
image: /static/img/posts/ng-new-in-specific-version/title.png
tags:
  - software
  - howto
---

## The problem: Angular CLI in a specific version

Ever wanted to test out an angular application from a beta version or a release candidate but

    ng new [project]

does always use the latest stable? And 

    ng new --help

doesen`t show up a param to specify a version?

Yeah. Exactly what happened to me. In the post I will share how to do that. 

## The solution

npm version used: 6.12.1
node version used: v12.12.0

You simply install a specific @angular/cli package using npm (or yarn?). I tested with npm to install angular 9rc:

    mkdir angular-9rc
    cd angular-9rc
    npm install @angular/cli@next

where "next" could be a specific older version or a beta tag you will find on npmjs.com: https://www.npmjs.com/package/@angular/cli

After that you are able to use the local installed version using just

    ng new HelloNine

Installation takes quite some time. After all I was able to run the app as usual with 

    ng serve
    ng build
    ng build --prod

## The rults for ivy

So with ivy enabled by default? Following documentation: yes it is. Have a look here: https://next.angular.io/guide/ivy

the 

    ng build --prod 

results in 

![Results in FireFox](/static/img/posts/ng-new-in-specific-version/result.png)

That`s okay, but I think Ivy could get a way smaller. Thanks for reading! 

