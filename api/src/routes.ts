import { v4 as uuidv4 } from "uuid";
import express from "express";
import Database from "@casoetan/nj-db";

const router = express.Router();
const db = new Database({ project_id: process.env.GCP_PROJECT_ID || "" });

router.get("/", (req, res) => {
  res.send("Welcome to NJ-DB");
});

router.get("/:collection/:id", async (req, res) => {
  const { collection, id } = req.params;
  try {
    const result: any = await db.readOne({ collection, id });
    return res.send(result);
  } catch (error) {
    res.statusCode = 404;
    res.end();
  }
});

router.get("/:collection", async (req, res) => {
  console.log(req.query);
  try {
    const result = await db.readMany(
      { collection: req.params.collection },
      req.query
    );
    return res.send(result);
  } catch (error) {
    res.statusCode = 404;
    res.end();
  }
});

router.post("/:collection", async (req, res) => {
  const { collection } = req.params;
  let { id, ...body } = req.body;
  if (!id) {
    id = uuidv4();
  }
  await db.write({ collection, id }, body);

  const result: any = await db.readOne({ collection, id });
  res.statusCode = 201;
  return res.send(result);
});

router.patch("/:collection/:id", async (req, res) => {
  const { id, collection } = req.params;
  await db.write({ collection, id }, req.body);

  const result: any = await db.readOne({ collection, id });
  res.statusCode = 200;
  return res.send(result);
});

export default router;
