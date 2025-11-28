export const getCurrentUser = (req, res) => {
  res.status(200).json({
    message: "Інформація про користувача",
    user: req.user,
  });
};
