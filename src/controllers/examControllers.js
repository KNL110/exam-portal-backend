import { Question } from "../models/question.js";
import { Exam } from "../models/exam.js";
import { Response } from "../models/response.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createExam = asyncHandler(async (req, res) => {

    const { examID, examName, durationMinutes, markingScheme, questions } = req.body;

    try {
        const questionDocs = await Question.insertMany(questions);

        if(!questionDocs){
            throw new ApiError(500, "an error occured while saving questions")
        }

        const exam = await new Exam({
            examID,
            examName,
            durationMinutes,
            markingScheme,
            questions: questionDocs.map(q => q._id),
            createdBy: req.user._id
        });

        await exam.save();

        res.status(201).json(
            new ApiResponse(201, "new exam created")
        );
    } catch (err) {
        if (err.name === 'ValidationError') {
            throw new ApiError(400, `Validation Error: ${err.message}`);
        }

        throw new ApiError(500, 'Error creating exam');
    }
});

export const getExam = asyncHandler(async (req, res) => {
    const { examID } = req.params;

    try {
        const exam = await Exam.findOne({ examID })
            .populate('questions', 'questionID question questionType options marks')
            .select('-createdBy');

        if (!exam) {
            throw new ApiError(404, 'Exam not found');
        }

        const examData = {
            _id: exam._id,
            examID: exam.examID,
            examName: exam.examName,
            durationMinutes: exam.durationMinutes,
            markingScheme: exam.markingScheme,
            questions: exam.questions.map(q => ({
                _id: q._id,
                questionID: q.questionID,
                question: q.question,
                questionType: q.questionType,
                options: q.options,
                marks: q.marks
            }))
        };

        res.status(200).json(
            new ApiResponse(200, examData, 'Exam fetched successfully')
        );
    } catch (err) {
        console.error('Error fetching exam:', err);
        throw new ApiError(500, 'Error fetching exam');
    }
});

export const startExam = asyncHandler(async (req, res) => {
    const startTime = new Date()
    const { examID } = req.params;

    try {
        const exam = await Exam.findOne({ examID });

        if (!exam) {
            throw new ApiError(404, 'Exam not found');
        }

        const existingResponse = await Response.findOne({
            examID: exam._id,
            studentID: req.user._id
        });

        if (existingResponse) {
            throw new ApiError(400, 'You have already started this exam');
        }

        res.status(200).json(
            new ApiResponse(200, {
                startTime: startTime,
                duration: exam.durationMinutes
            }, 'Exam started successfully')
        );
    } catch (err) {
        console.error('Error starting exam:', err);
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);

        if (err.name === 'ValidationError') {
            console.error('Validation errors:', err.errors);
        }

        throw new ApiError(500, `Error starting exam: ${err.message}`);
    }
});

export const submitExam = asyncHandler(async (req, res) => {
    const { examID } = req.params;
    const { answers, startTime } = req.body;
    const endTime = new Date();

    try {
        const exam = await Exam.findOne({ examID }).populate('questions');

        if (!exam) {
            throw new ApiError(404, 'Exam not found');
        }

        let totalScore = 0;
        const processedAnswers = [];

        for (const answer of answers) {
            const question = exam.questions.find(q => q._id.toString() === answer.questionID.toString());

            if (!question) {
                continue;
            }

            let isCorrect = false;

            if (question.questionType === 'MCQ') {
                isCorrect = answer.selectedOptions &&
                    answer.selectedOptions.length === 1 &&
                    parseInt(answer.selectedOptions[0]) === question.correctOption;
            } else if (question.questionType === 'NAT') {
                isCorrect = answer.numericalAnswer &&
                    parseFloat(answer.numericalAnswer) === question.correctValue;
            }

            if (isCorrect) {
                totalScore += exam.markingScheme.correct;
            } else if (answer.selectedOptions?.length > 0 || answer.numericalAnswer) {
                totalScore += exam.markingScheme.incorrect;
            } else {
                totalScore += exam.markingScheme.unattempted;
            }

            processedAnswers.push({
                questionID: question._id,
                type: question.questionType,
                selectedOptions: answer.selectedOptions || [],
                numericalAnswer: answer.numericalAnswer || ''
            });
        }

        const timeTaken = Math.floor((endTime - startTime) / 1000); // in seconds
        const studentID = req.user._id;

        const responseData = {
            examID : exam._id,
            studentID,
            answers : processedAnswers,
            score:totalScore,
            startTime,
            endTime,
            timeTaken
        };
        const response = new Response(responseData);

        await response.save();

        res.status(200).json(
            new ApiResponse(200, {
                score: totalScore,
                timeTaken: timeTaken,
                totalQuestions: exam.questions.length,
                submittedAt: endTime
            }, 'Exam submitted successfully')
        );
    } catch (err) {
        console.error('Error submitting exam:', err);
        throw new ApiError(500, 'Error submitting exam');
    }
});
