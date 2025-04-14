const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://imshu:imshu@cluster0.qpn6bzg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

const applicationSchema = new mongoose.Schema({
  company: String,
  role: String,
  status: String,
  DOA: String,
  link: String,
});

const Application = mongoose.model("Application", applicationSchema);

app.post("/api/applications", async (req, res) => {
  try {
    const newApp = new Application(req.body);
    await newApp.save();
    res
      .status(201)
      .json({ success: true, message: "Data saved", data: newApp });
  } catch (err) {
    console.error("Error saving:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/applications", async (req, res) => {
  const all = await Application.find();
  res.json(all);
});

app.delete("/api/applications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Application.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    res.json({ success: true, message: `Application with ID ${id} deleted`, data: deleted });
  } catch (err) {
    console.error("❌ Error deleting application:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.put("/api/applications/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Item not found" });

    res.status(200).json({ success: true, message: "Status updated", data: updated });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


app.listen(5000,()=>{
  console.log(`Connected to server at port ${5000}`)
})

