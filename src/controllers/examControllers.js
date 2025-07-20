import { Question } from "../models/question.js";
import { Exam } from "../models/exam.js";
import { Response } from "../models/response.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import nodemailer from 'nodemailer';

export const createExam = asyncHandler(async (req, res) => {

    const { examID, examName, durationMinutes, markingScheme, questions } = req.body;

    const questionDocs = await Question.insertMany(questions);

    if (!questionDocs) {
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

    return res.status(201).json(
        new ApiResponse(201, {}, "new exam created")
    );
});

export const getExams = asyncHandler(async (req, res) => {

    const exams = await Exam.find({ createdBy: req.user._id })
        .populate('questions', 'questionID question questionType options marks correctOption correctValue')
        .select('-createdBy');

    if (exams.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, [], 'No exams found for this professor')
        );
    }

    return res.status(200).json(
        new ApiResponse(200, exams, 'Exams fetched successfully')
    );
});


export const getExam = asyncHandler(async (req, res) => {

    const { examID } = req.params;

    const exam = await Exam.findOne({ examID })
        .populate('questions', 'questionID question questionType options marks correctOption correctValue')
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
            marks: q.marks,
            correctOption: q.correctOption,
            correctValue: q.correctValue
        }))
    };

    return res.status(200).json(
        new ApiResponse(200, examData, 'Exam fetched successfully')
    );
});

export const startExam = asyncHandler(async (req, res) => {

    const startTime = new Date()
    const { examID } = req.params;

    const exam = await Exam.findOne({ examID });

    if (!exam) {
        throw new ApiError(404, 'Exam not found');
    }

    const existingResponse = await Response.findOne({
        examID: exam._id,
        studentID: req.user._id
    });

    if (existingResponse) {
        throw new ApiError(400, 'You have already attended this exam');
    }

    return res.status(200).json(
        new ApiResponse(200, {
            startTime: startTime,
            duration: exam.durationMinutes
        }, 'Exam started successfully')
    );
});

export const submitExam = asyncHandler(async (req, res) => {

    const { examID } = req.params;
    const { answers, startTime } = req.body;
    const endTime = new Date();

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
        examID: exam._id,
        studentID,
        answers: processedAnswers,
        score: totalScore,
        startTime,
        endTime,
        timeTaken
    };
    const response = new Response(responseData);

    await response.save();

    return res.status(200).json(
        new ApiResponse(200, {
            score: totalScore,
            timeTaken: timeTaken,
            totalQuestions: exam.questions.length,
            submittedAt: endTime
        }, 'Exam submitted successfully')
    );
});


export const sendResultsEmail = async (req, res) => {
    const { to, subject, html, attachments } = req.body;

    // Configure email transporter (Gmail example)
    const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // your Gmail address
            pass: process.env.EMAIL_PASS  // your Gmail app password
        }
    });

    // Send email with PDF attachment
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: html,
        attachments: attachments.map(att => ({
            filename: att.filename,
            content: att.content,
            encoding: att.encoding,
            contentType: att.contentType
        }))
    });

    return res.status(200).json(
        new ApiResponse(200, {}, 'Email sent successfully')
    );
};

