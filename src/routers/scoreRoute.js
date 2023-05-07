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
 *        unique_id: jQfu25f8
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
 *    responses:
 *      200:
 *        description: the list of the user scores
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Score'
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
 *    responses:
 *      200:
 *        description: get score by username parameter
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Score'
 *      404:
 *        description: the score not found
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
 *    responses:
 *      200:
 *        description: success created new score
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Score'
 *      500:
 *        description: Some server error
 */

router.post("/", indexController.addScore);

module.exports = router;
