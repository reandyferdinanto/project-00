const router = require("express").Router();
const userController = require("../controllers/userController");

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - username
 *        - class
 *      properties:
 *        unique_id:
 *          type: unique
 *          description: auto created uniq id
 *        username:
 *          type: string
 *          description: name of the user releated
 *        class:
 *          type: string
 *          description: class of the user
 *      example:
 *        username: Assami Muzaki
 *        class: R83
 */

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: Score managing API
 */

/**
 * @swagger
 * /users:
 *  post:
 *    summary: Create new user
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 */

router.post("/", userController.addUser);
router.post("/file", userController.uploadCSV);

module.exports = router;
