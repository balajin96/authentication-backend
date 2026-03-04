import express from "express";
import { ROLES } from "../constants/roles.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { updateUserRole } from "../controllers/userController.js";

const router = express.Router();

router.use(verifyToken);

router.get("/admin", authorizeRoles(ROLES.ADMIN), (req, res) => {
  res.status(200).json({
    message: "Welcome Admin",
    data: { userId: req.auth.userId, role: req.auth.role },
  });
});

router.get(
  "/manager",
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  (req, res) => {
    res.status(200).json({
      message: "Welcome Manager",
      data: { userId: req.auth.userId, role: req.auth.role },
    });
  }
);

router.get(
  "/user",
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER, ROLES.USER),
  (req, res) => {
    res.status(200).json({
      message: "Welcome User",
      data: { userId: req.auth.userId, role: req.auth.role },
    });
  }
);

router.patch(
  "/:userId/role",
  authorizeRoles(ROLES.ADMIN),
  updateUserRole
);

export default router;
