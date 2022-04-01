const User = require("../models/User");
const mongoose = require("mongoose");
const fs = require('fs');
const DIR = './';

module.exports = class UserController {

  //New User Create
  static createUser = async (req, res) => {
    let payload = req.body;

    //Image check if have then include image into payload
    var imgUrl = "";
    if (req.file) var imgUrl = `storage/images/${req.file.filename}`;
    payload.avater = imgUrl;

    //return console.log(payload)
    try {
      const userCreate = await new User(payload).save();
      return res.status(200).json({
        code: 200,
        message: "User Create Successfully",
        data: userCreate,
      });
    } catch (error) {
      res.status(501).json({
        code: 501,
        message: error.message,
        error: true,
      });
    }
  };


  //Single User Information
  static singleUser = async(req, res)=>{
    const id = req.params.id;

    try{
      const singleUserInfo = await User.findById(id);
      const {name, email, phone, avater} =singleUserInfo;
      var getImageName = avater.match(/\/([^\/?#]+)[^\/]*$/);
      
      const singleuUserData ={
        name,
        email,
        phone,
        imageUrl: `http://localhost:5000/user/${getImageName[1]}`
      }
      return res.status(200).json({
        code: 200,
        message: "User Information",
        data: singleuUserData,
      });
      //return console.log(singleUserInfo)
    }
    catch(error){
      res.status(501).json({
        code: 501,
        message: error.message,
        error: true,
      });
    }
  }


  //User Update by User Id
  static updateUser = async(req, res)=>{
    const id = req.params.id;
    let reqBody = req.body;

    //If File have then push file into reqBody then process update
    var imgUrl = '';
    if(req.file) var imgUrl = `storage/images/${req.file.filename}`;
    reqBody.avater = imgUrl;
    
    
    try{
        //Check user have photo/image. if had then first delete local file then database
        const userInfo = await User.findById(id);
        const userPhotoInfo = userInfo.avater;
        if(userPhotoInfo){
          fs.unlinkSync(DIR + userPhotoInfo);
        }

        const updateItem = await User.findOneAndUpdate( { _id: id }, reqBody );
        return res.status(200).json({
          code: 200,
          message: "User Update Information Successfully",
          data: updateItem,
        });


    }catch(error){
      res.status(501).json({
        code: 501,
        message: error.message,
        error: true,
      });
    }

  }


  //User Delete By User Id
  static deleteUser = async(req, res)=>{
    const id = req.params.id;
    //return console.log(id)
    try{
     
        //Check user have photo/image. if had then first delete local file then database
        const userInfo = await User.findById(id);
        const userPhotoInfo = userInfo.avater;
        if(userPhotoInfo){
          fs.unlinkSync(DIR + userPhotoInfo);
        }

        const userDelete = await User.deleteOne({_id: id});
        return res.status(200).json({
          code: 200,
          message: "User Delete Successfully",
          data: userDelete,
        });
    }catch(error){
      res.status(501).json({
        code: 501,
        message: error.message,
        error: true,
      });
    }
  }


};
