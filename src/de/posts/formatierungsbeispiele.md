---
title: Formatierungsbeispiele
translationKey: formatting-examples
description: Diese kurze Übersicht zeigt verwendungsmöglichkeiten von Markdown beim Schreiben von Artikeln.
date: 2021-01-26
author: Alessio Bisgen
image: https://cdn.britannica.com/25/93825-050-D1300547/collection-newspapers.jpg
tags:
  - allgemein

---

Hier ein paar Formatierungsbeispiele

## h2 Heading

### h3 Heading

#### h4 Heading

##### h5 Heading

###### h6 Heading

## Horizontal Rules

---

## Emphasis

**This is bold text**

**This is bold text**

_This is italic text_

_This is italic text_

~~Strikethrough~~

## Blockquotes

> Blockquotes can also be nested...
>
> > ...by using additional greater-than signs right next to each other...
> >
> > > ...or with spaces between arrows.

## Lists

Unordered

- Create a list by starting a line with `+`, `-`, or `*`
- Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    - Ac tristique libero volutpat at
    * Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
- Very easy!

Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa

4. You can use sequential numbers...
5. ...or keep all the numbers as `1.`

Start numbering with offset:

57. foo
1. bar

## Code

Inline `code`

Indented code

    // Some comments
    line 1 of code
    line 2 of code
    line 3 of code

Block code "fences"

```
Sample text here...
```

Syntax highlighting

```java
public class AsciiValue {

public static void main(String[] args) {

      char ch = 'a';
      int ascii = ch;
      // You can also cast char to int
      int castAscii = (int) ch;

      System.out.println("The ASCII value of " + ch + " is: " + ascii);
      System.out.println("The ASCII value of " + ch + " is: " + castAscii);
  }
}
```

## Tables

| Option | Description                                                               |
| ------ | ------------------------------------------------------------------------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default.    |
| ext    | extension to be used for dest files.                                      |

## Links

[link text](http://dev.nodeca.com)

[link with title](http://nodeca.github.io/pica/demo/ "title text!")

Autoconverted link https://github.com/nodeca/pica

## Images

![Minion](https://octodex.github.com/images/minion.png)

## Iframes

<iframe src="https://stackblitz.com/edit/rxjs-8vvgcd?file=index.ts" width="600" height="800"></iframe>