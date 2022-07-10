var express = require('express');
const { render } = require('../app');
var router = express.Router();
const productHelpers=require('../helpers/product-helpers')
const verifyAdminLogin=(req,res,next)=>{
  if(req.session.adminLoggedIn){
    next()
  }else{
    res.redirect('/admin/adlogin')
  }
}

/* GET users listing. */
router.get('/signIn',(req,res)=>{
  res.render('admin/signIn') //,{admin:true}
});

/*router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    console.log(products)
    res.render('admin/view-products',{admin:true,products})
  })
});*/

router.post('/signIn',(req,res)=>{
  productHelpers.adminSignIn(req.body).then((response)=>{
    console.log(req.body)
    req.session.admin=response
    req.session.admin.adminLoggedIn=true
    res.render('admin/adprofile',{admin:true})
  })
})



router.get('/add-product',(req,res)=>{
  res.render('admin/add-product',{admin:true})
})
router.post('/add-product',(req,res)=>{
  /*console.log(req.body);
  console.log(req.files.Image);*/

 productHelpers.addProduct(req.body,(id)=>{
  let image=req.files.Image
  console.log(id);
  image.mv("./public/product-images/"+id+'.jpeg',(err)=>{
    if(!err){
      res.render("admin/add-product")

    }else{
      console.log(err);

    }

})
  
}) 
})
router.get('/delete-product/:id',(req,res)=>{

  let proId=req.params.id
  console.log(proId)
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/')
  })
  })

router.get('/edit-product/:id',async(req,res)=>{
  let product=await productHelpers.getProductDetails(req.params.id)
  console.log(product)
  res.render('admin/edit-product',{product})
})  
router.post('/edit-product/:id',(req,res)=>{
  let id=req.params.id
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.Image){
      let image=req.files.Image
      image.mv("./public/product-images/"+id+'.jpeg')

    }
  })

})
router.get('/adlogin',(req,res)=>{
  if(req.session.admin){
    productHelpers.getAllProducts().then((products)=>{
      console.log(products)                                         
      res.render('admin/view-products',{admin:true,products})        //res.render('admin/adprofile',{admin:true})
    })
  }
  else{
    res.render('admin/adlogin',{'adminLoginErr':req.session.adminLoginErr})  //,{admin:true}
    req.session.adminLoginErr=false
  }
  
})
router.post('/adlogin',(req,res)=>{
  productHelpers.adminLogin(req.body).then((response)=>{
    if(response.status){
      req.session.admin=response.admin
      req.session.adminLoggedIn=true
      productHelpers.getAllProducts().then((products)=>{
        console.log(products)                                         
        res.render('admin/view-products',{admin:true,products})
      })
      
    }
    else{
      
      req.session.adminLoginErr='Invalid username or Password'
      res.redirect('/admin/adlogin')
      
    }


  })
  
})
router.get('/adlogout',(req,res)=>{
  req.session.admin=null
  req.session.adminLoggedIn=false
  res.render('admin/adlogin')       //twas res.redirect('/')
})
router.get('/allOrders',(req,res)=>{
  productHelpers.getAllOrders().then((allor)=>{
    res.render('admin/All-Orders',{admin:true,allor})
  })
  
})
router.get('/allUsers',(req,res)=>{
  productHelpers.getAllUsers().then((allus)=>{
  res.render('admin/All-Users',{admin:true,allus}) 
  })
  //put it inside function
})


module.exports = router;