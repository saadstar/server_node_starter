const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getAllUsers,
  deleteUser,
  authWithGoogle,
} = require("../controllers/authController");

// @POST create new account
router.post("/register", register);

// @POST login to your account
router.post("/login", login);

// @POST loginwitgoogle  to your account
router.post("/google", authWithGoogle);

// @GET fetch all user acounts
router.get("/", getAllUsers);

// @DELETE delete a user acount by id
router.delete("/delete/:id", deleteUser);

module.exports = router;