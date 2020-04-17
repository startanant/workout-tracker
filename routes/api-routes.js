const db = require("../models");

module.exports = app => {
    app.get("/api/workouts", (req, res) => {
        db.Workout.find({})
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.json(err);
            });
    })

    app.get("/api/workouts/range", (req, res) => {

        db.Workout.find(req.body)
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.json(err);
            })
    })

    app.put("/api/workouts/:id", (req, res) => {
        const { id } = req.params;
    
        db.Workout.updateOne({ _id: id}, { $push: { exercises: req.body }} )
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.json(err);
            });
    })

    app.post("/api/workouts", (req, res) => {
        db.Workout.create(req.body)
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.json(err);
            });
    })
}