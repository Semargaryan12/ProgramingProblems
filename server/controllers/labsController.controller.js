const Laborator = require("../models/Laborator");
const LaboratorAnswer = require("../models/LaboratorAnswer");
const User = require("../models/User");
const mongoose = require('mongoose');

 const createLaborator = async (req, res) => {
  try {
    const laborator = new Laborator(req.body);
    console.log(laborator);
    
    await laborator.save();
    res.status(201).json(laborator);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

 const getAllLaborators = async (req, res) => {
  const labs = await Laborator.find();
  res.json(labs);
};

 const getLaborator = async (req, res) => {
  try {
    const laborator = await Laborator.findById(req.params.id);
    if (!laborator)
      return res.status(404).json({ message: "Laborator not found" });
    res.json(laborator);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

 const updateLaborator = async (req, res) => {
  try {
    const laborator = await Laborator.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!laborator)
      return res.status(404).json({ message: "Laborator not found" });
    res.json(laborator);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteLaborator = async (req, res) => {
  try {
    const laboratorId = req.params.id;

    // 1️⃣ Find laborator
    const laborator = await Laborator.findById(laboratorId);
    if (!laborator) {
      return res.status(404).json({ message: "Laborator not found" });
    }

    // 2️⃣ Get all LaboratorAnswer IDs related to this laborator
    const answers = await LaboratorAnswer.find({ laboratorId });
    const answerIds = answers.map(a => a._id);

    // 3️⃣ Delete laborator answers
    await LaboratorAnswer.deleteMany({ laboratorId });

    // 4️⃣ Remove related labSubmissions from ALL users
    await User.updateMany(
      {},
      {
        $pull: {
          labSubmissions: {
            $or: [
              { labId: laboratorId },
              { submissionId: { $in: answerIds } }
            ]
          }
        }
      }
    );

    // 5️⃣ Delete laborator
    await Laborator.findByIdAndDelete(laboratorId);

    res.json({ message: "Laborator and related data deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const submitAnswer = async (req, res) => {
  try {
    const { laboratorId } = req.body;  
    const file = req.file;
    if (!laboratorId || !mongoose.Types.ObjectId.isValid(laboratorId)) {
      return res.status(400).json({ message: "Invalid or missing laboratorId" });
    }

    const existing = await LaboratorAnswer.findOne({
      userId: req.user._id,
      laboratorId,
    });

    if (existing) {
      return res.status(400).json({ message: "Already submitted" });
    }

    const answer = new LaboratorAnswer({
      laboratorId,      
      userId: req.user._id,
      filename: req.file.filename,
    });

    await answer.save(); 
    console.log("File uploaded and saved:", file.path);
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        labSubmissions: {
          labId: laboratorId,
          submissionId: answer._id,
          submittedAt: answer.submittedAt,
        },
      },
    });

    res.status(201).json({ message: "Answer submitted", answer });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};


 const getAnswersByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const answers = await LaboratorAnswer.find({ userId })
    .populate("laboratorId", "title")
    .exec();
  
  
    
    const formattedAnswers = answers.map((ans) => ({
      _id: ans._id,
      submittedAt: ans.submittedAt,
      filename: ans.filename,
      laboratorTitle: ans.laboratorId?.title || "Անհայտ լաբորատոր",
      excelUrl: `/uploads/labs/${ans.filename}`,
    }));

    res.status(200).json({ success: true, data: formattedAnswers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Սխալ լաբ. պատասխանների բեռնումում" });
  }
};


module.exports = {
createLaborator, getAllLaborators, getLaborator, updateLaborator, deleteLaborator, submitAnswer, getAnswersByUserId
}