---
template: article.html
title:  "Make a List of Books with GooglDocs"
date:   2014-06-18 17:13:00
tags: [quickie,googledocs,amazon,methodology]
---

I needed to make a list of my audiobooks for my girlfriend. Since I am an obsessed software engineer, here is how I did it. Let this be a lesson in software problem-solving.

---

## Usecase

I have a [bunch of audiobooks](https://docs.google.com/spreadsheets/d/1t0D8d-8HBzKDGGcDlIi7BIPHLI0wqmECkT0ob2DJ4r4) and my girlfriend wanted to peruse them, and choose which ones to listen to in the car.  I wanted her to be able to see the books on Amazon, so she could decide which she wanted.

This is a totally simple spreadsheet usecase, but I thought I might take a moment to go into how I broke the problem down and solved it.

## Breakdown

The problem is made of several pieces:

### Get list of audiobooks

I have my audiobooks in a directory, all named like this: `AUTHOR -  TITLE`. To get a nice list for GoogleDocs, I did this on command-line:

`ls |sed s/\ -\ /,/g > ~/Desktop/audiobooks.csv`

I import the resulting CSV.


### Get search URL

The search url is built from a search of "books" section, using `encodeURIComponent(AUTHOR + " - " + TITLE)`. I did a search of the first in the list on Amazon. I couldn't find an `encodeURIComponent()` analog, so I made one like this (in Tools/Script Editor):

```javascript
function URI(text){
  return encodeURIComponent(text);
}
```

Next, I constructed a URL, like this:

```
=CONCATENATE("http://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Dstripbooks&field-keywords=", URI(A2), "+-+", URI(B2))
```


### Create a link

Now, we need to create  a link from formatted text of `AUTHOR + " - " + TITLE`:

```
=HYPERLINK(C2, CONCATENATE(A2, " - ", B2))
```

After this, I copied `D2` and pasted into `D3:D25`, I copied `D2:D25`, and that gave me a nice table to paste into an email.