// Importing the dependencies installed into package.json using npm
const express = require("express");
const Joi = require("joi");
const cors = require("cors");
const {Item} = require("./firebase.js"); // Importing initializations from firebase.js
const {addDoc, getDocs, getDoc, deleteDoc, updateDoc, doc} = require("firebase/firestore"); //Firestore functions
const functions = require("firebase-functions");

// Establish an instance of an express application
const app = express();
app.use(express.json());
app.use(cors());

// Endpoint for retrieving data from the firestore database
app.get("/GetInventory", async(req, res) => {
    // Retrieve documents from a collection
try{const getItems = await getDocs(Item);
    // Respond to the client with all documents within the collection
res.status(200).send(getItems.docs.map((doc) => ({id: doc.id, ...doc.data()})))
} catch(error){
    console.log(error);
    res.status(500).send("Internal server error");
}
});

// Endpoint for making entries into the database
app.post("/CreateInventory", async(req, res) => {
    const makeData = req.body;
    // Validation script to create homogenous structure to every entity
    const schema = Joi.object({
        item: Joi.string().max(20).required(),
        description: Joi.string().max(100).required(),
        condition: Joi.string().max(15).required()
    });

    const valData = schema.validate(makeData);
    //Checking whether the validation script returned an error due to bad input
    if(valData.error){
        return res.status(400).send({error: valData.error.details[0].message})
    }
    // Adding entry to a document within the Item collection
    await addDoc(Item, valData.value);
    return res.status(200).send({msg: "Item Added"});
});

// Endpoint for updateing data within the database
app.post("/UpdateInventory", async(req, res) => {
    const updateData = req.body.id;
    const reqData = req.body; 
    // validation script
    const schema = Joi.object({
        id: Joi.string().required(),
        item: Joi.string().max(20),
        description: Joi.string().max(100),
        condition: Joi.string().max(15)
    })
    const valResult = schema.validate(reqData);
    // Checking for validation error
    if(valResult.error){
        res.status(400).send({error: valResult.error.details[0].message});
    }
    // Removing the id proprty of an entry and updating a certain part of the data with new provided information
    delete req.body.id;
    await updateDoc(doc(Item, updateData), reqData);
    res.status(200).send({msg: "Inventory Updated"});
});

//Endpoint for delete individual documents from the firestore database
app.post("/DeleteInventory", async(req, res) => {
    const deleteItemid = req.body.item;
    // validation script
    const schema = Joi.object({
        item: Joi.string().max(20).required()
    });
    const valData = schema.validate({ item: deleteItemid});
    // Checking for validation error
    if(valData.error){
       res.status(400).send({error: valData.error.details[0].message})
    }
    
    // Looking item user is trying to delete and informing them if it doesn't exist
    try{
        const snapShot = await getDocs(Item);
        const matchingDoc = snapShot.docs.find(doc => doc.data().item === deleteItemid);

        if(!matchingDoc){
            res.status(404).send({error: "Item not found"});
        }
          // remove a document from the collection
        await deleteDoc(doc(Item, matchingDoc.id));

        res.status(200).send({msg: "Item Deleted"});

    } catch (error){
        res.status(400).send({msg: "Error encountered!"});
    }

  
});

// Creates variable that is used to export the endpoints together as a cloud function during deployment
exports.api = functions.https.onRequest(app);