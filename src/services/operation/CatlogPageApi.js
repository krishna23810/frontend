import React from "react";
import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { categoriesApi } from "../apis";

// const {
//     CATEGORIES_PAGE_API
// } = categoriesApi;

const CatalogPageApi = async (categoryId) => {
    const toastId = toast.loading("Loading catalog data...");
    let result = [];
    try {
        const respond = await apiConnector("POST", categoriesApi.CATEGORIES_PAGE_API, { categoryId });
        // console.log("Catalog data fetched successfully fe:", respond);
        if (!respond.data.success) {
            throw new Error("Failed to fetch catalog data");
        }

        result = respond.data.data;
        
    } catch (error) {
        console.error("Error fetching catalog data:", error);
    }
    toast.dismiss(toastId);
    // console.log("Final result:", result);
    return result;
};

export default CatalogPageApi;
