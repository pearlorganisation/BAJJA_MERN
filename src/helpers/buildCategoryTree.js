// Recursive function to build category tree
export const buildCategoryTree = (
  categories,
  parentId = null,
  depth = 0,
  maxDepth = 50
) => {
  if (depth > maxDepth) {
    console.warn(`Max depth reached at parentId: ${parentId}`);
    return [];
  }

  return categories // [all categories]
    .filter((category) => category.parent_id === parentId) // [{}, {}, {}] All parent here, parent_id = null
    .map((category) => {
      return {
        _id: category._id,
        gptId: category.gptId,
        name: category.name,
        path: category.path,
        type: category.type,
        children: buildCategoryTree(
          // Passing categories and parent_id
          categories,
          category.gptId,
          depth + 1,
          maxDepth
        ), // Recursive call
      };
    });
};
