import { defineArrayMember, defineField, defineType } from "sanity";

export const authorType = defineType({
  name: "author",
  type: "document",
  title: "Author",
  fields: [
    defineField({
      name: "bio",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
});
