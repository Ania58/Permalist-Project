import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

const app = express();
const port = 3000;

dotenv.config();

const db = new pg.Client({
  "user": process.env.USER,
  "host": process.env.HOST,
  "database": process.env.DATABASE,
  "password": process.env.PASSWORD,
  "port": process.env.PORT
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    items = result.rows;

    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (error) {
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  try {
    const item = req.body.newItem;
    await db.query("INSERT INTO items (title) VALUES ($1)",
      [item]
    );
    res.redirect("/");
  } catch (error) {
    console.log(err);
  }
 
});

app.post("/edit", async (req, res) => {
  try {
    const item = req.body.updatedItemTitle;
    const id = req.body.updatedItemId;
    await db.query("UPDATE items SET title = ($1) WHERE id = ($2)",
      [item, id]
    );
    res.redirect("/");
  } catch (error) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  try {
    const id = req.body.deleteItemId;
    await db.query("DELETE FROM items WHERE id = ($1)", [id]);
    res.redirect("/");
  } catch (error) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
