var express = require('express');
var router = express.Router();

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fed = require("feed");
const { Feed } = fed;


const lastBuildDate = (posts) => {
  if (!!posts || posts.length == 0) return Date.now()
  return new Date(posts.sort(posts.created_at)[0].created_at)
}

/* GET home page. */
router.get('/recent', function (req, res, next) {
  JSDOM.fromURL(process.env.TARGET_URL).then(dom => {
    return JSDOM.fragment(dom.serialize());
  }).then((fragment) => {
    eval([...fragment.querySelectorAll('script')].filter(e => e.textContent.length > 1000)[0].textContent)

    let feed = new Feed({
      title: 'times',
      description: 'times',
      lastBuildDate: lastBuildDate(POSTS)
    });

    POSTS.recent.sort(e => e.created_at).reverse().forEach(e => {
      feed.addItem({
        title: e.title,
        link: e.url,
        description: e.headline,
        date: new Date(e.created_at)
      });
    })

    res.set('Content-Type', 'application/rss+xml');
    res.send(feed.rss2());
  });
});

router.get('/quality', function (req, res, next) {
  JSDOM.fromURL(process.env.TARGET_URL).then(dom => {
    return JSDOM.fragment(dom.serialize());
  }).then((fragment) => {
    eval([...fragment.querySelectorAll('script')].filter(e => e.textContent.length > 1000)[0].textContent)
    let feed = new Feed({
      title: 'times',
      description: 'times',
      lastBuildDate: lastBuildDate(POSTS)
    });

    POSTS.quality.sort(e => e.score).forEach(e => {
      feed.addItem({
        title: e.title,
        link: e.url,
        description: e.headline,
        date: new Date(e.created_at)
      });
    })

    res.set('Content-Type', 'application/rss+xml');
    res.send(feed.rss2());
  });
});

module.exports = router;
