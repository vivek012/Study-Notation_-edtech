import { Request, Response } from "express";
import Category from "../models/Category";

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }


export const createCategory = async (req: Request, res: Response) => {

  try {
    // fetch data
    const { name, description } = req.body

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All Field are Required"
      })
    }

    const categoryDetails = await Category.create({ name, description })

    return res.status(200).json({
      success: true,
      message: "Category Created Successfully"
    })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

}

// getAllCategory
export const showAllCategory = async (req: Request, res: Response) => {

  try {
    // fetch data
    const allCategory = await Category.find({}, { name: true, description: true })

    return res.status(200).json({
      success: true,
      message: "All Category Return Successfully",
      data: allCategory,
    })

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

}

// export const categoryPageDetails = async (req: Request, res: Response) => {
//     try {
//       const { categoryId } = req.body
//       console.log("PRINTING CATEGORY ID: ", categoryId);
//       // Get courses for the specified category
//       const selectedCategory = await Category.findById(categoryId)
//         .populate({
//           path: "courses",
//           match: { status: "Published" },
//           populate: "ratingAndReviews",
//         })
//         .exec()
  
//       //console.log("SELECTED COURSE", selectedCategory)
//       // Handle the case when the category is not found
//       if (!selectedCategory) {
//         console.log("Category not found.")
//         return res
//           .status(404)
//           .json({ success: false, message: "Category not found" })
//       }
//       // Handle the case when there are no courses
//       if (!selectedCategory?.courses || (Array.isArray(selectedCategory.courses) && selectedCategory.courses.length === 0)) {
//         console.log("No courses found for the selected category.")
//         return res.status(404).json({
//           success: false,
//           message: "No courses found for the selected category.",
//         })
//       }
  
//       // Get courses for other categories
//       const categoriesExceptSelected = await Category.find({
//         _id: { $ne: categoryId },
//       })
//       let differentCategory = await Category.findOne(
//         categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
//           ._id
//       )
//         .populate({
//           path: "courses",
//           match: { status: "Published" },
//         })
//         .exec()
//         //console.log("Different COURSE", differentCategory)
//       // Get top-selling courses across all categories
//       const allCategories = await Category.find()
//         .populate({
//           path: "courses",
//           match: { status: "Published" },
//           populate: {
//             path: "instructor",
//         },
//         })
//         .exec()
//       const allCourses = allCategories.flatMap((category) => category.courses ?? [])
//       const mostSellingCourses = allCourses
//         .filter((c) => !!c)
//         .sort((a, b) => ((b as any)?.sold ?? 0) - ((a as any)?.sold ?? 0))
//         .slice(0, 10)
//        // console.log("mostSellingCourses COURSE", mostSellingCourses)
//       res.status(200).json({
//         success: true,
//         data: {
//           selectedCategory,
//           differentCategory,
//           mostSellingCourses,
//         },
//       })
//     } catch (error: any) {
//       return res.status(500).json({
//         success: false,
//         message: "Internal server error",
//         error: error.message,
//       })
//     }
//   }



export const categoryPageDetails = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.body;
    console.log("PRINTING CATEGORY ID: ", categoryId);

    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .exec();

    if (!selectedCategory) {
      console.log("Category not found.");
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // ✅ FIX 1: Removed 404 for empty courses — empty array is valid, not an error

    const categoriesExceptSelected = await Category.find({ _id: { $ne: categoryId } });

    // ✅ FIX 2: Guard against empty array + safe random index
    let differentCategory = null;
    if (categoriesExceptSelected.length > 0) {
      const randomIndex = Math.floor(Math.random() * categoriesExceptSelected.length);
      differentCategory = await Category.findById(
        categoriesExceptSelected[randomIndex]._id
      )
        .populate({ path: "courses", match: { status: "Published" } })
        .exec();
    }

    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: { path: "instructor" },
      })
      .exec();

    // ✅ FIX 3: Spread to avoid mutation + filter undefined/missing sold values
    const mostSellingCourses = [...allCategories.flatMap((c) => c.courses)]
      .filter(
        (course): course is any =>
          course !== null &&
          typeof course === "object" &&
          typeof (course as any).sold === "number"
      )
      .sort((a, b) => ((b as any).sold ?? 0) - ((a as any).sold ?? 0))
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

