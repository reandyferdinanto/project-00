const router = require("express").Router();
const indexController = require("../controllers/scoreController");

/**
 * @swagger
 * components:
 *  schemas:
 *    Score:
 *      type: object
 *      required:
 *        - username
 *        - class
 *        - point
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
 *        point:
 *          type: string
 *          description: user point
 *      example:
 *        username: Assami Muzaki
 *        class: R83
 *        point: 98
 */

/**
 * @swagger
 * tags:
 *  name: Scores
 *  description: Score managing API
 */

/**
 * @swagger
 * /scores:
 *  get:
 *    summary: Return the list of all the user scores
 *    tags: [Scores]
 */

router.get("/", indexController.getAllScore);

/**
 * @swagger
 * /scores/{username}:
 *  get:
 *    summary: Get score by username
 *    tags: [Scores]
 *    parameters:
 *      - in: path
 *        name: username
 *        schema:
 *          type: string
 *        required: true
 *        description: this is the username score
 */

router.get("/:username", indexController.getScoreByUsername);

/**
 * @swagger
 * /scores:
 *  post:
 *    summary: Create new score
 *    tags: [Scores]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Score'
 */

router.post("/", indexController.addScore);

module.exports = router;
