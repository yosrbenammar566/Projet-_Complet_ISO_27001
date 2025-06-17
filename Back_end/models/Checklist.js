const mongoose = require("mongoose");

const checklistSchema = new mongoose.Schema({
  control: { type: String, required: true },
  items: [
    {
      text: { type: String, required: true },
      status: {
        type: String,
        enum: ["pending", "compliant", "non-compliant", "not-applicable"],
        default: "pending"
      }
    }
  ]
});

module.exports = mongoose.model("Checklist", checklistSchema);
