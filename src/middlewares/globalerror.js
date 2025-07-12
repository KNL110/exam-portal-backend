export const globalError = (err, req, res, next) => {
    const status = err.statusCode || 500;
    
    return res.status(status).json({ success: false, message: err.message });
}