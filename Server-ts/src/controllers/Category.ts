import { Request, Response } from "express";
import Category from "../models/Category";


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

export const categoryPageDetails = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.body;

    //  Get courses for the specified category
    const selectedCategory = await Category.findById(categoryId)
      .populate("courses")
      .exec();

    console.log(selectedCategory);

    //  Handle the case when the category is not found 
    if (!selectedCategory) {
      console.log("Category not found ");
      return res.status(404).json({
        success: false,
        message: "Category not Found "
      })
    }

    // handle the case when there are no course
    if (!selectedCategory.courses || (Array.isArray(selectedCategory.courses) && selectedCategory.courses.length === 0)) {
      return res.status(404).json({
        success: false,
        message: "No course found for the selected Category",
      })
    }

    const selectedCourses = selectedCategory.courses;

    // Get courses for other categories
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    }).populate("courses");
    let differentCourses = [];

    for (const category of categoriesExceptSelected) {
      if (category.courses && Array.isArray(category.courses)) {
        differentCourses.push(...category.courses);
      }
    }


    // Get top-selling Courses across all categories

    const allCategories = await Category.find().populate("courses");
    const allCourses = allCategories.flatMap((category) => category.courses);
    const mostSellingCourses = allCourses
      .filter((course): course is any => course !== null && typeof course === 'object' && 'sold' in course)
      .sort((a, b) => b.sold - a.sold) 
      .slice(0, 10);

    res.status(200).json({
      selectedCourses: selectedCourses,
      differentCourses: differentCourses,
      mostSellingCourses: mostSellingCourses,
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    })
  }
}