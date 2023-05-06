let scores = [
  {
    unique_id: 001,
    username: "Assami Muzaki",
    class: "6A",
    point: 90,
  },
  {
    unique_id: 002,
    username: "Ronaldi",
    class: "6C",
    point: 87,
  },
];

async function addScore(req, res) {
  const newUser = req.body;
  scores.push(newUser);
  console.log(scores);
  res.json("New User Added");
}

async function getAllScore(req, res, next) {
  res.json(scores);
}

async function getScoreByUsername(req, res, next) {
  const { username } = req.params;
  res.json(
    scores.filter((user) => {
      return user.username == username;
    })
  );
}
module.exports = {
  addScore,
  getAllScore,
  getScoreByUsername,
};
