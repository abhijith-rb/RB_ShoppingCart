var db=require('../config/connection')
var collection=require('../config/collections')
const { ObjectId } = require('mongodb')
var objectId=require('mongodb').ObjectId
const bcrypt=require('bcrypt')
const { ORDER_COLLECTION } = require('../config/collections')
module.exports={

    addProduct:(product,callback)=>{
        //console.log(product);

        db.get().collection('product').insertOne(product).then((data)=>{
           
            
            callback(product._id) //instead of  (data.ops[0]._id)


        })
    },
    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)

        })

    },
    deleteProduct:(prodId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:objectId(prodId)}).then((response)=>{
                console.log(response);

                resolve(response)

        })
        })
    },
    getProductDetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=>{
                resolve(product)
            })
        })
    },
    updateProduct:(proId,proDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:objectId(proId)},{
                $set:{
                    Name:proDetails.Name,
                    Description:proDetails.Description,
                    Price:proDetails.Price,
                    Category:proDetails.Category
                }

            }).then((response)=>{
                resolve()
                
            })

        }) 
    },
    adminSignIn:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            adminData.Password=await bcrypt.hash(adminData.Password,10)

            db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData).then((data)=>{
                resolve(adminData._id)
            })
        })

    },
    adminLogin:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            let adminloginStatus=false
            let response={}
            let admin=await db.get().collection(collection.ADMIN_COLLECTION).findOne({Email:adminData.Email})

            if(admin){
                bcrypt.compare(adminData.Password,admin.Password).then((status)=>{
                    if(status){
                        console.log('login success')
                        response.admin=admin
                        response.status=true
                        resolve(response)
                    }
                    else{
                        console.log('login failed')
                        resolve({status:false})
                    }
                })
            }
            else{
                console.log('login failed')
                resolve({status:false})
            }

        })

    },
    getAllUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            let allus=await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(allus)

        })
    },
    getAllOrders:()=>{
        return new Promise(async(resolve,reject)=>{
            let allor=await db.get().collection(collection.ORDER_COLLECTION).find().toArray()
            resolve(allor)

        })
    }
    
   
              
                
    
}