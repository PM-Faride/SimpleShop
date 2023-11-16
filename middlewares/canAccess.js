exports.canAddUser = (req, res, next) => {
  const accessLevels = req.user.accessLevels;
  if (!accessLevels.includes("addUser")) return res.redirect("/home");
  next();
};

exports.canDeleteUser = (req, res, next) => {
  const accessLevels = req.user.accessLevels;
  if (!accessLevels.includes("deleteUser")) return res.redirect("/home");
  next();
};

exports.canEditUser = (req, res, next) => {
  const accessLevels = req.user.accessLevels;
  if (!accessLevels.includes("editUser")) return res.redirect("/home");
  next();
};

exports.canViewUsers = (req, res, next) => {
  const accessLevels = req.user.accessLevels;
  if (!accessLevels.includes("viewUsers")) return res.redirect("/home");
  next();
};

exports.canAddCategory = (req, res, next) => {
  // ezafe konam k error bede ta begiram va tu safhe home neshun bedam k aqa dastresi nadashti
  const accessLevels = req.user.accessLevels;
  if (!accessLevels.includes("addCategory")) return res.redirect("/categories");
  next();
};

exports.canDeleteCategory = (req, res, next) => {
  const accessLevels = req.user.accessLevels;
  if (!accessLevels.includes("deleteCategory"))
    return res.redirect("/categories");
  next();
};

exports.canAddProduct = (req, res, next) => {
  const accessLevels = req.user.accessLevels;
  if (!accessLevels.includes("addProduct")) return res.redirect("/products");
  next();
};

exports.canEditCategory = (req, res, next) => {
  const accessLevels = req.user.accessLevels;
  if (!accessLevels.includes("editCategory"))
    return res.redirect("/categories");
  next();
};

exports.canDeleteProduct = (req, res, next) => {
  const accessLevels = req.user.accessLevels;
  if (!accessLevels.includes("deleteProduct")) return res.redirect("/products");
  next();
};

exports.caneEditProduct = (req, res, next) => {
  const accessLevels = req.user.accessLevels;
  if (!accessLevels.includes("editProduct")) return res.redirect("/products");
  next();
};
