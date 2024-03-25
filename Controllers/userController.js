const User = require("./../models/UserModel");
const Request = require("./../models/requestModel");

const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    "rollNo",
    "phoneNo",
    "roomNo",
    "hostel",
    "branch"
  );
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return next(new AppError("No doc found with that id", 404));
  }

  res.redirect("/user/profile-page");
});

exports.getUpdateForm = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new AppError("No doc found with that id", 404));
  }
  res.status(200).render("updateForm", { user });
});

exports.getUser = catchAsync(async (req, res) => {

  const user = await User.findById(req.user._id).populate("requests");
  if (!user) {
    return next(new AppError("No doc found with that id", 404));
  }

  res.status(200).render("userProfile", { user,path:'/user-profile' });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const doc = await User.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
