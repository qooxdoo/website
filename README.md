# Qooxdoo Website

This repo builds the static website; run `gulp` to compile or `gulp serve` to compile and run a webserver, watching for more changes.

The static site generation is done by Nunjucks

## Adding to the portfolio

If you would like to add to the portfolio, you can fork this repo, add you entry/ies and then submit a PR.  All you have to do
is to create files in `src/data/portfolio` - create a `.json` file for each entry you want to make, uploading any screenshots
into `src/images/portfolio`.  The `.json` files look like this:

```
{
    "caption": "The Name Of My Product Or Business",
    "images": [
        "images/portfolio/myimage.png"
    ],
    "body": "<p>Your rich text description goes here</p>",
    "author": "https://www.mywebsite.com/",
    "website": "https://www.myproduct.com/",
    "license": "MIT etc"
}
```

The first image in the `images` array is displayed at the top of the entry, but all others are below the body.

Writing HTML encoded in JSON is hard, so as an alternative if you provide another file with the same name but with a `.html` 
extension, that will be loaded and used instead of the `body` property of the `.json` file.  Your `.html` file must not
contain tags like `<html>` or `<body>`, it should be **just** the HTML fragment for the description, EG:

```
<p><strong>The Name Of My Product</strong> is a wonderful piece of software which does amazing things.</p>
``` 

Remember that the portfolio automatically adds your website and license details below the body, so there is no need to
add that yourself (unless of course, there is something you prefer to clarify)

 