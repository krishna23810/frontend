const category = require('../models/category');


exports.createCategory = async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({
            success: false,
            message: 'Name and description are required'
        });
    }

    try {
        const newcategory = new category({
            name,
            description
        });

        await newcategory.save();

        return res.status(201).json({
            success: true,
            message: 'category created successfully'
            // tag: newTag
        });
    } catch (error) {
        console.error('Error creating category:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

exports.getAllCategory = async (req, res) => {
    try {
        const cat = await category.find({}, { name: true, description: true });

        return res.status(200).json({
            success: true,
            categories: cat,
            message: 'category fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching category:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// category page detail
exports.categoryPageDetail = async (req, res) => {
    try {
        //get category id
        const { categoryId } = req.body;
        //get courses for specific id
        const categoryDetail = await category.findById(categoryId) 
        .populate({ path: 'courseId', match: { status: "Published" }, 
            select: 'courseName description image instructorId averageRating totalStudents totalRatings price' ,
                populate: { path: 'instructorId', select: 'firstName lastName' }
            })
            // .limit(8) // Limit to 5 courses from different categories
            .exec();
        
        //validate category
        if (!categoryDetail) {
            console.log("can't find category detail");
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        console.log("going to find courses for other category");
        //get courses for different category
        const differentCategoryCourses = await category.find({ _id: { $ne: categoryId } })
            // .populate('courseId', 'courseName description image instructorId')
            .populate({ path: 'courseId', match: { status: "Published" },
                 select: 'courseName description image averageRating totalStudents totalRatings price',
                populate: { path: 'instructorId', select: 'firstName lastName' }
            })
            .limit(8) // Limit to 5 courses from different categories
            .exec();

        const AllCategory = await category.find()
        .populate({ path: 'courseId', match: { status: "Published" },
             select: 'courseName description image totalStudents averageRating totalRatings price',
         populate: { path: 'instructorId', select: 'firstName lastName' } })
            .limit(8) // Limit to 8 top-selling courses
            .exec();
        // console.log("top selling courses", topSelling);
        //return response
        const Allcourses = AllCategory.flatMap(category => category.courseId);

        const topSelling = Allcourses.sort((a, b) => b.totalStudents - a.totalStudents).slice(0, 8);
        // console.log("All courses fetched ", Allcourses);

        console.log("category page detail fetched successfully");
         res.status(200).json({
            success: true,
            message: 'Category page detail fetched successfully',
            data: {
                categoryDetail,
                differentCategoryCourses,
                topSelling
            }
        });
    }
    catch (error) {
        console.error('Error fetching category page detail:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}