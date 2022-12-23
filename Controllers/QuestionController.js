const dynamoose = require("dynamoose");
const Question = require('../Models/QuestionModel');
const uuid = require("uuid");
const { options } = require("../Routes/routes");
var AWS = require("aws-sdk");
const { response } = require("express");
var DynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1',"accessKeyId": "AKIAQQS7LCXXCGEETTVP",
"secretAccessKey": "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", });


const addQuestion = async (req, res, next) => {
    

//    let question = new Question({
//        id: uuid.v1(),
//        category:  req.body.category.toLowerCase(),
//        seriesNumber: req.body.series, 
//        url: req.body.url,
//        title: req.body.question, 
//        option1: req.body.option1,
//        option2: req.body.option2,
//        option3: req.body.option3,
//        option4: req.body.option4,
//        option1Key: req.body.option1Key,
//        option2Key: req.body.option2Key,
//        option3Key: req.body.option3Key,
//        option4Key: req.body.option4Key,
//        questionType: req.body.questionType,
//        description: req.body.description,
//        createdAt: Date.now(),
//        language: req.body.language 
//    });

    let question=null

    if (req.body.questions.length==1){
        var params={
            TableName: "mockQuestion",
            Item: {
                "id": uuid.v1(),
                "category": req.body.category.toLowerCase(),
                "seriesNumber": req.body.seriesNumber,
                "url": req.body.url,
                "language": req.body.language,
                "createdAt": Date.now(),
                "questions":[
                   {
                        "title": req.body.questions[0].title,
                        "option1": req.body.questions[0].option1,
                        "option2": req.body.questions[0].option2,
                        "option3": req.body.questions[0].option3,
                        "option4": req.body.questions[0].option4,
                        "option1Key": req.body.questions[0].option1Key,
                        "option2Key": req.body.questions[0].option2Key,
                        "option3Key": req.body.questions[0].option3Key,
                        "option4Key": req.body.questions[0].option4Key,
                        "questionType": req.body.questions[0].questionType,
                        "description": req.body.questions[0].description
                    }
                ]
        }
        }




        // question= new Question(abc)
        DynamoDB.put(params, function (err) {
            if (err) {
                console.log(err)
                res.json({
                    status: 'Bad Request' ,
                    code: 400,
                });
            }else{
                res.json({
                    status: 'Ok',
                    code: 200
                })
            }
        }) 
    }
    

    if (req.body.questions.length>1){
        var params={
            TableName: "mockQuestion",
            ReturnConsumedCapacity: "TOTAL",
            Item: {
                "id": uuid.v1(),
                "category": req.body.category.toLowerCase(),
                "seriesNumber": req.body.seriesNumber,
                "url": req.body.url,
                "language": req.body.language,
                "createdAt": Date.now(),
                "questions":[
                   {
                        "title": req.body.questions[0].title,
                        "option1": req.body.questions[0].option1,
                        "option2": req.body.questions[0].option2,
                        "option3": req.body.questions[0].option3,
                        "option4": req.body.questions[0].option4,
                        "option1Key": req.body.questions[0].option1Key,
                        "option2Key": req.body.questions[0].option2Key,
                        "option3Key": req.body.questions[0].option3Key,
                        "option4Key": req.body.questions[0].option4Key,
                        "questionType": req.body.questions[0].questionType,
                        "description": req.body.questions[0].description
                    },
                    {
                        "title": req.body.questions[1].title,
                        "option1": req.body.questions[1].option1,
                        "option2": req.body.questions[1].option2,
                        "option3": req.body.questions[1].option3,
                        "option4": req.body.questions[1].option4,
                        "option1Key": req.body.questions[1].option1Key,
                        "option2Key": req.body.questions[1].option2Key,
                        "option3Key": req.body.questions[1].option3Key,
                        "option4Key": req.body.questions[1].option4Key,
                        "questionType": req.body.questions[1].questionType,
                        "description": req.body.questions[1].description
                    }
                ]
        }
        }


    DynamoDB.put(params, function (err) {
        if (err) {
            console.log(err)
            res.json({
                status: 'Bad Request' ,
                code: 400,
            });
        }else{
            res.json({
                status: 'Ok',
                code: 200
            })
        }
    })
    }
}

const getAllQuestions = async (req, res, next) => {

    const params={
        TableName: 'mockQuestion',
    }

    DynamoDB.scan(params, function (err,response) {
        if (err) {
            console.log(err)
            res.json({
                status: 'Bad Request' ,
                code: 400,
            });
        }else{
            if(response.Count > 0){
               var temp = []
               for(var i = 0 ; i < response.Count ; i++){
                for(let j=0;j<response.Items[i].questions.length;j++){
                    var options = compressOptions(response.Items[i].questions[j])   
                    delete response.Items[i].questions[j].option1
                    delete response.Items[i].questions[j].option2
                    delete response.Items[i].questions[j].option3
                    delete response.Items[i].questions[j].option4
                    delete response.Items[i].questions[j].option1Key
                    delete response.Items[i].questions[j].option2Key
                    delete response.Items[i].questions[j].option3Key
                    delete response.Items[i].questions[j].option4Key
                    response.Items[i].questions[j].options =  options 
                    console.log(response.Items[i])
                }
                temp.push(response.Items[i])
               }
               res.json({
                status: 'Ok',
                code: 200,
                data:temp.reverse()
            })
            } else if(response.Count === 0){
                res.json({
                    status: 'Empty list',
                    code: 200,
                    data:[]
                })
            }
           
        }
    })
   

 }

const getQuestions = async (req, res, next) => {
    const params={
        TableName: 'mockQuestion',
        FilterExpression:
          "attribute_not_exists(deletedAt) AND contains(category, :category) AND contains(seriesNumber, :seriesNumber)",
        ExpressionAttributeValues: {
          ":category": req.body.category,
          ":seriesNumber": req.body.seriesNumber
        }
    }

    DynamoDB.scan(params, function (err,response) {
        if (err) {
            console.log(err)
            res.json({
                status: 'Bad Request' ,
                code: 400,
            });
        }else{

            if(response.Count > 0){
                var temp = []
                for(var i = 0 ; i < response.Count ; i++){
                 for(let j=0;j<response.Items[i].questions.length;j++){
                     var options = compressOptions(response.Items[i].questions[j])   
                     delete response.Items[i].questions[j].option1
                     delete response.Items[i].questions[j].option2
                     delete response.Items[i].questions[j].option3
                     delete response.Items[i].questions[j].option4
                     delete response.Items[i].questions[j].option1Key
                     delete response.Items[i].questions[j].option2Key
                     delete response.Items[i].questions[j].option3Key
                     delete response.Items[i].questions[j].option4Key
                     response.Items[i].questions[j].options =  options 
                     console.log(response.Items[i])
                 }
                 temp.push(response.Items[i])
                }
                res.json({
                    status: 'Ok',
                    code: 200,
                    data:temp.reverse()
                })
             }else if(response.Count === 0){
                res.json({
                    status: 'Empty list',
                    code: 200,
                    data:[]
                })
            }

           
        }
    })
 }

 function compressOptions(data){
    var options = []   
    for(var j = 1 ; j <= 4 ; j++){
        switch(j){
            case 1: 
                var object = {
                    label: data.option1,
                    value: data.option1Key == true ? 1 : 0,
                }
                options.push(object)
                break;
            case 2: 
                var object = {
                    label: data.option2,
                    value: data.option2Key == true ? 1 : 0,
                }
                options.push(object)
                break;
            case 3: 
                if(data.option3 != '') {
                    var object = {
                        label: data.option3,
                        value: data.option3Key == true ? 1 : 0,
                    }
                    options.push(object)
                }
                break;
            case 4: 
                if(data.option4 != '') {
                    var object = {
                        label: data.option4,
                        value: data.option4Key == true ? 1 : 0,
                    }
                    options.push(object)
                }
                break;   
        }
    }
 
   return options
 }

 const deleteSpecificQuestion = async (req, res, next) => {
    const params={
        TableName: 'mockQuestion',
        Key: { "id":req.body.id},
    }
    

    DynamoDB.delete(params, function (err,data) {
        if (err) {
            console.log(err)
            res.json({
                status: 'Bad Request' ,
                code: 400,
            });
        }else{
            res.json({
                status: 'Item deleted',
                code: 200,
            })
        }
    })
 }

 const updateSpecificQuestion = async (req, res, next) => {

    let Item=null;

    if(req.body.questions.length==1){
        Item={
            id: req.body.id,
            category: req.body.category.toLowerCase(),
            seriesNumber: req.body.seriesNumber,
            image_url: req.body.url,
            language: req.body.language,
            createdAt: Date.now(),
            questions:[
               {
                    title: req.body.questions[0].title,
                    option1: req.body.questions[0].option1,
                    option2: req.body.questions[0].option2,
                    option3: req.body.questions[0].option3,
                    option4: req.body.questions[0].option4,
                    option1Key: req.body.questions[0].option1Key,
                    option2Key: req.body.questions[0].option2Key,
                    option3Key: req.body.questions[0].option3Key,
                    option4Key: req.body.questions[0].option4Key,
                    questionType: req.body.questions[0].questionType,
                    description: req.body.questions[0].description
                }
            ]
    }    
    }else if (req.body.questions.length>1){
        Item={
            id: req.body.id,
            category: req.body.category.toLowerCase(),
            seriesNumber: req.body.seriesNumber,
            image_url: req.body.url,
            language: req.body.language,
            createdAt: Date.now(),
            questions:[
               {
                    title: req.body.questions[0].title,
                    option1: req.body.questions[0].option1,
                    option2: req.body.questions[0].option2,
                    option3: req.body.questions[0].option3,
                    option4: req.body.questions[0].option4,
                    option1Key: req.body.questions[0].option1Key,
                    option2Key: req.body.questions[0].option2Key,
                    option3Key: req.body.questions[0].option3Key,
                    option4Key: req.body.questions[0].option4Key,
                    questionType: req.body.questions[0].questionType,
                    description: req.body.questions[0].description
                },
                {
                    title: req.body.questions[1].title,
                    option1: req.body.questions[1].option1,
                    option2: req.body.questions[1].option2,
                    option3: req.body.questions[1].option3,
                    option4: req.body.questions[1].option4,
                    option1Key: req.body.questions[1].option1Key,
                    option2Key: req.body.questions[1].option2Key,
                    option3Key: req.body.questions[1].option3Key,
                    option4Key: req.body.questions[1].option4Key,
                    questionType: req.body.questions[1].questionType,
                    description: req.body.questions[1].description
                }
            ]
    }
    
    }


    
    let params={
        TableName: "mockQuestion",
        Key: {
        id: Item.id,
        },
        UpdateExpression: `set category = :category,
        questions = :questions,
        seriesNumber= :seriesNumber,
        #i_url= :image_url,
        #lang = :languages`,
        ExpressionAttributeValues: {
        ":category": Item.category,
        ":seriesNumber": Item.seriesNumber,
        ":questions": Item.questions,
        ":image_url":Item.image_url,
        ":languages":Item.language,
        },
        ExpressionAttributeNames: {
            "#i_url": "url",
            "#lang":"language"
        },
    }

    DynamoDB.update(params, function (err,data) {
        if (err) {
            console.log(err)
            res.json({
                status: 'Bad Request' ,
                code: 400,
            });
        }else{
            res.json({
                status: 'Item Updated',
                code: 200,
            })
        }
    })

    // await  Question.update(questionObject, (error) => {
    //     if (error) {
    //         console.log(error)
    //        res.json({
    //           code: 400,
    //           message: "Bad request",
    //        });
    //     } else {
    //        res.json({
    //           code: 200,
    //           message: "Question Updated",
    //        });
    //     }
    //  });
 }

   module.exports = { addQuestion, getQuestions, getAllQuestions, deleteSpecificQuestion, updateSpecificQuestion }