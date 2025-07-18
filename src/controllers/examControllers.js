import { Question } from "../models/question";
import { Exam } from "../models/exam";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

export const createExam = async (req, res) => {
    const { examID, examName, durationMinutes, markingScheme, questions, createdBy } = req.body;

    try {
        const questionDocs = await Question.insertMany(questions);

        const exam = new Exam({
            examID,
            examName,
            durationMinutes,
            markingScheme,
            questions: questionDocs.map(q => q._id),
            createdBy,
        });

        await exam.save();
        res.status(201).json(
            new ApiResponse(201,"new exam created")
        );
    } catch (err) {
        console.error(err);
        throw new ApiError(500, 'Error creating exam');
    }
};
