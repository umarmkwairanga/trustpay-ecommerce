export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(`[Error] ${err.message}`); // Log for internal tracking
    
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        // Only show stack trace in development
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
};