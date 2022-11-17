// backend/routes/api/index.js
const router = require('express').Router();

module.exports = router;

// backend/routes/api/index.js
// ...

router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
  });

  // ...
