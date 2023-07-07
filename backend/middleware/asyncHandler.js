const asyncHandler = (fn) => //no need to use tryCatch for all async functions
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
    .catch(next)
  }
 
export default asyncHandler;
