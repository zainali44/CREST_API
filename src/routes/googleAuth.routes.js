import passport from "passport";
import express from "express";
import validateAssertion from "../utils/passport.js";
import jwt from "jsonwebtoken";
const googleRoutes = express.Router();

/**
 * @swagger
 * /google/auth:
 *   get:
 *     summary: Get Authentication by Google
 *     tags: [Google]
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */

googleRoutes.get('/auth', passport.authenticate('google', { scope: ['profile', 'email'] }));

googleRoutes.get('/hellotest',(req,res)=>{
  res.send("HELLO HOW ARE YOU")
})


googleRoutes.get('/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  const token = jwt.sign({ email: req.user.emails[0].value }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});


export default googleRoutes;