import { Question } from "../models/question.js";
import { Exam } from "../models/exam.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createExam = async (req, res) => {
    console.log('=== CREATE EXAM REQUEST ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User:', req.user);
    
    const { examID, examName, durationMinutes, markingScheme, questions, createdBy } = req.body;
    
    console.log('Extracted fields:');
    console.log('examID:', examID);
    console.log('examName:', examName);
    console.log('durationMinutes:', durationMinutes);
    console.log('markingScheme:', markingScheme);
    console.log('questions:', questions);
    console.log('questions length:', questions?.length);

    try {
        console.log('Inserting questions...');
        const questionDocs = await Question.insertMany(questions);
        console.log('Questions inserted:', questionDocs.length);

        const exam = await new Exam({
            examID,
            examName,
            durationMinutes,
            markingScheme,
            questions: questionDocs.map(q => q._id),
            createdBy: req.user._id
        });

        console.log('Saving exam...');
        await exam.save();
        console.log('Exam saved successfully');
        
        res.status(201).json(
            new ApiResponse(201,"new exam created")
        );
    } catch (err) {
        console.error('Error creating exam:', err);
        console.error('Error stack:', err.stack);
        
        if (err.name === 'ValidationError') {
            throw new ApiError(400, `Validation Error: ${err.message}`);
        }
        
        throw new ApiError(500, 'Error creating exam');
    }
};
