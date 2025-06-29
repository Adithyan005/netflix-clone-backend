import express from "express";
import blockbuster_model from "../models/Blockbuster.js";
const router = express.Router();
import mongoose from "mongoose";

router.post("/blockbuster", async (req, res) => {
  const {
    image,
    name,
    year,
    duration,
    director,
    cast,
    writers,
    rating,
    description,
    trailerurl,
  } = req.body;
  try {
    const blkbstrmovies = new blockbuster_model({
      image,
      name,
      year,
      duration,
      director,
      cast,
      writers,
      rating,
      description,
      trailerurl,
    });
    await blkbstrmovies.save();
    res.status(200).json({ message: "Successfully Inserted" });
  } catch (error) {
    res.status(500).json({ message: "Not inserted" });
  }
});

router.get("/bbmovies", async (req, res) => {
  const blkbstrmovies = await blockbuster_model.find();
  try {
    console.log(blkbstrmovies);
    res.status(200).json({ blkbstrmovies });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching movies" });
  }
});

router.get("/bbmovies/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const movie = await blockbuster_model.findOne({ _id: id });

    res.status(200).json(movie);
    console.log(movie);
  } catch (error) {
    console.log("error fetching");
    console.log(error);
  }
});

export default router;
