import {Router} from 'express';
import dummyArray from '../data.mjs';
import User from '../mongoose/schema.mjs'
import {hashed, compared} from '../helper/hasher.mjs';

const router = Router();

router.post('/user', async (req,res) =>{
    const obj = req.body;
    obj.password = hashed(obj.password);
    const user = new User(obj);
    try {
        await user.save();
        return res.status(200).send("User added succesfully");
    } catch (err) {
        return res.send(`${err}, user not added Successfully`);
    }    
})

router.put('/user/:id', (req, res) =>{
    const {body} = req;
    const {id} = req.params;

    let parsedId = parseInt(id);
    if(isNaN(parsedId)){
        return res.status(404).send("Not a number, Bad Request");
    }
    const findPerson = dummyArray.find((element) => element.id===parsedId);

    if(findPerson===undefined){
        return res.status(404).send("Id not Found");
    }

    dummyArray[findPerson.id] = {id:parsedId, ...body};
    console.log(dummyArray);
    return res.status(200).send("Request to update successful.")
})

export default router;