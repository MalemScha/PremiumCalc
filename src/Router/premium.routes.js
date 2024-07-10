import {Router} from "express"
import {uploadExcel, premiumCalculation} from "../controller/premium.controller.js"
import {upload} from "../middleware/multer.middleware.js"
const router = Router()

router.route("/upload").post(
    upload.fields([
        {
            name: "premium",
            maxCount: 1
        }
    ]),
    uploadExcel
)

router.route("/calculate-premium").post(
    premiumCalculation
)

export default router;