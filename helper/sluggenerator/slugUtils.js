const slugify = (str) => {
    return str
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '');
  };
const generateUniqueSlug = async (name, model) => {
  let slug = slugify(name);
  let property = await model.findOne({ slug });

  let counter = 1;
  while (property) {
      slug = `${slug}-${counter}`;
      property = await model.findOne({ slug });
      counter++;
  }
  return slug;
};

module.exports = { generateUniqueSlug };