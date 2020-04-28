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
    "website": "https://www.mycompany.com/",
    "license": "Proprietary or MIT etc"
}
```

The first image in the `images` array is displayed at the top of the entry, but all others are below the body.
