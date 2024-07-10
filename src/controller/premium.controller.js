import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Premium } from "../models/PremiumModel.js";
import { MaleFactor } from "../models/MaleFactormodel.js";
import { TransFactor } from "../models/TransFactorModel.js";
import {xlsx} from "xlsx";

const uploadExcel = asyncHandler( async (req,res)=>{

    let premiumLocalPath;
    if (req.files && Array.isArray(req.files.premium) && req.files.premium.length > 0) {
        premiumLocalPath = req.files.premium[0].path
    }
    if (!premiumLocalPath) {
        throw new ApiError(400, "Premium excel file is required")
    }

  const workbook = xlsx.readFile(file.path);
  const sheetName1 = workbook.SheetNames[0];
  const sheetName2 = workbook.SheetNames[1];
  const premium = workbook.Sheets[sheetName1];
  const factor = workbook.Sheets[sheetName2];
  const allPremiumData = xlsx.utils.sheet_to_json(premium);
  const allFactorData = xlsx.utils.sheet_to_json(factor);

  // Convert the data to the desired format and save to MongoDB
  // I edited the excel file to read the data using below code
  const premiumData = allPremiumData.map(row => ({
    age: row['Age'],
    term: row['Term'],
    premium: row['Premium'],
  }));

  const maleFactorData = allFactorData.map(row => ({
    age: row['Male Age'],
    factor: row['Male Factor'],
  }));

  const transFactorData = allFactorData.map(row => ({
    age: row['Trans Age'],
    factor: row['Trans Factor'],
  }));


  try {
    const errCount =0;
    Premium.insertMany(premiumData)
    .catch(error => errCount++);

    MaleFactor.insertMany(maleFactorData)
    .catch(error => errCount++);

    TransFactor.insertMany(transFactorData)
    .catch(error => errCount++);

    if (errCount) {
        throw new ApiError(500, "Something went wrong")
    }else{
        res.status(201).json(
            new ApiResponse(200, "Data Added Successfully")
        )
    }
    
  } catch (error) {
    throw new ApiError(500, "Something went wrong")     
  }
 

})

async function calculatePremium(sumAssured, gender, age, term, premiumData) {
    const { femalePremium } = premiumData;
    
    if (gender === 'female') {
      return femalePremium;
    } else if (gender === 'male') {
      const factorData = await MaleFactor.findOne({ age });
      if (!factorData) {
        throw new ApiError(404, "Factor data not found");
      }
      const { maleFactor, transFactor } = factorData;
      return (maleFactor * sumAssured / 1000) + femalePremium;

    } else if (gender === 'trans') {
      if (!factorData) {
        throw new ApiError(404, "Factor data not found");
      }
      const factorData = await TransFactor.findOne({ age });
      const { transFactor } = factorData;
      return (transFactor * sumAssured / 1000) + femalePremium;
    } else {
      throw new ApiError(400, "Invalid Gender")
    }
  }


  const premiumCalculation = asyncHandler( async (req, res) => {
    const { sumAssured, gender, age, term } = req.body;

    if (
        [sumAssured, gender, age, term].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
  
    try {
      const premiumData = await Premium.findOne({ age, term });      
      if (!premiumData) {
        throw new ApiError(404, "'Premium data not found'");
      }
  
      const premium = await calculatePremium(sumAssured, gender, age, term, premiumData);

      return res.status(200).json(
        new ApiResponse(200, premium, "Premium Calculated Successfully")
    )
    } catch (error) {
      throw new ApiError(500, "Something went wrong")
    }
  }
);

export {
    premiumCalculation,
    uploadExcel
}