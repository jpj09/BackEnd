const { saveImageToS3 } = require('../Utils/imageUploader');

const uploadImage = async (req, res, next) =>{
    await saveImageToS3(req, res, (err) => {
        if(err){
            console.log(err);
           res.json({
             status: 'Bad request' ,
             code: 400,
             message : 'image uploading failed',
             error:err
           });
        }else {
            res.json({
                status: 'Success' ,
                code: 200,
                url: req.file.location,
                message : 'Image uploaded successfully'
              });
        } 
    });
}

module.exports = {uploadImage}