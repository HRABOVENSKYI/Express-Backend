const Joi = require("joi");
const express = require("express");
const db = require("./database");
const app = express();
app.use(express.json());

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
  { id: 4, name: "course4" },
];

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(course);
}

// GET
app.get("/", (req, resp) => {
  resp.send("Hello, World!!!");
});

app.get("/api/courses", async (req, resp) => {
  const result = await db.promise().query(`select * from course`);
  const courses = result[0];
  resp.status(200).send(courses);
});

app.get("/api/courses/:id", async (req, resp) => {
  // get course by id
  const result = await db
    .promise()
    .query(`select * from course where id='${req.params.id}'`);
  const course = result[0][0];
  if (!course) {
    return resp.status(404).send("The course with the given ID was not found.");
  }

  resp.send(course);
});

// POST
app.post("/api/courses", (req, resp) => {
  // validate course
  const { error } = validateCourse(req.body); // destructuring --> result.error
  if (error) {
    resp.status(400).send(error.details[0].message);
    return;
  }

  // store course in db
  try {
    db.query(`insert into course(name) value ('${req.body.name}')`);
    resp.status(200).send({ msg: "Course created" });
  } catch (err) {
    console.log(err);
  }
});

// PUT
app.put("/api/courses/:id", async (req, resp) => {
  // get course by id
  const result = await db
    .promise()
    .query(`select * from course where id='${req.params.id}'`);
  const course = result[0][0];
  if (!course) {
    return resp.status(404).send("The course with the given ID was not found.");
  }

  // validate course
  const { error } = validateCourse(req.body); // destructuring --> result.error
  if (error) {
    resp.status(400).send(error.details[0].message);
    return;
  }

  // update course
  try {
    db.query(`update course set name='${req.body.name}' where id='${req.params.id}';`);
  } catch (err) {
    console.log(err);
  }

  resp.send(course);
});

// DELETE
app.delete("/api/courses/:id", async (req, resp) => {
  // get course by id
  const result = await db
    .promise()
    .query(`select * from course where id='${req.params.id}'`);
  const course = result[0][0];

  // delete course
  if (course) {
    db.query(`delete from course where id='${req.params.id}'`);
  } else {
    return resp.status(404).send("The course with the given ID was not found.");
  }

  resp.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
