const Product = require("../models/Product");
const Card = require("../models/Cards");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const fs = require("fs")
const router = require("express").Router();
const multer = require("multer");
const { isError, forEach } = require("lodash");

//multer middleware
const Storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname)
  },
});
const upload = multer({
  storage: Storage,
}).single("image");
//CREATE

router.post("/", verifyTokenAndAdmin, async (req, res) => {
  upload(req, res, async function (error) {
    if (error) {
      return res.sendStatus(500);
    }
    else if (!req.file) {
      res.status(500).json({ alert: "please upload image for transaction" });
    }
    else {
      const newProduct = new Product(req.body);
      const imagename = req.file.filename;
      newProduct.image = imagename
      try {
        const savedProduct = await newProduct.save();
        if (savedProduct._id) {
          const productId = new Card({ productId: savedProduct._id.valueOf() })
          const savedProductId = await productId.save();
          res.status(200).json({ savedProduct, savedProductId });
        }

      } catch (err) {
        res.status(400).json(err);
      }
    }
  })
});

//UPDATE
router.put("/:id", upload,verifyTokenAndAdmin, async (req, res) => {
  const id = req.params.id;
  if (req.file) {
    const result = await Product.findById(id);
    try {
      fs.unlinkSync("./uploads/" + result.image);
    } catch (err) {
      res.status(404).json(err);
    }
    const new_image = req.file.filename;
    const newProduct = JSON.parse(JSON.stringify(req.body));
    newProduct.image = new_image;
    try {
     const dd = await Product.findByIdAndUpdate(id, newProduct);
      res.status(200).json({ massage: "product uodate successfully" });
    } catch (err) {
      res.status(404).json({ massage: err.massage });
    }
  }else {
      const newProduct = JSON.parse(JSON.stringify(req.body));
    try {
    const ff =  await Product.findOneAndUpdate({_id: id}, newProduct);
      res.status(200).json({ massage: "product uodate successfully" });
    } catch (err) {
      res.status(404).json({ massage: err.massage });
    }
  }
});
//UPDATE ALL
router.post("/updateall", upload, verifyTokenAndAdmin, async (req, res) => {
 
//   const id = JSON.parse(JSON.stringify(req.body));
//   const allprice = id.price
//   const uidname = id.intproductId
//   const allpriceresult = await Product.find({intproductId: uidname})
//              console.log(allprice && req.file)
//   if (allprice) {
//    allpriceresult.forEach(async element => {
//               const prs = allprice * 0.01 ;
//               const newBalance = element.price += element.price * prs
//               console.log(newBalance)
//               console.log(element._id)
//               const dsve = element._id.toString()
//               try {
//                 const savedOrder = await Product.updateOne({ _id: dsve}, { $set: { price: newBalance } });
//                 console.log(savedOrder)   
//               }catch (err) {
//                 console.log(err)
//               }
//               })
//  }
  const id = JSON.parse(JSON.stringify(req.body));
  const allprice = id.price
  if (req.file) {
    const newProduct = JSON.parse(JSON.stringify(req.body));
    const uidname = newProduct.intproductId
    const result = await Product.findOne({intproductId: uidname});
    console.log(result)
    try {
      fs.unlinkSync("./uploads/" + result.image);
    } catch (err) {
      res.status(404).json(err);
    }
    const new_image = req.file.filename;
    newProduct.image = new_image;
    try {
     const dd = await Product.updateMany({intproductId:uidname},{$set:{image: new_image}});
     console.log(dd)
      res.status(200).json({ massage: "product uodate successfully" });
    } catch (err) {
      res.status(404).json({ massage: err.massage });
    }
  }else if (allprice) {
      const id = JSON.parse(JSON.stringify(req.body));
  const allprice = id.price
  const uidname = id.intproductId
  const allpriceresult = await Product.find({intproductId: uidname})
            //  console.log(allprice && req.file)
  if (allprice) {
   allpriceresult.forEach(async element => {
              const prs = allprice * 0.01 ;
              const newBalance = element.price += element.price * prs
              // console.log(newBalance)
              // console.log(element._id)
              const dsve = element._id.toString()
              console.log(newBalance.toFixed())
              const newBalanceint = newBalance.toFixed()
              try {
                const savedOrder = await Product.updateOne({ _id: dsve}, { $set: { price: newBalanceint } });
                console.log(savedOrder)   
              }catch (err) {
                console.log(err)
              }
              })
 }
  }
  //  {
  //     const newProduct = JSON.parse(JSON.stringify(req.body));
  //   try {
  //   const ff =  await Product.findOneAndUpdate({_id: id}, newProduct);
  //     res.status(200).json({ massage: "product uodate successfully" });
  //   } catch (err) {
  //     res.status(404).json({ massage: err.massage });
  //   }
  // }

});

router.post("/updatealldown", verifyTokenAndAdmin, async (req, res) => {
    const id = JSON.parse(JSON.stringify(req.body));
    const allprice = id.price
    const uidname = id.intproductId
    const allpriceresult = await Product.find({intproductId: uidname})
    console.log(allprice && req.file)
    allpriceresult.forEach(async element => {
                const prs = -allprice * 0.01 ;
                console.log(prs)
                const newBalance = element.price += element.price * prs
                console.log(newBalance)
                console.log(element._id)
                const dsve = element._id.toString()
                const newBalanceint = newBalance.toFixed()
                try {
                  const savedOrder = await Product.updateOne({ _id: dsve}, { $set: { price: newBalanceint } });
                  console.log(savedOrder)   
                }catch (err) {
                  console.log(err)
                }
                })
  });
//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Product.findByIdAndDelete(id);
    if (result.image != "") {
        fs.unlinkSync("./uploads/" + result.image); 
    }
    res.status(200).json({ massage: "Product deleted successfully" });
  } catch (err) {
    res.status(404).json({ massage: err.massage });
  }
});

//GET PRODUCT
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.find({ intproductId: req.params.id });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL PRODUCTS
router.get("/allproduct", verifyTokenAndAdmin, async (req, res) => {
  try {
    const products = await Product.find()
    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
