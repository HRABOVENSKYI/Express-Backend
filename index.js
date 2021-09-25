const Joi = require("joi");
const express = require("express");
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

app.get("/api/courses", (req, resp) => {
  resp.send(courses);
});

app.get("/api/courses/:id", (req, resp) => {
  // get course by id
  const course = courses.find((c) => c.id === parseInt(req.params.id));
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

  // set course
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  resp.send(course);
});

// PUT
app.put("/api/courses/:id", (req, resp) => {
  // get course by id
  const course = courses.find((c) => c.id === parseInt(req.params.id));
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
  course.name = req.body.name;
  resp.send(course);
});

// DELETE
app.delete("/api/courses/:id", (req, resp) => {
  // get course by id
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return resp.status(404).send("The course with the given ID was not found.");
  }

  // delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  resp.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
