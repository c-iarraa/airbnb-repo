// backend/routes/api/session.js
const express = require('express');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// backend/routes/api/session.js
// ...
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// ...


// backend/routes/api/session.js
// ...

const validateLogin = [
    check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
    check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
    handleValidationErrors
];

// backend/routes/api/session.js
// ...
// Log in
router.post(
    '/',
    validateLogin,
    async (req, res, next) => {
      const { credential, password } = req.body;

      const user = await User.login({ credential, password });

      if (!user) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = ['The provided credentials were invalid.'];
        return next(err);
      }

      await setTokenCookie(res, user);

      const userJson = user.toJSON();
      delete userJson.createdAt
      delete userJson.updatedAt

      return res.json({
        user: userJson
      });
    }
  );

    // backend/routes/api/session.js
// ...

// Log out
router.delete(
    '/',
    (_req, res) => {
      res.clearCookie('token');
      return res.json({ message: 'success' });
    }
  );

  // ...

// // backend/routes/api/session.js
// // ...

// // Restore session user
// router.get(
//     '/',
//     restoreUser,
//     (req, res) => {
//       const { user } = req;
//       if (user) {
//         return res.json({
//           user: user.toSafeObject()
//         });
//       } else return res.json({});
//     }
//   );

//   // ...

// backend/routes/api/session.js
// ...

// Restore session user
router.get(
    '/',
    restoreUser,
    (req, res) => {
      const { user } = req;
      if (user) {
        return res.json({
          user: user.toSafeObject()
        });
      } else return res.json({ user: null });
    }
  );

  // ...



    module.exports = router;
